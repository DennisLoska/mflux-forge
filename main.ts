import { Styles } from "./styles";
import { Model } from "./models";
import { Config } from "./config";
import { logger } from "./logger";
import { Loras } from "./loras";
import { Prompt } from "./prompt";
import { Api } from "./api";

const BENCHMARK = false;

// Setting up some hyperparameters for styles and prompts
const LORAS = [Config.LORAS.pencil_sketch];
const Lora = {
  scales: Loras.identity("0.7"),
  triggers: Loras.triggers(LORAS),
  paths: Loras.paths(LORAS),
};

const Style = {
  primary: "watercolor",
  secondary: Lora.triggers,
  styles: Styles.watercolor_styles,
};

const LLM = Config.LLM.minimax_m2_1_free;
const models = [Model.Z_IMAGE_TURBO];

const instructions = [
  Prompt.epic_nature_landscapes(Style),
  Prompt.surreal_fractals(Style),
  Prompt.abstract_expressions(Style),
  Prompt.myths_and_legends(Style),
  Prompt.universal_archetypes(Style),
  Prompt.jungian_psychology(Style),
  Prompt.dramatic_everyday(Style),
  Prompt.biblical(Style),
];

async function benchmark() {
  for (let i = 0; i < Lora.scales.length; i++) {
    const res = await Model.Z_IMAGE_TURBO.run({
      prompt: `A fractal mandala image of the shimmering red, golden lotus flower`,
      filename: "benchmark.png",
      count: String(i),
      lora: {
        paths: Lora.paths,
        scales: Lora.scales[i] ?? [],
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
    const res = await Api.opencode(LLM, instruction);
    if (res === null) continue;

    const file = Bun.file(`./prompts/${Config.now}.txt`);
    prompts = await file.text();

    logger.info("\nGenerated prompts:\n");
    logger.info(prompts);

    const lines = prompts.split("\n");
    let count = 0;

    for (const line of lines) {
      logger.info("\nPrompt:\n");
      logger.info(`${line}\n`);
      logger.info(`Generating image ${count + 1}/${lines.length}\n`);

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
          count: String(count),
          lora: {
            paths: Lora.paths,
            scales: Lora.scales[count] ?? [],
          },
        });

        if (res === null) continue;

        await Model.upscale(res.path, res.upscaled_path);
      }

      count++;
    }
  }
}

main();
