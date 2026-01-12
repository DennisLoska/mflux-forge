import { Styles } from "./styles";
import { Model } from "./models";
import { Config } from "./config";
import { logger } from "./logger";
import { Loras } from "./lora";
import { Prompt } from "./prompt";
import { Api } from "./api";

const BENCHMARK = false;
const date = new Date().getTime();

const { LORAS } = Config;
const loras = [LORAS.pencil_sketch];
// const scales = Loras.scales(loras);
const scales = Loras.identity("0.7");
const triggers = Loras.triggers(loras);
const paths = Loras.paths(loras);

const Style = {
  primary: "watercolor",
  secondary: triggers,
  styles: Styles.watercolor_styles,
  scenes: Styles.biblical_events,
};

const LLM = Config.LLM.minimax_m2_1_free;
const INSTRUCTIONS = Prompt.system(Style, date);

async function main() {
  if (BENCHMARK) {
    try {
      for (let i = 0; i < scales.length; i++) {
        const res = await Model.Z_IMAGE_TURBO.run({
          prompt: `The fractal golden lotus flower`,
          filename: "benchmark.png",
          count: `${i}_${scales?.[i]?.[0]}_${scales?.[i]?.[1]}`,
          lora: {
            paths: loras.map((lora) => lora.name),
            scales: scales[i] ?? [],
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

  let prompts;
  try {
    logger.info("Generating image prompts:\n");
    await Api.opencode(LLM, INSTRUCTIONS);
    // const res = await Api.local_llm(INSTRUCTIONS);
    const file = Bun.file(`./prompts/${date}.txt`);
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

    const models = [Model.Z_IMAGE_TURBO];

    for (const model of models) {
      try {
        const res = await model.run({
          prompt,
          filename: `${filename}_${scales[count]}`,
          count: String(count),
          lora: {
            paths: paths,
            scales: scales[count] ?? [],
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

main();
