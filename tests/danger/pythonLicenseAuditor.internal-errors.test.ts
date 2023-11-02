/* eslint-disable @typescript-eslint/no-var-requires */
import { Dependency } from "@jpfulton/license-auditor-common";
import { IPluginConfig } from "../../src/danger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;
declare let pythonLicenseAuditor:
  | ((config: Partial<IPluginConfig>) => Promise<void>)
  | undefined;

describe("pythonLicenseAuditor when there are internal errors", () => {
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

    // reset the mock for parseLicenseFactory
    jest.unmock("../../src/auditor/licenseChecker");
    jest.unmock("../../src/auditor/parseLicenses");

    // reset the licenseAuditor function
    pythonLicenseAuditor = undefined;

    // reset modules
    jest.resetModules();
  });

  it("should call fail if there is an error in parseLicenses", async () => {
    // arrange
    jest.doMock("../../src/auditor/licenseChecker", () => {
      // mock findAllLicenses to return an array of licenses
      const licenses: Dependency[] = [
        {
          licenses: [
            {
              license: "test",
              url: "test",
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
        ...jest.requireActual("../../src/auditor/licenseChecker"),
        findAllDependencies: () => licenses,
      };
    });

    jest.doMock("../../src/auditor/parseLicenses", () => {
      // mock the parserFactory to return a function that throws an error
      return {
        ...jest.requireActual("../../src/auditor/parseLicenses"),
        parserFactory: () => {
          throw new Error("test error");
        },
      };
    });

    pythonLicenseAuditor =
      require("../../src/danger/danger-plugin").pythonLicenseAuditor;
    const config = {
      failOnBlacklistedLicense: false,
      projectPath: process.cwd(),
      showMarkdownSummary: false,
    };
    const message = `[python-license-auditor-cli] Failed to audit licenses with error: test error`;

    // act
    await pythonLicenseAuditor!(config);

    // assert
    expect(global.fail).toHaveBeenCalledWith(message);
  });
});
