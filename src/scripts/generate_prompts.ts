import { Config } from "../../config";
import { LLM } from "../llm";
import { Logger } from "../logger";
import { Presets } from "../presets";

const { logger } = Logger;

async function prompts() {
  const presets = [
    Presets.PENCIL_WATERCOLOR,
    Presets.TECHNICALLY_COLOR,
    Presets.CLASSICAL_PAINTING,
    Presets.ANIME,
    Presets.PIXIMIX,
    Presets.PIXEL_ART,
    Presets.TECHNICALLY_PIXEL,
    Presets.DIGITAL_ART,
  ];

  for (const preset of presets) {
    const { name, instructions } = preset;

    for (const instruction of instructions) {
      logger.info(`Generate prompts for: ${name}`);
      const res = await LLM.opencode.chat(
        instruction.prompt,
        "lmstudio/qwen/qwen3-vl-30b",
      );
      if (res === null) continue;

      const file = Bun.file(
        `${Config.DIR}/prompts/${instruction.name}_${Config.now}.txt`,
      );

      const prompts = await file.text();

      logger.info("\nGenerated prompts:\n");
      logger.info(prompts);
    }
  }
}

prompts();
