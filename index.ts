import { biblical_events, watercolor_styles } from "./styles";
import { Model } from "./models";
import { Config } from "./config";
import { logger } from "./logger";

const date = new Date().getTime();

// TODO: make styles and prompts more configurable

const INSTRUCTIONS = `
  I want to generate ${Config.IMAGE.generations} images of epic biblical landscape scenery using stable diffusion.

  FOR ALL PROMPTS ALWAYS:
  - WATERCOLOR, WATERCOLOR, WATERCOLOR!!!
  - biblical, beige, lush green, middle eastern vibes.
  - People are black or white silhouettes and usually not the center of the scene, but part of it
  - Scenes are about visualization of good virtues or evil deeds
  - Focus on displaying and visualizing love, passion, beauty, joy, spirit
  - There is usually the sun or moon or the stars, gras or sand, lakes, stones
  - The images always show ancient times and should be highly symbolic
  - Never include any signature or words, text or letters

  Keeping aforementioned instructions in mind reate the image generation prompts for me by using
  the following instructions as a template:

  [subject & focal point], [setting & composition], watercolor painting on [paper type],
  [light & atmosphere], [palette], [techniques & edges], [mood adjectives], subtle paper texture,
  tasteful white margins, minimalist, print-ready

  Examples styles to use:

  ${JSON.stringify(watercolor_styles)}

  Examples scenes to use:

  ${JSON.stringify(biblical_events)}

  Use these as examples or use them directly, but come up with a good variety of different styles for the
  list of prompts.

  Tips:
  - Front-load the most important elements (subject + medium first)
  - 50-75 words tends to be the sweet spot
  - Concrete subjects > abstract descriptions

  Create a file called ${date}.txt in ${Config.DIR}/prompts and save all prompts there.
  Make sure that you only write one prompt per line!
  Prefix each line with the name of the file.
  Example line: name_of_file.png My awesome image prompt goes here
  Make sure that no line is empty!
`;

async function main() {
  let prompts;
  try {
    logger.info("Generating image prompts:\n");
    await Bun.$`opencode run -m ${Config.LLM.minimax_m2_1_free} "${INSTRUCTIONS}"`;
    const file = Bun.file(`./prompts/${date}.txt`);
    prompts = await file.text();
    logger.info("\nGenerated prompts:\n");
    logger.info(prompts);
  } catch (error) {
    logger.error("Error", { error });
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

    const models = [Model.Z_IMAGE_TURBO, Model.FLUX_SCHNELL, Model.FLUX_DEV];

    for (const model of models) {
      try {
        const res = await model.run({
          prompt,
          filename,
          count,
        });
        await Model.upscale(res.path, res.upscaled_path);
      } catch (error) {
        logger.error("Error", { error });
      }
    }

    count++;
  }
}

main();
