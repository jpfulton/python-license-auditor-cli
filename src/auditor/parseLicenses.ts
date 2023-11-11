import {
  Configuration,
  Dependency,
  DependencyOutputter,
  mapLicenseByGroupings,
} from "@jpfulton/license-auditor-common";

export const parserFactory =
  (
    configuration: Configuration,
    infoOutputter: DependencyOutputter,
    warnOutputter: DependencyOutputter,
    errorOutputter: DependencyOutputter
  ) =>
  (
    dependencies: Dependency[]
  ): {
    uniqueCount: number;
    whitelistedCount: number;
    warnCount: number;
    blacklistedCount: number;
    allOutputs: string[];
    blackListOutputs: string[];
    warnOutputs: string[];
    whiteListOutputs: string[];
  } => {
    let whitelistedCount = 0;
    let warnCount = 0;
    let blacklistedCount = 0;

    const whitelistedLicenses = configuration.whiteList;
    const blacklistedLicenses = configuration.blackList;

    const allOutputs: string[] = [];
    const blackListOutputs: string[] = [];
    const warnOutputs: string[] = [];
    const whiteListOutputs: string[] = [];

    // some python packages place the full text of the license in the license field
    // these dependencies have DependencyLicense objects with a fullText property
    // and are identified by the license "FULL TEXT"
    dependencies.forEach((dependency) => {
      dependency.licenses.forEach((depLicense) => {
        if (depLicense.license === "FULL TEXT") {
          // if the license is "FULL TEXT", then the full text is in the fullText property
          // get the first line from the full text and use it as the license property value
          const fullText = depLicense.fullText!;
          const firstLine = fullText.split("\n")[0];
          depLicense.license = firstLine;
        }
      });
    });

    dependencies.forEach((dependency) => {
      const isWhitelisted = dependency.licenses.some((depLicense) =>
        whitelistedLicenses.includes(
          mapLicenseByGroupings(configuration, depLicense.license)
        )
      );

      if (isWhitelisted) {
        whitelistedCount++;
        const result = infoOutputter(dependency);
        if (result !== "") {
          allOutputs.push(result);
          whiteListOutputs.push(result);
        }
      }

      // a dependency is blacklisted if it has a license that is in the blacklist
      // and does not include a license that is in the whitelist
      const isBlacklisted =
        dependency.licenses.some((depLicense) =>
          blacklistedLicenses.includes(
            mapLicenseByGroupings(configuration, depLicense.license)
          )
        ) && !isWhitelisted;

      if (!isWhitelisted && !isBlacklisted) {
        warnCount++;
        const result = warnOutputter(dependency);
        if (result !== "") {
          allOutputs.push(result);
          warnOutputs.push(result);
        }
      }

      if (isBlacklisted) {
        blacklistedCount++;
        const result = errorOutputter(dependency);
        if (result !== "") {
          allOutputs.push(result);
          blackListOutputs.push(result);
        }
      }
    });

    return {
      uniqueCount: dependencies.length,
      whitelistedCount: whitelistedCount,
      warnCount: warnCount,
      blacklistedCount: blacklistedCount,
      allOutputs: allOutputs,
      blackListOutputs: blackListOutputs,
      warnOutputs: warnOutputs,
      whiteListOutputs: whiteListOutputs,
    };
  };

export default parserFactory;
