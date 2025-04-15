import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const jsonReq = await req.json();
  const {
    prompt,
    system,
    temperature,
  }: { prompt: string; system: string; temperature?: number } = jsonReq;

  try {
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      ...(temperature && { temperature }),
      system,
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.log(err);
  }
}
