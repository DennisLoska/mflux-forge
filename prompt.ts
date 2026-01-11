import { Config } from "./config";

export namespace Prompt {
  export function system(
    Style: { primary: string; styles: string[]; scenes: string[] },
    triggers: string,
    date: number,
  ) {
    return `
  Generate ${Config.IMAGE.generations} images of epic biblical landscape scenery using stable diffusion.

  FOR ALL PROMPTS ALWAYS:
  - biblical, beige, lush green, middle eastern vibes.
  - People are black or white silhouettes and usually not the center of the scene, but part of it
  - Scenes are about visualization of good virtues or evil deeds
  - Focus on displaying and visualizing love, passion, beauty, joy, spirit
  - There is usually the sun or moon or the stars, gras or sand, lakes, stones
  - The images always show ancient times and should be highly symbolic
  - Never include any signature or words, text or letters

  Keeping aforementioned instructions in mind reate the image generation prompts for me by using
  the following instructions as a template:

  [primary style: ${Style.primary} secondary styles: ${triggers}] [subject & focal point], [setting & composition], [painting type] on [paper type],
  [light & atmosphere], [palette], [techniques & edges], [mood adjectives], subtle paper texture,
  tasteful white margins, minimalist, print-ready

  Examples styles to use:

  ${JSON.stringify(Style.styles)}

  Examples scenes to use:

  ${JSON.stringify(Style.scenes)}

  Use these as examples or use them directly, but come up with a good variety of different styles for the
  list of prompts.

  Tips:
  - Front-load the most important elements (subject + medium first)
  - ~50-250 words tends to be the sweet spot
  - Concrete subjects > abstract descriptions

  Create a file called ${date}.txt in ${Config.DIR}/prompts and save all prompts there.
  Make sure that you only write one prompt per line!
  Prefix each line with the name of the file.
  Example line: unique_image_name.png My awesome image prompt goes here
  Make sure that no line is empty!
`;
  }
}
