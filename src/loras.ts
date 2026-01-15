import { type Lora } from "../config";

export namespace Loras {
  const steps = [
    "0.0",
    "0.1",
    "0.2",
    "0.3",
    "0.4",
    "0.5",
    "0.6",
    "0.7",
    "0.8",
    "0.9",
    "1.0",
  ];

  const single: string[][] = [...steps.map((n) => [n])];
  const double: string[][] = steps.flatMap((v1) => steps.map((v2) => [v1, v2]));

  export function identity(scale: string) {
    return [[scale]];
  }

  export function triggers(loras: Lora[]) {
    return loras.map((lora) => lora.trigger).join(" ");
  }

  export function paths(loras: Lora[]) {
    return loras.map((lora) => lora.name);
  }

  export function scales(loras: Lora[]) {
    if (loras.length === 0) return [];
    if (loras.length === 1) return single;
    if (loras.length === 2) return double;
    throw new Error("Only two LoRAs maximum are supported");
  }
}
