import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";

await configure({
  sinks: {
    console: getConsoleSink({ formatter: prettyFormatter }),
  },
  loggers: [
    { category: [], sinks: ["console"], lowestLevel: "error" },
    { category: ["flux"], sinks: ["console"], lowestLevel: "debug" },
  ],
});

export namespace Logger {
  export const logger = getLogger(["flux"]);
}
