import { Config } from "./config";
import { fetch } from "bun";
import { logger } from "./logger";

export namespace Api {
  export async function opencode(model: string, instructions: string) {
    try {
      return Bun.$`opencode run -m ${model} "${instructions}"`;
    } catch (error) {
      logger.error("Error", { error: error?.message });
      return null;
    }
  }

  export async function local_llm(instructions: string) {
    try {
      const res = await fetch(Config.LOCAL_LLM_API, {
        method: "POST",
        signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({
          model: Config.LOCAL_MODEL,
          input: instructions,
          temperature: 0.7,
          max_tokens: -1,
          stream: false,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      const content = json?.output?.[0]?.content?.[0]?.text;
      return content;
    } catch (error) {
      logger.error("Error", { error: error?.message });
      return null;
    }
  }
}
