import type { docs_v1 } from "googleapis";

/**
 * Varre body.content e coleta todos os parágrafos com estilo HEADING_2.
 * Retorna texto e o índice onde devemos inserir a resposta.
 */
export function extractTopics(
    doc: docs_v1.Schema$Document
): { text: string; insertIndex: number }[] {
    const topics: { text: string; insertIndex: number }[] = [];
    for (const el of doc.body?.content || []) {
        const style = el.paragraph?.paragraphStyle?.namedStyleType;
        if (style === "HEADING_2") {
            const run = el.paragraph?.elements?.[0].textRun;
            const txt = run?.content?.trim();
            if (txt) {
                topics.push({
                    text: txt,
                    insertIndex: el.endIndex ?? 1,
                });
            }
        }
    }
    return topics;
}
