import { Config } from "../config";
import { fetch } from "bun";
import { Logger } from "./logger";

const { logger } = Logger;

export namespace Api {
  export async function opencode(model: string, instructions: string) {
    try {
      return Bun.$`opencode run -m ${model} "${instructions}"`;
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

  export async function generate_video() {
    try {
      // TODO define: root directory, order of images
      await Bun.$`
        ffmpeg -pattern_type glob -i '*.png' -vf "scale=8000:-1,zoompan=z='min(zoom+0.0005,1.5)':d=850:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080,framerate=30" -c:v libx264 -pix_fmt yuv420p output.mp4
      `;
    } catch (error) {
      logger.error("Error", { error: error?.message });
      return null;
    }
  }
}
