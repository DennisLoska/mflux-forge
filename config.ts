export namespace Config {
  export const IMAGE = {
    width: 1280,
    height: 720,
    generations: 40,
  } as const;

  export const DIR = import.meta.dir;

  export const LLM = {
    minimax_m2_1_free: "opencode/minimax-m2.1-free",
    glm_4_7_free: "opencode/glm-4.7-free",
    grok_code: "opencode/grok-code",
  } as const;

  export const DIFFUSION_MODEL = {
    flux_schnell: {
      model: "dhairyashil/FLUX.1-schnell-mflux-v0.6.2-4bit",
      base: "schnell",
      steps: 7,
    },
    flux_dev: {
      model: "filipstrand/FLUX.1-Krea-dev-mflux-4bit",
      base: "krea-dev",
      steps: 20,
    },
    z_image_turbo: {
      model: "filipstrand/Z-Image-Turbo-mflux-4bit",
      base: "turbo",
      steps: 12,
    },
  } as const;

  export const LORAS = {
    pencil_sketch: "Ttio2/Z-Image-Turbo-pencil-sketch",
    digital_art: "bunnycore/Z-Art-2.1",
    pixel_art: "tarn59/pixel_art_style_lora_z_image_turbo",
  } as const;
}
