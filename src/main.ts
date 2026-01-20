import { Model } from "./models";
import { Config } from "../config";
import { Logger } from "./logger";
import { Presets } from "./presets";
import { LLM } from "./llm";

const { logger } = Logger;
const BENCHMARK = false;

const presets = [
  Presets.PENCIL_WATERCOLOR,
  Presets.PIXEL_ART,
  Presets.PIXIMIX,
  Presets.ANIME,
  Presets.TECHNICALLY_PIXEL,
  Presets.DIGITAL_ART,
  Presets.CLASSICAL_PAINTING,
  Presets.TECHNICALLY_COLOR,
];

const models = [Model.FLUX_TWO_KLEIN, Model.Z_IMAGE_TURBO];

async function benchmark() {
  logger.info("Running benchmark...");

  const benchmark_models = [
    Model.Z_IMAGE_TURBO,
    Model.FLUX_TWO_KLEIN,
    Model.FLUX_SCHNELL,
    Model.FLUX_DEV,
  ];

  for (const preset of [Presets.BENCHMARK]) {
    const prompts: string[] = ["A portrait of Lenna the standard test image"];

    for (let i = 0; i < preset.lora.scales.length; i++) {
      const prompt = prompts[Math.ceil(Math.random() * (prompts.length - 1))];
      if (!prompt) continue;

      for (const model of benchmark_models) {
        const res = await model.run({
          prompt,
          filename: `${preset.name}_${new Date().getTime()}`,
          lora: {
            paths: preset.lora.paths,
            scales: preset.lora.scales[i] ?? [],
          },
        });

        if (res === null) continue;
        void Model.upscale(res.path, res.upscaled_path);
      }
    }
  }
}

async function main() {
  for (const preset of presets) {
    const { name, instructions, lora } = preset;
    let count = 0;

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

      for (let i = 0; i < lora.scales.length; i++) {
        for (const line of lines) {
          logger.info("\nPrompt:\n");
          logger.info(`${line}\n`);
          logger.info(
            `Generating image ${count + 1}/${lora.scales.length * lines.length * instructions.length}\n`,
          );

          const [filename, prompt] = line.split(".png");
          if (!(filename && prompt)) {
            logger.warn("Failed to extract filename - skipping\n");
            continue;
          }

          for (const model of models) {
            const scales = lora.scales[i];
            const res = await model.run({
              prompt,
              filename: `${filename}_${name}_${scales?.join("_")}_${new Date().getTime()}`,
              lora: {
                paths: lora.paths,
                scales: scales ?? [],
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
