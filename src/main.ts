import { Model } from "./models";
import { Config } from "../config";
import { Logger } from "./logger";
import { Presets } from "./presets";
import { LLM } from "./llm";

const { logger } = Logger;
const BENCHMARK = false;

const { instructions, models, lora } = Presets.PENCIL_WATERCOLOR;

async function benchmark() {
  for (let i = 0; i < lora.scales.length; i++) {
    const res = await Model.Z_IMAGE_TURBO.run({
      prompt: `A fractal mandala image of the shimmering red, golden lotus flower`,
      filename: "benchmark.png",
      count: String(i),
      lora: {
        paths: lora.paths,
        scales: lora.scales[i] ?? [],
      },
    });

    if (res === null) continue;
    await Model.upscale(res.path, res.upscaled_path);
  }
}

async function main() {
  if (BENCHMARK) benchmark();

  for (const instruction of instructions) {
    let prompts;
    logger.info("Generating image prompts:\n");
    // Not enough RAM for this line :(
    // const res = await Api.local_llm(instruction);
    const res = await LLM.opencode.chat(instruction);
    if (res === null) continue;

    const file = Bun.file(`..//prompts/${Config.now}.txt`);
    prompts = await file.text();

    logger.info("\nGenerated prompts:\n");
    logger.info(prompts);

    const lines = prompts.split("\n");

    for (let i = 0; i < lora.scales.length; i++) {
      for (const line of lines) {
        logger.info("\nPrompt:\n");
        logger.info(`${line}\n`);
        logger.info(
          `Generating image ${i + 1}/${lora.scales.length * lines.length}\n`,
        );

        // good enough, ai is very reliable so far
        const [filename, prompt] = line.split(".png");
        if (!(filename && prompt)) {
          logger.warn("Failed to extract filename - skipping\n");
          continue;
        }

        for (const model of models) {
          const res = await model.run({
            prompt,
            filename,
            count: String(i),
            lora: {
              paths: lora.paths,
              scales: lora.scales[i] ?? [],
            },
          });

          if (res === null) continue;

          await Model.upscale(res.path, res.upscaled_path);
        }
      }
    }
  }
}

main();
