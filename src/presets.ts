import { Config } from "../config";
import { Loras } from "./loras";
import { Model, type ModelRunner } from "./models";
import { Prompt } from "./prompt";
import { Styles } from "./styles";

interface Preset {
  instructions: string[];
  models: ModelRunner[];
  lora: {
    scales: string[][];
    triggers: string;
    paths: string[];
  };
}

export namespace Presets {
  function pencil_watercolor(): Preset {
    const LORAS = [Config.LORAS.pencil_sketch];
    const lora = {
      scales: Loras.identity("0.7"),
      triggers: Loras.triggers(LORAS),
      paths: Loras.paths(LORAS),
    };

    const style = {
      primary: Styles.WATERCOLOR.name,
      secondary: lora.triggers,
      styles: Styles.WATERCOLOR.styles,
      texture: Styles.TEXTURE.paper,
    };

    const instructions = [
      Prompt.biblical(style),
      Prompt.jungian_psychology(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { instructions, models, lora };
  }

  export const PENCIL_WATERCOLOR = pencil_watercolor();
}
