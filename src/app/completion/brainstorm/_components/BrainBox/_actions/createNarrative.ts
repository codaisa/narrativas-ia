"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "googleapis";
import {
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
        const brainstorm = formData.get("brainstormData") as string | null;
        const templateId = formData.get("docId") as string;
        const systemPromptBase = formData.get("systemPromptBase") as string;
        const title = formData.get("title") as string;

        const auth = getAuthClient();
        const drive = google.drive({ version: "v3", auth });
        const docs = google.docs({ version: "v1", auth });

        // Copia o template
        const copyRes = await drive.files.copy({
            fileId: templateId,
            requestBody: { name: `NarrativaIA – ${title}` },
        });
        const newDocId = copyRes.data.id!;
        await drive.permissions.create({
            fileId: newDocId,
            requestBody: { role: "writer", type: "anyone", allowFileDiscovery: false },
        });

        // headings na ordem
        const headings = [
            "Delimitação do Problema",
            "Apresentação do Tema",
            "FAQ (Perguntas Frequentes)",
            "Pontos de Decisão",
        ];

        let history = "";

        for (const heading of headings) {
            // sempre buscar documento atualizado
            const doc = await getDocument(newDocId);

            // extrai apenas o bloco deste heading
            const blocks = extractBlocks(doc, [heading]);
            if (blocks.length === 0) continue;
            const block = blocks[0];

            // gera prompt
            const promptForAI = `
                BRAINSTORM(SCAMPER):
                ${brainstorm}

                HISTÓRICO:
                ${history}

                TÓPICO: ${block.heading}

                CONTEÚDO ATUAL DO TÓPICO:
                ${block.text}

                INSTRUÇÕES:
                1. NÃO COMEÇAR a resposta repetindo o título do tópico. Vá direto ao conteúdo.
                2. Não repita o conteúdo que já existe no documento.
                3. Não insira caracteres especiais como “**” nem marcações de markdown.
                4. Escreva sempre em língua portuguesa, de forma clara e objetiva.
                5. Substitua completamente o bloco “CONTEÚDO ATUAL DO TÓPICO” pelo novo texto gerado.
                6. Mantenha o estilo formal adequado para apresentação a uma diretoria.
                7. Preserve o heading, elimine instruções internas (“HISTÓRICO:”, “TÓPICO:”).
                8. Crie uma narrativa que solucione a dor informada.
                9. Não disserte sobre o que te envio, disserte sobre soluções.
                10. Não mencione algo como Problema a ser Resolvido:
            `;

            // chama OpenAI
            let aiText = "";
            const { textStream } = streamText({
                model: openai("gpt-3.5-turbo"),
                system: systemPromptBase,
                prompt: promptForAI,
            });
            for await (const c of textStream) aiText += c;

            aiText = aiText.replace(/\*\*(.+?)\*\*/g, "$1").trim();
            const headingPattern = new RegExp(`^${block.heading}\\s*`, "i");
            aiText = aiText.replace(headingPattern, "").trim();

            // aplica imediatamente delete + insert para este bloco
            const requests = [
                {
                    deleteContentRange: {
                        range: { startIndex: block.startIndex, endIndex: block.endIndex },
                    },
                },
                {
                    insertText: {
                        location: { index: block.startIndex },
                        text: `\n${aiText}\n\n`,
                    },
                },
            ];
            await docs.documents.batchUpdate({
                documentId: newDocId,
                requestBody: { requests },
            });

            // acumula histórico
            history += `TÓPICO: ${block.heading}\n${aiText}\n\n`;
        }

        return { status: "success", url: `https://docs.google.com/document/d/${newDocId}` };
    } catch (e: any) {
        console.error(e);
        return { status: "error", error: e.message };
    }
}
