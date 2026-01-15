import { Config } from "../config";
import { Api } from "./api";

type OpencodeModel =
  (typeof Config.LLM.opencode)[keyof typeof Config.LLM.opencode];
type LocalModel = (typeof Config.LLM.local)[keyof typeof Config.LLM.local];

interface Chat<T> {
  chat: (message: string, model?: T) => Promise<Bun.$.ShellOutput | null>;
}

export namespace LLM {
  export const opencode: Chat<OpencodeModel> = {
    chat: async (
      message: string,
      model: OpencodeModel = Config.LLM.opencode.default,
    ) => Api.opencode(model, message),
  };

  export const local: Chat<LocalModel> = {
    chat: async (
      message: string,
      model: LocalModel = Config.LLM.local.default,
    ) => Api.local_llm(model, message),
  };
}
