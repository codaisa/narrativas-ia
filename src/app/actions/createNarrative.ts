"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "googleapis";
import {
    batchUpdateDocument,
    getDocument,
    getAuthClient,
} from "@/libs/googleDocs";
import { extractBlocks } from "@/libs/docsUtils";

export interface CreateNarrativeResult {
    status: "idle" | "loading" | "success" | "error";
    url?: string;
    error?: string;
}

export async function createNarrativeAction(
    _state: CreateNarrativeResult,
    formData: FormData
): Promise<CreateNarrativeResult> {

    try {
        // 1) Extrai tudo do form
        const templateId = formData.get("docId") as string;
        const systemPromptBase = formData.get("systemPromptBase") as string;
        const title = formData.get("title") as string;
        const tipo = formData.get("tipo") as string;
        const diretoria = formData.get("diretoria") as string;

        // 2) Autentica
        const auth = getAuthClient();

        // 3) Copia o template
        const drive = google.drive({ version: "v3", auth });
        const copyRes = await drive.files.copy({
            fileId: templateId,
            requestBody: {
                name: `NarrativaIA – ${title}`,
            },
        });

        const newDocId = copyRes.data.id!;

        await drive.permissions.create({
            fileId: newDocId,
            requestBody: {
                role: "reader",
                type: "anyone",
                allowFileDiscovery: false
            },
        });

        const meta = await drive.files.get({
            fileId: newDocId,
            fields: "id, name, webViewLink",
        });

        // 4) Leia o clone e extraia headings
        const doc = await getDocument(newDocId);

        const headings = [
            "delimitação do problema",
            "apresentação do tema",
            "faq (perguntas frequentes)",
            "pontos de decisão",
            "próximos passos",
            "próximas reuniões",
        ];

        // 3) extraia blocos
        const blocks = extractBlocks(doc, headings);

        let history = "";

        const requests: any[] = [];

        // 4) para cada bloco, chame a IA e acumule
        for (const block of blocks) {

            const promptForAI = `
            HISTÓRICO:
            ${history}

            TÓPICO: ${block.heading}

            CONTEÚDO ATUAL DO TÓPICO:
            ${block.text}

            CONTEXTO GERAL: Título=${title}, Tipo=${tipo}, Diretoria=${diretoria}

            INSTRUÇÕES: …seu mainPrompt específico…
            `;

            // 5) Prepare cabeçalho + SCAMPER
            // chame a IA
            const { textStream } = streamText({
                model: openai("gpt-3.5-turbo"),
                system: systemPromptBase,
                prompt: promptForAI,
            });
            let aiText = "";
            for await (const chunk of textStream) aiText += chunk;

            // 5) Agende remoção do conteúdo antigo e inserção do novo
            // primeiro remove o intervalo
            requests.push({
                deleteContentRange: { range: { startIndex: block.startIndex, endIndex: block.endIndex } },
            });

            // depois insere a resposta
            requests.push({
                insertText: {
                    text: `\n${aiText.trim()}\n\n`,
                    location: { index: block.startIndex },
                },
            });

            history += `TÓPICO: ${block.heading}\n${aiText.trim()}\n\n`;
        }

        // 6) Aplique tudo no clone
        await batchUpdateDocument(newDocId, requests);

        // 7) Retorne a URL do novo documento
        const newDocUrl = `https://docs.google.com/document/d/${newDocId}`;
        return { status: "success", url: newDocUrl };

    } catch (e: any) {
        console.error(e);
        return { status: "error", error: e.message };

    }
}
