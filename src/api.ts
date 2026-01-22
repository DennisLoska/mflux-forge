import { Config } from "../config";
import { fetch } from "bun";
import { Logger } from "./logger";

const { logger } = Logger;

export namespace Api {
  export async function opencode(model: string, instructions: string) {
    try {
      return Bun.$`opencode run -m ${model} --variant max "${instructions}"`;
    } catch (error) {
      logger.error("Error", { error: error?.message });
      return null;
    }
  }

  export async function local_llm(model: string, instructions: string) {
    try {
      const res = await fetch(Config.LOCAL_LLM_API, {
        method: "POST",
        signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({
          model,
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
