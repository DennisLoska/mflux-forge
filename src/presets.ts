import { Config } from "../config";
import { Loras } from "./loras";
import { Prompt, type Instruction, type Style } from "./prompt";
import { Styles } from "./styles";

interface Preset {
  name: string;
  instructions: Instruction[];
  lora: {
    scales: string[][];
    triggers: string;
    paths: string[];
  };
}

export namespace Presets {
  function instruction_list(style: Style): Instruction[] {
    const instructions = [
      Prompt.biblical(style),
      Prompt.jungian_psychology(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
    ];

    return instructions;
  }

  function _lora(
    loras: (typeof Config.LORAS)[keyof typeof Config.LORAS][],
    custom?: string[][],
  ): Preset["lora"] {
    return {
      scales: custom ? custom : Loras.scales(loras),
      triggers: Loras.triggers(loras),
      paths: Loras.paths(loras),
    };
  }

  function _no_lora(): Preset["lora"] {
    return {
      scales: [[""]],
      triggers: "",
      paths: [""],
    };
  }

  function _no_style(lora?: Preset["lora"]) {
    return {
      primary: Styles.NONE.name,
      secondary: lora?.triggers ?? "",
      styles: Styles.NONE.styles,
      texture: Styles.TEXTURE.none,
    };
  }

  function benchmark(): Preset {
    const lora = _no_lora();
    const instructions: Instruction[] = [];

    return { name: "benchmark", instructions, lora };
  }

  function pencil_watercolor(): Preset {
    const lora = _lora([Config.LORAS.pencil_sketch], Loras.identity(0.7, 2));
    const style = {
      primary: Styles.WATERCOLOR.name,
      secondary: lora.triggers,
      styles: Styles.WATERCOLOR.styles,
      texture: Styles.TEXTURE.paper,
    };

    const instructions = instruction_list(style);
    return { name: "pencil_watercolor", instructions, lora };
  }

  function anime(): Preset {
    const lora = _lora([Config.LORAS.anime_z], Loras.identity(0.6, 2));
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "anime", instructions, lora };
  }

  function animix(): Preset {
    const lora = _lora(
      [Config.LORAS.anime_z, Config.LORAS.ghibli],
      Loras.balanced_matrix(1),
    );
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "animix", instructions, lora };
  }

  function piximix(): Preset {
    const lora = _lora(
      [Config.LORAS.pixel_art, Config.LORAS.anime_z],
      Loras.balanced_matrix(1),
    );
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "piximix", instructions, lora };
  }

  function pixel_art(): Preset {
    const lora = _lora([Config.LORAS.pixel_art], Loras.identity(0.1, 2));
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "pixel_art", instructions, lora };
  }

  function digital_art(): Preset {
    const lora = _lora([Config.LORAS.digital_art], Loras.identity(0.4, 2));
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "digital_art", instructions, lora };
  }

  function classical_painting(): Preset {
    const lora = _lora([Config.LORAS.classic_painting], Loras.identity(0.7, 2));
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "classical_painting", instructions, lora };
  }

  function technically_color(): Preset {
    const lora = _lora(
      [Config.LORAS.technically_color],
      Loras.balanced_matrix(1),
    );
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "technically_color", instructions, lora };
  }

  function technically_pixel(): Preset {
    const lora = _lora(
      [Config.LORAS.technically_color, Config.LORAS.pixel_art],
      Loras.balanced_matrix(1),
    );
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "technically_pixel", instructions, lora };
  }

  export const BENCHMARK = benchmark();
  export const PENCIL_WATERCOLOR = pencil_watercolor();
  export const ANIME = anime();
  export const ANIMIX = animix();
  export const PIXIMIX = piximix();
  export const PIXEL_ART = pixel_art();
  export const DIGITAL_ART = digital_art();
  export const CLASSICAL_PAINTING = classical_painting();
  export const TECHNICALLY_COLOR = technically_color();
  export const TECHNICALLY_PIXEL = technically_pixel();
}
