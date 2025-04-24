// app/actions/createNarrative.ts
"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { batchUpdateDocument, getDocument } from "@/libs/googleDocs";
import { extractTopics } from "@/libs/docsUtils";

export async function createNarrativeAction(formData: FormData) {

    console.log(formData)
    const docId = formData.get("docId") as string;
    const systemPromptBase = formData.get("systemPromptBase") as string;
    const userPromptBase = formData.get("userPromptBase") as string;

    // 1) busca o documento e extrai headings (HEADING_2)
    const doc = await getDocument(docId);
    const topics = extractTopics(doc);

    const requests: Array<{ insertText: { text: string; location: { index: number } } }> = [];

    // 2) para cada tópico, gera via stream
    for (const topic of topics) {
        const { textStream } = streamText({
            model: openai("gpt-3.5-turbo"),
            system: systemPromptBase,
            prompt: `${userPromptBase}\n\nTópico: ${topic.text}`,
        });

        // 3) acumula o texto que chega no stream
        let aiText = "";
        for await (const chunk of textStream) {
            aiText += chunk;
        }

        // 4) prepara a request para inserir no doc
        requests.push({
            insertText: {
                text: aiText.trim() + "\n\n",
                location: { index: topic.insertIndex },
            },
        });
    }

    // 5) aplica todas as inserções de uma vez
    await batchUpdateDocument(docId, requests);

    // 6) retorna a URL para o cliente abrir
    return `https://docs.google.com/document/d/${docId}`;
}
