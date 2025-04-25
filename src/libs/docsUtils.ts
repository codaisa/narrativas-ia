import type { docs_v1 } from "googleapis";

/**
 * Varre body.content e coleta parágrafos que:
 *  - ou têm namedStyleType HEADING_1/HEADING_2
 *  - ou o primeiro textRun está em bold
 * Depois filtra pelo texto bater (lowercase) com wantedHeadings.
 */
export function extractTopics(
    doc: docs_v1.Schema$Document,
    wantedHeadings: string[]
): { text: string; insertIndex: number }[] {
    const topics: { text: string; insertIndex: number }[] = [];

    for (const el of doc.body?.content || []) {
        const p = el.paragraph;
        if (!p) continue;

        const style = p.paragraphStyle?.namedStyleType;
        // pega o primeiro run de texto
        const run = p.elements?.[0].textRun;
        const txt = run?.content?.trim();
        const isBold = run?.textStyle?.bold === true;

        // considere título se for heading‐style ou ifirst run estiver em bold
        if (
            txt &&
            (style === "HEADING_1" ||
                style === "HEADING_2" ||
                isBold)
        ) {
            const lower = txt.toLowerCase();
            // só inclua se estiver na lista (também lowercase)
            if (wantedHeadings.includes(lower)) {
                topics.push({
                    text: lower,
                    insertIndex: el.endIndex ?? 1,
                });
            }
        }
    }

    return topics;
}



export function extractBlocks(
    doc: docs_v1.Schema$Document,
    wantedHeadings: string[]
): Array<{ heading: string; startIndex: number; endIndex: number; text: string }> {
    // 1) pega todos os títulos do doc (com índice)…
    const allTopics = extractTopics(doc, wantedHeadings);
    // 2) filtra só os que eu quero (por lowercase)
    const topics = allTopics.filter((t) =>
        wantedHeadings.includes(t.text.toLowerCase())
    );

    const blocks: Array<any> = [];
    const content = doc.body?.content || [];

    for (let i = 0; i < topics.length; i++) {
        const { text: heading, insertIndex: startIndex } = topics[i];
        // o fim do bloco é o início do próximo tópico, ou o fim do documento
        const endIndex =
            i + 1 < topics.length ? topics[i + 1].insertIndex : content.slice(-1)[0].endIndex!;

        // 3) varre todo content e acumula texto cujos índices caem dentro desse intervalo
        let blockText = "";
        for (const el of content) {
            const elStart = el.startIndex ?? 0;
            const elEnd = el.endIndex ?? 0;
            if (elStart >= startIndex && elEnd <= endIndex) {
                for (const e of el.paragraph?.elements || []) {
                    blockText += e.textRun?.content || "";
                }
            }
        }

        blocks.push({ heading, startIndex, endIndex, text: blockText.trim() });
    }

    return blocks;
}