import type { docs_v1 } from "googleapis";

function cleanHeading(s: string | null | undefined): string {
    return s
        ? s.trim().replace(/[:\s]+$/, "").toLowerCase()
        : "";
}

/**
 * Extrai todos os parágrafos que são HEADING_1/HEADING_2 ou cujo primeiro run está em bold,
 * normaliza o texto via cleanHeading e só retorna aqueles que estão na lista wantedHeadings.
 */
export function extractTopics(
    doc: docs_v1.Schema$Document,
    wantedHeadings: string[]
): { text: string; insertIndex: number }[] {
    const want = wantedHeadings.map(cleanHeading);
    const topics: { text: string; insertIndex: number }[] = [];

    for (const el of doc.body?.content || []) {
        const p = el.paragraph;
        if (!p) continue;

        const style = p.paragraphStyle?.namedStyleType;
        const run = p.elements?.[0].textRun;
        const raw = run?.content;
        const bold = run?.textStyle?.bold === true;
        const txt = cleanHeading(raw);

        if (
            txt &&
            (style === "HEADING_1" || style === "HEADING_2" || bold) &&
            want.includes(txt)
        ) {
            topics.push({ text: txt, insertIndex: el.endIndex ?? 1 });
        }
    }

    return topics;
}

/**
 * Para cada tópico extraído por extractTopics, coleta todo o texto entre
 * o endIndex desse tópico e o startIndex do próximo tópico (ou fim do doc).
 */
export function extractBlocks(
    doc: docs_v1.Schema$Document,
    wantedHeadings: string[]
): Array<{ heading: string; startIndex: number; endIndex: number; text: string }> {
    // 1) extrai e normaliza os tópicos
    const topics = extractTopics(doc, wantedHeadings);

    // 2) ordena pela posição no documento (apenas para garantir)
    topics.sort((a, b) => a.insertIndex - b.insertIndex);

    const content = doc.body?.content || [];
    const blocks: Array<{ heading: string; startIndex: number; endIndex: number; text: string }> = [];

    for (let i = 0; i < topics.length; i++) {
        const { text: heading, insertIndex: startIndex } = topics[i];
        const endIndex =
            i + 1 < topics.length ? topics[i + 1].insertIndex : content.slice(-1)[0].endIndex!;

        // 3) acumula todo texto cujo range caia dentro de [startIndex, endIndex)
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
