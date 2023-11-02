import { readFileSync } from "fs";

// return the version string from this module's package.json
export function getCurrentVersionString() {
  try {
    const packageJson = JSON.parse(
      readFileSync(`${__dirname}/../../../package.json`).toString()
    );
    const version = packageJson?.version ?? "UNKNOWN";
    return version;
  } catch (e) {
    // this error happens when running the tests
    // which have a different path relationship to the package.json file
    return "UNKNOWN";
  }
}

// python projects do not have a root config file that contains the project name
// take the project name from the first line in the README.md file at the root of the project
export function getRootProjectName(projectPath: string): string {
  const readmePath = `${projectPath}/README.md`;
  try {
    const readme = readFileSync(readmePath).toString();
    const firstLine = readme.split("\n")[0];
    const projectName = firstLine.replace("# ", "");
    return projectName;
  } catch (e) {
    // this error happens when running the tests
    // which have a different path relationship to the README.md file
    return "UNKNOWN";
  }
}
