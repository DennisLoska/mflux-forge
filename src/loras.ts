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
  ];

  export function base_matrix(factor: number = 1) {
    const base_weights = [
      ["0.0", "0.4"],
      ["0.0", "0.5"],
      ["0.0", "0.6"],
      ["0.0", "0.7"],
      ["0.1", "0.4"],
      ["0.1", "0.5"],
      ["0.1", "0.6"],
      ["0.1", "0.7"],
      ["0.6", "0.0"],
      ["0.6", "0.1"],
      ["0.6", "0.2"],
      ["0.6", "0.4"],
    ];

    const base_matrix: string[][] = [];
    if (factor < 1) throw new Error("factor must be at least 1");

    for (let i = 0; i < factor; i++) {
      base_matrix.push(...base_weights);
    }

    return base_matrix;
  }

  export function balanced_matrix(factor: number = 1) {
    const balanced_matrix: string[][] = [];
    if (factor < 1) throw new Error("factor must be at least 1");

    for (let i = 0; i < factor; i++) {
      balanced_matrix.push(["0.1", "0.6"], ["0.6", "0.1"]);
    }

    return balanced_matrix;
  }

  const single: string[][] = [...steps.map((n) => [n])];
  const double: string[][] = steps.flatMap((v1) => steps.map((v2) => [v1, v2]));

  export function identity(scale: number, iterations: number) {
    if (!iterations) return [[String(scale)]];

    const identity: string[][] = [];
    for (let i = 0; i < iterations; i++) {
      identity.push([String(scale)]);
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
