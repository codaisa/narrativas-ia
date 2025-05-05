import type { docs_v1 } from "googleapis";

export function cleanHeading(s: string | null | undefined): string {
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

export type DocBlock = {
    heading: string;
    startIndex: number;
    endIndex: number;
    text: string;
};

export function extractBlocks(
    doc: docs_v1.Schema$Document,
    wantedHeadings: string[]
): DocBlock[] {
    const content = doc.body?.content || [];

    const cutoffPrefix = cleanHeading("Próximos Passos");
    const cutoffEl = content.find(el => {
        const raw = el.paragraph?.elements?.[0].textRun?.content;
        return cleanHeading(raw).startsWith(cutoffPrefix);
    });
    const cutoffIndex = cutoffEl?.startIndex ?? content[content.length - 1].endIndex!;

    // 1) encontre os headings
    const headings = content
        .map(el => {
            const p = el.paragraph;
            const raw = p?.elements?.[0].textRun?.content;
            const style = p?.paragraphStyle?.namedStyleType;
            const bold = p?.elements?.[0].textRun?.textStyle?.bold;
            if (!raw) return null;
            const clean = cleanHeading(raw);
            if (
                wantedHeadings.map(cleanHeading).includes(clean) &&
                (style === "HEADING_1" || style === "HEADING_2" || bold)
            ) {
                return {
                    heading: clean,
                    headingStartIndex: el.startIndex!,
                    contentStartIndex: el.endIndex!,      // <- onde o conteúdo começa
                };
            }
            return null;
        })
        .filter((x): x is { heading: string; headingStartIndex: number; contentStartIndex: number } => !!x);

    // 2) monte os blocos
    const blocks: DocBlock[] = [];
    for (let i = 0; i < headings.length; i++) {
        const { heading, headingStartIndex, contentStartIndex } = headings[i];
        const nextHeadingStart = i + 1 < headings.length
            ? headings[i + 1].headingStartIndex
            : cutoffIndex;

        // 3) extraia texto entre contentStartIndex e nextHeadingStart
        let text = "";
        for (const el of content) {
            const s = el.startIndex ?? 0;
            const e = el.endIndex ?? 0;
            if (s >= contentStartIndex && e <= nextHeadingStart) {
                for (const run of el.paragraph?.elements || []) {
                    text += run.textRun?.content || "";
                }
            }
        }

        blocks.push({
            heading,
            startIndex: contentStartIndex,
            endIndex: nextHeadingStart,
            text: text.trim(),
        });
    }

    return blocks;
}
