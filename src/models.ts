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
  count: string;
  lora?: {
    paths: string[];
    scales: string[];
  };
};

export namespace Model {
  const {
    DIFFUSION_MODEL: { z_image_turbo, flux_schnell, flux_dev },
    IMAGE,
    DIR,
  } = Config;

  function guard(item: { lora: Params["lora"] }) {
    if (item.lora) {
      assert(
        item.lora.paths.length === item.lora.scales.length,
        "Lora paths and scale count do not match!",
      );
    }
  }

  export async function upscale(input: string, output: string) {
    try {
      logger.info(`\nUpscaling image: ${input}\n`);
      await Bun.$`upscale ${input} ${output}`;
    } catch (error) {
      logger.error("Error", { error: error?.message });
      return null;
    }
  }

  export const FLUX_SCHNELL: ModelRunner = {
    run: async ({ prompt, filename, count, lora }: Params) => {
      const meta = `_${IMAGE.width}_${IMAGE.height}_${flux_schnell.steps}.png`;
      const out = `${DIR}/images/${flux_schnell.base}/${filename}_${count}_${meta}`;
      const upscaled = `${DIR}/images/upscaled/${flux_schnell.base}/${filename}_${count}_${meta}`;

      guard({ lora });

      try {
        await Bun.$`
        mflux-generate \
          --model ${flux_schnell.model} \
          --base-model ${flux_schnell.base} \
          --prompt "${prompt}" \
          --output "${out}" \
          --width ${IMAGE.width} \
          --height ${IMAGE.height} \
          --steps ${flux_schnell.steps}
      `;
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

  export const FLUX_DEV: ModelRunner = {
    run: async ({ prompt, filename, count, lora }: Params) => {
      const meta = `_${IMAGE.width}_${IMAGE.height}_${flux_dev.steps}.png`;
      const out = `${DIR}/images/${flux_dev.base}/${filename}_${count}_${meta}`;
      const upscaled = `${DIR}/images/upscaled/${flux_dev.base}/${filename}_${count}_${meta}`;

      guard({ lora });

      try {
        await Bun.$`
        mflux-generate \
          --model ${flux_dev.model} \
          --base-model ${flux_dev.base} \
          --prompt "${prompt}" \
          --output "${out}" \
          --width ${IMAGE.width} \
          --height ${IMAGE.height} \
          --steps ${flux_dev.steps}
      `;
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

  export const Z_IMAGE_TURBO: ModelRunner = {
    run: async ({ prompt, filename, count, lora }: Params) => {
      const meta = `${lora?.scales}_${count}_${IMAGE.width}_${IMAGE.height}_${z_image_turbo.steps}.png`;
      const out = `${DIR}/images/${z_image_turbo.base}/${filename}_${meta}`;
      const upscaled = `${DIR}/images/upscaled/${z_image_turbo.base}/${filename}_${meta}`;

      guard({ lora });

      try {
        // TODO: LoRA free version
        await Bun.$`
       mflux-generate-z-image-turbo \
        --model ${z_image_turbo.model} \
        --prompt "${prompt}" \
        --output "${out}" \
        --lora-paths ${lora?.paths} \
        --lora-scales ${lora?.scales} \
        --width ${IMAGE.width} \
        --height ${IMAGE.height} \
        --steps ${z_image_turbo.steps}
      `;
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
}
