import { existsSync, readFileSync } from "fs";

import { PipInspectOutput } from "../models";

export const getPipInspectOutput = (jsonPath: string): PipInspectOutput => {
  // if the file doesn't exist, throw an error
  if (!existsSync(jsonPath)) {
    throw new Error(`File not found: ${jsonPath}`);
  }

  // read and parse the JSON file
  const json = readFileSync(jsonPath, "utf8");
  return JSON.parse(json) as PipInspectOutput;
};
