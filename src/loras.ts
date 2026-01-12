import { Config, type Lora } from "../config";

export namespace Loras {
  const single: string[][] = [
    ["0.1"],
    ["0.2"],
    ["0.3"],
    ["0.4"],
    ["0.5"],
    ["0.6"],
    ["0.7"],
    ["0.8"],
    ["0.9"],
    ["1.0"],
  ];

  const double: string[][] = [
    ["0.1", "0.1"],
    ["0.2", "0.2"],
    ["0.3", "0.3"],
    ["0.4", "0.4"],
    ["0.5", "0.5"],
    ["0.6", "0.4"],
    ["0.7", "0.3"],
    ["0.8", "0.2"],
    ["0.9", "0.1"],
    ["1.0", "0.0"],
    ["0.0", "1.0"],
    ["0.1", "0.9"],
    ["0.2", "0.8"],
    ["0.3", "0.7"],
    ["0.4", "0.6"],
  ];

  export function identity(scale: string) {
    const identity = [];
    for (let i = 0; i < Config.IMAGE.generations; i++) {
      identity.push([scale]);
    }

    return identity;
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
