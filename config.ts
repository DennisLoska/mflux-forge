const date = new Date().getTime();

export type Lora = {
  name: string;
  trigger: string;
};

export namespace Config {
  export const IMAGE = {
    width: 1280,
    height: 720,
    generations: 2,
  } as const;

  export const now = date;
  export const DIR = import.meta.dir;
  export const LOCAL_LLM_API = "http://127.0.0.1:1234/v1/responses";

  export const LLM = {
    opencode: {
      default: "opencode/minimax-m2.1-free",
      minimax_m2_1_free: "opencode/minimax-m2.1-free",
      glm_4_7_free: "opencode/glm-4.7-free",
      grok_code: "opencode/grok-code",
    },
    local: {
      default: "qwen/qwen3-vl-4b",
      qwen3_vl_4b: "qwen/qwen3-vl-4b",
    },
  } as const;

  export const DIFFUSION_MODEL = {
    flux_schnell: {
      model: "dhairyashil/FLUX.1-schnell-mflux-v0.6.2-4bit",
      base: "schnell",
      steps: 7,
    },
    flux_krea_dev: {
      model: "filipstrand/FLUX.1-Krea-dev-mflux-4bit",
      base: "krea-dev",
      steps: 20,
    },
    flux_two_klein: {
      model: "black-forest-labs/FLUX.2-klein-4B",
      base: "flux2-klein-4b",
      steps: 7,
    },
    z_image_turbo: {
      model: "filipstrand/Z-Image-Turbo-mflux-4bit",
      base: "z-image-turbo",
      steps: 12,
    },
  } as const;

  export const LORAS = {
    pencil_sketch: {
      name: "Ttio2/Z-Image-Turbo-pencil-sketch",
      trigger: "pencil sketch",
    },

    digital_art: {
      name: "bunnycore/Z-Art-2.1:Z-Art-3.safetensors",
      trigger: "digital art",
    },
    pixel_art: {
      name: "tarn59/pixel_art_style_lora_z_image_turbo",
      trigger: "Pixel art style.",
    },
    behind_glass: {
      name: "Quorlen/Z-Image-Turbo-Behind-Reeded-Glass-Lora",
      trigger: "Act1vate!",
    },
    classic_painting: {
      name: "renderartist/Classic-Painting-Z-Image-Turbo-LoRA",
      trigger: "class1cpa1nt",
    },
    anime_z: { name: "strangerzonehf/Anime-Z", trigger: "Anime-Z" },
    technically_color: {
      name: "renderartist/Technically-Color-Z-Image-Turbo",
      trigger: "t3chnic4lly",
    },
    ghibli: {
      name: "Ttio2/Z-Image-Turbo-Ghibli-Style",
      trigger: "ghibli",
    },
  } as const;
}
