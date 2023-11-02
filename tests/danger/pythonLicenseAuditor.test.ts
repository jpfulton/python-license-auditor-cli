/* eslint-disable @typescript-eslint/no-var-requires */
import { Dependency } from "@jpfulton/license-auditor-common";
import { IPluginConfig } from "../../src/danger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;
declare let pythonLicenseAuditor:
  | ((config: Partial<IPluginConfig>) => Promise<void>)
  | undefined;

describe("pythonLicenseAuditor", () => {
  beforeEach(() => {
    // mock the danger functions warn, fail, and markdown and attach them to the global object
    global.warn = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();
  });

  afterEach(() => {
    // set the global object back to its original state
    global.warn = undefined;
    global.fail = undefined;
    global.markdown = undefined;

    // reset the mocks
    jest.unmock("../../src/auditor/licenseChecker");
    jest.unmock("../../src/auditor/parseLicenses");

    // reset the licenseAuditor function
    pythonLicenseAuditor = undefined;

    // reset modules
    jest.resetModules();
  });

  it("should call fail if failOnBlacklistedLicense is true and there are blacklisted licenses", async () => {
    // arrange
    jest.doMock("../../src/auditor/licenseChecker", () => {
      // mock findAllLicenses to return an array of licenses
      const licenses: Dependency[] = [
        {
          licenses: [
            {
              license: "UNKNOWN",
              url: undefined,
            },
          ],
          name: "test",
          version: "test",
          repository: "test",
          publisher: "test",
          rootProjectName: "test",
          email: "test",
          path: "test",
        },
      ];
      return {
        findAllDependencies: () => licenses,
      };
    });

    // load the pythonLicenseAuditor function
    pythonLicenseAuditor = (await import("../../src/danger"))
      .pythonLicenseAuditor;

    // act
    await pythonLicenseAuditor({
      failOnBlacklistedLicense: true,
    });

    // assert
    expect(global.fail).toHaveBeenCalledWith("Found 1 blacklisted licenses.");
  });

  it("should call warn if failOnBlacklistedLicense is false and there are blacklisted licenses", async () => {
    // arrange
    jest.doMock("../../src/auditor/licenseChecker", () => {
      // mock findAllLicenses to return an array of licenses
      const licenses: Dependency[] = [
        {
          licenses: [
            {
              license: "UNKNOWN",
              url: undefined,
              path: "test",
            },
          ],
          name: "test",
          version: "test",
          repository: "test",
          publisher: "test",
          rootProjectName: "test",
          email: "test",
          path: "test",
        },
      ];
      return {
        findAllDependencies: () => licenses,
      };
    });

    // load the pythonLicenseAuditor function
    pythonLicenseAuditor = (await import("../../src/danger"))
      .pythonLicenseAuditor;

    // act
    await pythonLicenseAuditor({
      failOnBlacklistedLicense: false,
    });

    // assert
    expect(global.warn).toHaveBeenCalledWith("Found 1 blacklisted licenses.");
  });

  it("should call markdown if showMarkdownSummary is true", async () => {
    // arrange
    jest.doMock("../../src/auditor/licenseChecker", () => {
      // mock findAllLicenses to return an array of licenses
      const licenses: Dependency[] = [
        {
          licenses: [
            {
              license: "UNKNOWN",
              url: undefined,
              path: "test",
            },
          ],
          name: "test",
          version: "test",
          repository: "test",
          publisher: "test",
          rootProjectName: "test",
          email: "test",
          path: "test",
        },
      ];
      return {
        findAllDependencies: () => licenses,
      };
    });

    const uniqueCount = 3;
    const whitelistedCount = 1;
    const warnCount = 1;
    const blacklistedCount = 1;

    jest.doMock("../../src/auditor/parseLicenses", () => {
      // mock the parserFactory to return a function that returns a result
      return {
        parserFactory: () => {
          return () => {
            return {
              uniqueCount,
              whitelistedCount,
              warnCount,
              blacklistedCount,
              outputs: [],
            };
          };
        },
      };
    });

    // load the pythonLicenseAuditor function
    pythonLicenseAuditor = (await import("../../src/danger"))
      .pythonLicenseAuditor;

    const markdownSummary = `| :hash: Unique Licenses | :green_circle: Whitelisted Licenses | :yellow_circle: Warned Licenses | :red_circle: Blacklisted Licenses |
|---|---|---|---|
| ${uniqueCount} | ${whitelistedCount} | ${warnCount} | ${blacklistedCount} |`;

    // act
    await pythonLicenseAuditor({
      showMarkdownSummary: true,
    });

    // assert
    expect(global.markdown).toHaveBeenCalled();
    // expect markdown to have been called the third time with the markdownSummary
    expect(global.markdown).toHaveBeenNthCalledWith(3, markdownSummary);
  });

  it("should call warn if there are licenses that are neither whitelisted nor blacklisted", async () => {
    // arrange
    jest.doMock("../../src/auditor/licenseChecker", () => {
      // mock findAllLicenses to return an array of licenses
      const licenses: Dependency[] = [
        {
          licenses: [
            {
              license: "test",
              url: undefined,
              path: "test",
            },
          ],
          name: "test",
          version: "test",
          repository: "test",
          publisher: "test",
          rootProjectName: "test",
          email: "test",
          path: "test",
        },
      ];
      return {
        findAllDependencies: () => licenses,
      };
    });

    // load the pythonLicenseAuditor function
    pythonLicenseAuditor = (await import("../../src/danger"))
      .pythonLicenseAuditor;

    // act
    await pythonLicenseAuditor({});

    // assert
    expect(global.warn).toHaveBeenCalledWith(
      "Found 1 licenses that we neither whitelisted nor blacklisted by the configuration."
    );
  });
});
