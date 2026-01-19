import { Config } from "../config";
import { Loras } from "./loras";
import { Model, type ModelRunner } from "./models";
import { Prompt } from "./prompt";
import { Styles } from "./styles";

interface Preset {
  name: string;
  instructions: string[];
  models: ModelRunner[];
  lora: {
    scales: string[][];
    triggers: string;
    paths: string[];
  };
}

export namespace Presets {
  function _lora(
    loras: (typeof Config.LORAS)[keyof typeof Config.LORAS][],
    custom?: string[][],
  ) {
    return {
      scales: custom ? custom : Loras.scales(loras),
      triggers: Loras.triggers(loras),
      paths: Loras.paths(loras),
    };
  }

  function _non_style(lora: Preset["lora"]) {
    return {
      primary: Styles.NONE.name,
      secondary: lora.triggers,
      styles: Styles.NONE.styles,
      texture: Styles.TEXTURE.none,
    };
  }

  function pencil_watercolor(): Preset {
    const lora = _lora([Config.LORAS.pencil_sketch], Loras.identity(0.7, 3));
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
    return { name: "pencil_watercolor", instructions, models, lora };
  }

  function anime(): Preset {
    const lora = _lora([Config.LORAS.anime_z], Loras.identity(0.6, 3));
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "anime", instructions, models, lora };
  }

  function animix(): Preset {
    const lora = _lora([Config.LORAS.anime_z, Config.LORAS.ghibli]);
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "animix", instructions, models, lora };
  }

  function piximix(): Preset {
    const lora = _lora(
      [Config.LORAS.pixel_art, Config.LORAS.anime_z],
      [...Loras.base_matrix(1), ...Loras.balanced_matrix(2)],
    );
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "piximix", instructions, models, lora };
  }

  function pixel_art(): Preset {
    const lora = _lora([Config.LORAS.pixel_art], Loras.identity(0.1, 3));
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "pixel_art", instructions, models, lora };
  }

  function digital_art(): Preset {
    const lora = _lora([Config.LORAS.digital_art]);
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "digital_art", instructions, models, lora };
  }

  function classical_painting(): Preset {
    const lora = _lora([Config.LORAS.classic_painting]);
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "classical_painting", instructions, models, lora };
  }

  function technically_color(): Preset {
    const lora = _lora([Config.LORAS.technically_color]);
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "technically_color", instructions, models, lora };
  }

  function technically_pixel(): Preset {
    const lora = _lora(
      [Config.LORAS.technically_color, Config.LORAS.pixel_art],
      [...Loras.base_matrix()],
    );
    const style = _non_style(lora);

    const instructions = [
      Prompt.biblical(style),
      Prompt.dramatic_everyday(style),
      Prompt.universal_archetypes(style),
      Prompt.jungian_psychology(style),
    ];

    const models = [Model.Z_IMAGE_TURBO];
    return { name: "technically_pixel", instructions, models, lora };
  }

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
