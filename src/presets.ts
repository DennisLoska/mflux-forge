import { Config, type Lora } from "../config";
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
  const { model } = Config.current;

  function instruction_list(style: Style): Instruction[] {
    const instructions = [
      Prompt.biblical(style),
      Prompt.jungian_psychology(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
    ];

    return instructions;
  }

  function _lora(loras: Lora[], custom?: string[][]): Preset["lora"] {
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
    const picked = model?.loras?.pencil_sketch;
    const lora = picked ? _lora([picked], Loras.identity(0.7, 2)) : _no_lora();

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
    const picked = model?.loras?.anime_z;
    const lora = picked ? _lora([picked], Loras.identity(0.6, 2)) : _no_lora();
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "anime", instructions, lora };
  }

  function animix(): Preset {
    const picked = model?.loras?.anime_z;
    const picked2 = model?.loras?.ghibli;
    const lora =
      picked && picked2
        ? _lora([picked, picked2], Loras.balanced_matrix(1))
        : _no_lora();

    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "animix", instructions, lora };
  }

  function piximix(): Preset {
    const picked = model?.loras?.pixel_art;
    const picked2 = model?.loras?.anime_z;
    const lora =
      picked && picked2
        ? _lora([picked, picked2], Loras.balanced_matrix(1))
        : _no_lora();

    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "piximix", instructions, lora };
  }

  function pixel_art(): Preset {
    const picked = model?.loras?.pixel_art;
    const lora = picked ? _lora([picked], Loras.identity(0.1, 2)) : _no_lora();
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "pixel_art", instructions, lora };
  }

  function digital_art(): Preset {
    const picked = model?.loras?.digital_art;
    const lora = picked ? _lora([picked], Loras.identity(0.4, 2)) : _no_lora();
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "digital_art", instructions, lora };
  }

  function classical_painting(): Preset {
    const picked = model?.loras?.classical_painting;
    const lora = picked ? _lora([picked], Loras.identity(0.7, 2)) : _no_lora();
    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "classical_painting", instructions, lora };
  }

  function technically_color(): Preset {
    const picked = model?.loras?.technically_color;
    const lora = picked
      ? _lora([picked], Loras.balanced_matrix(1))
      : _no_lora();

    const style = _no_style(lora);
    const instructions = instruction_list(style);
    return { name: "technically_color", instructions, lora };
  }

  function technically_pixel(): Preset {
    const picked = model?.loras?.technically_color;
    const picked2 = model?.loras?.pixel_art;
    const lora =
      picked && picked2
        ? _lora([picked, picked2], Loras.balanced_matrix(1))
        : _no_lora();

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
