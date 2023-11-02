import { Dependency } from "@jpfulton/license-auditor-common";
import { Metadata, PackageInfo, PipInspectOutput } from "../models";

export const convertPackageInfo = (
  packageInfo: PackageInfo,
  rootProjectName: string
): Dependency => {
  const { metadata } = packageInfo;
  const { name, version, author, author_email, home_page, project_urls } =
    metadata;

  // create author string, if possible, from author and author_email
  // if both are present, the format is "author <author_email>"
  // if only author is present, the format is "author"
  // if only author_email is present, the format is "author_email"
  // if neither are present, the format is ""
  let authorString = "";
  if (author && author_email) {
    authorString = `${author} <${author_email}>`;
  } else if (author) {
    authorString = author;
  } else if (author_email) {
    authorString = author_email;
  }

  // create repository string, if possible, from project_urls
  // if project_urls is present, search for a string within it
  // that starts with "Source, " and return the string with that prefix removed
  let repositoryString = "";
  if (project_urls && project_urls.length > 0) {
    const repository = project_urls.find((u) => u.startsWith("Source, "));
    if (repository) {
      repositoryString = repository.replace("Source, ", "");
    }
  }

  const dependency: Dependency = {
    rootProjectName: rootProjectName,
    name: name,
    version: version,
    publisher: authorString,
    repository: repositoryString,
    licenses: getLicensesFromMetadata(metadata).map((l) => {
      return {
        license: l,
        url: home_page || "",
      };
    }),
  };

  return dependency;
};

export const convertPipInspectOutput = (
  output: PipInspectOutput,
  rootProjectName: string
): Dependency[] => {
  const { installed } = output;

  const dependencies = installed.map((packageInfo) => {
    return convertPackageInfo(packageInfo, rootProjectName);
  });

  return dependencies;
};

export const getLicensesFromMetadata = (metadata: Metadata): string[] => {
  const { license, classifier } = metadata;

  // if there is a license and that license is not listed as "UNKNOWN", return it
  if (license && license !== "UNKNOWN") {
    return [license];
  }

  // if there is a classifier array, search for strings within it
  // that start with "License :: OSI Approved :: " and create a new array
  // with those strings, removing the prefix
  if (classifier && classifier.length > 0) {
    const licenses = classifier
      .filter((c) => c.startsWith("License :: OSI Approved :: "))
      .map((c) => c.replace("License :: OSI Approved :: ", ""));

    if (licenses.length > 0) {
      return licenses;
    }
  }

  // if there is no license, return "UNKNOWN" to flag for manual review and blacklist
  return ["UNKNOWN"];
};
