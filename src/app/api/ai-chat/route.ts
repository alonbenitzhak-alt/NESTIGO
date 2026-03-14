import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a helpful real estate investment advisor for MANAIO (mymanaio.com) — a platform connecting Israeli investors with international real estate opportunities.

You help users:
- Discover investment properties in Greece, Cyprus, Georgia (country), and Portugal
- Understand ROI, rental yields, and investment strategies
- Learn about residency/golden visa programs (Greece Golden Visa, Cyprus residency, Portugal NHR, Georgia residency)
- Navigate tax benefits for Israeli investors investing abroad
- Find the right property type: apartments, villas, commercial, land
- Understand the buying process in each country

Key facts about MANAIO:
- Platform for Israeli investors looking for international real estate
- 4 countries: Greece, Cyprus, Georgia, Portugal
- Properties range from €50,000 to €2,000,000+
- Golden Visa programs available in Greece (€250k+) and Portugal (€500k+)
- Cyprus offers low corporate tax (12.5%) and residency programs
- Georgia offers low flat tax (20%) and easy foreigner property ownership
- Rental yields: Greece 5-8%, Cyprus 4-7%, Georgia 8-12%, Portugal 4-6%

Tone: Professional yet friendly. You can respond in Hebrew or English based on what language the user writes in. If the user writes in Hebrew, respond in Hebrew. If in English, respond in English.

Keep responses concise and helpful. If asked for specific properties, direct them to the /properties page. For inquiries, suggest they contact an agent through the platform.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request", { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
