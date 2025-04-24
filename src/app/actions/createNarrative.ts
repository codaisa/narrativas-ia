"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "googleapis";
import {
    batchUpdateDocument,
    getDocument,
    getAuthClient,
} from "@/libs/googleDocs";
import { extractTopics } from "@/libs/docsUtils";

export async function createNarrativeAction(formData: FormData) {
    // 1) Extrai tudo do form
    const templateId = formData.get("docId") as string;
    const systemPromptBase = formData.get("systemPromptBase") as string;
    const userPromptBase = formData.get("userPromptBase") as string;
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
            // parents: [ process.env.GOOGLE_DRIVE_FOLDER_ID! ],  // opcional
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
    console.log("Criado doc:", meta.data);


    // 4) Leia o clone e extraia headings
    const doc = await getDocument(newDocId);
    const topics = extractTopics(doc);

    // 5) Prepare cabeçalho + SCAMPER
    const requests: Array<{ insertText: { text: string; location: { index: number } } }> = [
        {
            insertText: {
                text: `Título: ${title}\nTipo: ${tipo}\nDiretoria: ${diretoria}\n\n`,
                location: { index: 1 },
            },
        },
    ];

    for (const topic of topics) {
        const { textStream } = streamText({
            model: openai("gpt-3.5-turbo"),
            system: systemPromptBase,
            prompt: `${userPromptBase}\n\nTópico: ${topic.text}`,
        });
        let aiText = "";
        for await (const chunk of textStream) {
            aiText += chunk;
        }
        requests.push({
            insertText: {
                text: aiText.trim() + "\n\n",
                location: { index: topic.insertIndex },
            },
        });
    }

    // 6) Aplique tudo no clone
    await batchUpdateDocument(newDocId, requests);

    // 7) Retorne a URL do novo documento
    return `https://docs.google.com/document/d/${newDocId}`;
}
