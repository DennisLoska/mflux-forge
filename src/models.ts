import { Config } from "../config";
import assert from "node:assert";
import { Logger } from "./logger";

const { logger } = Logger;

export interface ModelRunner {
  run: (options: Params) => Promise<{
    path: string;
    filename: string;
    upscaled_path: string;
  } | null>;
}

type Params = {
  prompt: string;
  filename: string;
  count: number;
  lora?: {
    paths: string[];
    scales: string[];
  };
};

type Model =
  (typeof Config.DIFFUSION_MODEL)[keyof typeof Config.DIFFUSION_MODEL];

export namespace Model {
  const {
    DIFFUSION_MODEL: {
      z_image_turbo,
      flux_schnell,
      flux_krea_dev,
      flux_two_klein,
    },
    IMAGE,
    DIR,
  } = Config;

  function diff_model(model: Model): ModelRunner {
    let command: string;

    switch (model.base) {
      case "z-image-turbo":
        command = "mflux-generate-z-image-turbo";
        break;
      case "flux2-klein-4b":
        command = "mflux-generate-flux2";
        break;
      case "krea-dev":
        command = "mflux-generate";
        break;
      case "schnell":
        command = "mflux-generate";
        break;
      default:
        command = "mflux-generate";
        break;
    }

    function guard(item: { lora: Params["lora"] }) {
      if (item.lora) {
        assert(
          item.lora.paths.length === item.lora.scales.length,
          "Lora paths and scale count do not match!",
        );
      }
    }

    const model_runner = {
      run: async ({ prompt, filename, count, lora }: Params) => {
        const meta = `_${IMAGE.width}_${IMAGE.height}_${model.steps}.png`;
        const out = `${DIR}/images/${model.base}/${filename}_${count}_${meta}`;
        const upscaled = `${DIR}/images/upscaled/${model.base}/${filename}_${count}_${meta}`;

        guard({ lora });

        try {
          if (lora) {
            await Bun.$`
              ${command} \
              --model ${model.model} \
              --base-model ${model.base} \
              --prompt "${prompt}" \
              --output "${out}" \
              --width ${IMAGE.width} \
              --height ${IMAGE.height} \
              --steps ${model.steps} \
              --lora-paths ${lora?.paths} \
              --lora-scales ${lora?.scales} \
            `;
          } else {
            await Bun.$`
              ${command} \
              --model ${model.model} \
              --base-model ${model.base} \
              --prompt "${prompt}" \
              --output "${out}" \
              --width ${IMAGE.width} \
              --height ${IMAGE.height} \
              --steps ${model.steps} \
            `;
          }
        } catch (error) {
          logger.error("Error", { error: error?.message });
          return null;
        }

        return {
          path: out,
          filename: `${filename}_${count}_${meta}`,
          upscaled_path: upscaled,
        } as const;
      },
    };

    return model_runner;
  }

  export async function upscale(input: string, output: string) {
    try {
      logger.info(`\nUpscaling image: ${input}\n`);
      await Bun.$`${DIR}/upscale.sh ${input} ${output}`;
    } catch (error) {
      logger.error("Error", { error: error?.message });
      return null;
    }
  }

  export const FLUX_SCHNELL = diff_model(flux_schnell);
  export const FLUX_DEV = diff_model(flux_krea_dev);
  export const FLUX_TWO_KLEIN = diff_model(flux_two_klein);
  export const Z_IMAGE_TURBO = diff_model(z_image_turbo);
}
