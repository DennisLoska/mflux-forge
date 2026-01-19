import { Model } from "./models";
import { Config } from "../config";
import { Logger } from "./logger";
import { Presets } from "./presets";
import { LLM } from "./llm";

const { logger } = Logger;
const BENCHMARK = false;

const presets = [
  Presets.PENCIL_WATERCOLOR,
  Presets.PIXIMIX,
  Presets.PIXEL_ART,
  Presets.ANIME,
  Presets.TECHNICALLY_PIXEL,
  Presets.DIGITAL_ART,
  Presets.CLASSICAL_PAINTING,
  Presets.TECHNICALLY_COLOR,
];

async function benchmark() {
  for (const preset of presets) {
    const prompts: string[] = ["A portrait of Lenna"];

    for (let i = 0; i < preset.lora.scales.length; i++) {
      const prompt = prompts[Math.ceil(Math.random() * (prompts.length - 1))];
      if (!prompt) continue;

      const res = await Model.Z_IMAGE_TURBO.run({
        prompt: prompt,
        filename: `benchmark_${preset.name}_${new Date().getTime()}`,
        count: i,
        lora: {
          paths: preset.lora.paths,
          scales: preset.lora.scales[i] ?? [],
        },
      });

      if (res === null) continue;
      await Model.upscale(res.path, res.upscaled_path);
    }
  }
}

async function main() {
  for (const preset of presets) {
    const { name, instructions, models, lora } = preset;

    for (const instruction of instructions) {
      let prompts;
      logger.info("Generating image prompts:\n");
      // Not enough RAM for this line :(
      // const res = await Api.local_llm(instruction);
      const res = await LLM.opencode.chat(instruction);
      if (res === null) continue;

      const file = Bun.file(`${Config.DIR}/prompts/${Config.now}.txt`);
      prompts = await file.text();

      logger.info("\nGenerated prompts:\n");
      logger.info(prompts);

      const lines = prompts.split("\n");

      let count = 0;
      for (let i = 0; i < lora.scales.length; i++) {
        for (const line of lines) {
          logger.info("\nPrompt:\n");
          logger.info(`${line}\n`);
          logger.info(
            `Generating image ${count + 1}/${lora.scales.length * lines.length}\n`,
          );

          const [filename, prompt] = line.split(".png");
          if (!(filename && prompt)) {
            logger.warn("Failed to extract filename - skipping\n");
            continue;
          }

          for (const model of models) {
            const res = await model.run({
              prompt,
              filename: `${filename}_${name}_${new Date().getTime()}`,
              count,
              lora: {
                paths: lora.paths,
                scales: lora.scales[i] ?? [],
              },
            });

            if (res === null) continue;

            await Model.upscale(res.path, res.upscaled_path);
            count++;
          }
        }
      }
    }
  }
}

if (BENCHMARK) benchmark();
else main();
