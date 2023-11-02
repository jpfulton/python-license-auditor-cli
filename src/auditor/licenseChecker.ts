import {
  Configuration,
  Dependency,
  DependencyOutputter,
  MetadataOutputter,
  removeDuplicates,
} from "@jpfulton/license-auditor-common";
import {
  convertPipInspectOutput,
  getPipInspectOutput,
  getRootProjectName,
} from "../util";
import { parserFactory } from "./parseLicenses";

export const findAllDependencies = (projectPath: string): Dependency[] => {
  // get the pip inspect output
  const pipJsonFile = `${projectPath}/pip-inspect.json`;
  const pipInspectOutput = getPipInspectOutput(pipJsonFile);

  // get the root project name
  const rootProjectName = getRootProjectName(projectPath);

  // convert the pip inspect output to a list of dependencies
  let dependencies = convertPipInspectOutput(pipInspectOutput, rootProjectName);

  // remove duplicates
  dependencies = removeDuplicates(dependencies);

  // sort by name
  dependencies.sort((a, b) => a.name.localeCompare(b.name));

  return dependencies;
};

export const checkLicenses = (
  configuration: Configuration,
  projectPath: string,
  metadataOutputter: MetadataOutputter,
  infoOutputter: DependencyOutputter,
  warnOutputter: DependencyOutputter,
  errorOutputter: DependencyOutputter
) => {
  if (!projectPath) {
    return console.error("No project path provided.");
  }

  try {
    const dependencies = findAllDependencies(projectPath);

    if (!dependencies || dependencies.length <= 0) {
      return console.error("No dependencies found.");
    }

    const parse = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    const result = parse(dependencies);
    const {
      uniqueCount,
      whitelistedCount,
      warnCount,
      blacklistedCount,
      blackListOutputs,
      warnOutputs,
      whiteListOutputs,
    } = result;

    metadataOutputter(
      uniqueCount,
      whitelistedCount,
      warnCount,
      blacklistedCount
    );

    // construct outputs placing blacklisted first, then warnings, then whitelisted
    const outputs = [...blackListOutputs, ...warnOutputs, ...whiteListOutputs];
    outputs.forEach((output) => console.log(output));
  } catch (err) {
    console.error((err as Error).message);
  }
};

export default checkLicenses;
