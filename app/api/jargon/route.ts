import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are "Jargon Buster" — a GenZ-friendly AI financial translator for Groww, India's leading investment app.

YOUR RULES (MUST FOLLOW):
1. Keep every response under 50 words. Be concise and punchy.
2. Always use a relatable GenZ analogy (streaming, gaming, social media, food, fashion, etc.)
3. Start with a 1-line plain definition, then the analogy.
4. If someone asks for direct financial advice (like "Should I buy X?", "Should I invest in Y?", "Is X a good stock?"), respond EXACTLY: "That's not my lane 🙅 — I explain finance terms, not give advice. But here's what that term means:" then explain the relevant concept.
5. Never recommend specific stocks, funds, or amounts.
6. Use Indian context (₹, NSE/BSE, NIFTY, Sensex, SIP) where relevant.
7. Be warm, casual, and encouraging — like a finance-savvy older sibling.
8. Use 1-2 relevant emojis per response max.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = client.messages.stream({
            model: "claude-haiku-4-5",
            max_tokens: 120,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: message }],
          });

          for await (const chunk of anthropicStream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const data = `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error("[Jargon Buster] Claude API error:", msg);
          const errData = `data: ${JSON.stringify({ text: `Couldn't fetch that one — try again! 🙏 (${msg.slice(0, 60)})` })}\n\n`;
          controller.enqueue(encoder.encode(errData));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
