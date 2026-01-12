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

async function main() {
  if (BENCHMARK) {
    try {
      for (let i = 0; i < Lora.scales.length; i++) {
        const res = await Model.Z_IMAGE_TURBO.run({
          prompt: `The fractal golden lotus flower`,
          filename: "benchmark.png",
          count: `${i}_${Lora.scales?.[i]?.[0]}_${Lora.scales?.[i]?.[1]}`,
          lora: {
            paths: Lora.paths,
            scales: Lora.scales[i] ?? [],
          },
        });
        await Model.upscale(res.path, res.upscaled_path);
      }
    } catch (error) {
      logger.error("Error", { error: error?.message });
    } finally {
      process.exit(0);
    }
  }

  for (const instruction of instructions) {
    let prompts;
    try {
      logger.info("Generating image prompts:\n");
      await Api.opencode(LLM, instruction);
      // Not enough RAM for this line :(
      // const res = await Api.local_llm(instruction);

      const file = Bun.file(`./prompts/${Config.now}.txt`);
      prompts = await file.text();

      logger.info("\nGenerated prompts:\n");
      logger.info(prompts);
    } catch (error) {
      logger.error("Error", { error: error?.message });
      process.exit(1);
    }

    const lines = prompts.split("\n");
    let count = 0;

    for (const line of lines) {
      logger.info("\nPrompt:\n");
      logger.info(`${line}\n`);
      logger.info(`Generating image ${count + 1}/${lines.length}\n`);

      const [filename, prompt] = line.split(".png");
      if (!(filename && prompt)) {
        logger.warn("Failed to extract filename - skipping\n");
        continue;
      }

      for (const model of models) {
        try {
          const res = await model.run({
            prompt,
            filename: `${filename}_${Lora.scales[count]}`,
            count: String(count),
            lora: {
              paths: Lora.paths,
              scales: Lora.scales[count] ?? [],
            },
          });
          await Model.upscale(res.path, res.upscaled_path);
        } catch (error) {
          logger.error("Error", { error: error?.message });
        }
      }

      count++;
    }
  }
}

main();
