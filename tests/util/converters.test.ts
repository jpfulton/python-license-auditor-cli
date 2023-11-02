import { Dependency } from "@jpfulton/license-auditor-common";
import { Metadata, PackageInfo } from "../../src/models";
import {
  convertPackageInfo,
  getLicensesFromMetadata,
} from "../../src/util/converters";

describe("convertPackageInfo", () => {
  it("should return a Dependency object", () => {
    const packageInfo = {
      metadata: {
        metadata_version: "2.1",
        name: "six",
        version: "1.15.0",
        summary: "Python 2 and 3 compatibility utilities",
        home_page: "https://www.google.com",
        platform: ["UNKNOWN"],
        author: "Benjamin Peterson",
        author_email: "test@example.com",
        license: "MIT",
        project_urls: ["Source, https://www.sourcecode.com"],
      },
    } as PackageInfo;

    const rootProjectName = "test";

    const expectedDependency = {
      rootProjectName: rootProjectName,
      name: "six",
      version: "1.15.0",
      publisher: "Benjamin Peterson <test@example.com>",
      repository: "https://www.sourcecode.com",
      licenses: [
        {
          license: "MIT",
          url: "https://www.google.com",
        },
      ],
    } as Dependency;

    const actualDependency = convertPackageInfo(packageInfo, rootProjectName);

    expect(actualDependency).toEqual(expectedDependency);
  });

  it("should return a Dependency object with empty string for publisher if author and author_email are not present", () => {
    const packageInfo = {
      metadata: {
        metadata_version: "2.1",
        name: "six",
        version: "1.15.0",
        summary: "Python 2 and 3 compatibility utilities",
        home_page: "https://www.google.com",
        platform: ["UNKNOWN"],
        license: "MIT",
        project_urls: ["Source, https://www.sourcecode.com"],
      },
    } as PackageInfo;

    const rootProjectName = "test";

    const expectedDependency = {
      rootProjectName: rootProjectName,
      name: "six",
      version: "1.15.0",
      publisher: "",
      repository: "https://www.sourcecode.com",
      licenses: [
        {
          license: "MIT",
          url: "https://www.google.com",
        },
      ],
    } as Dependency;

    const actualDependency = convertPackageInfo(packageInfo, rootProjectName);

    expect(actualDependency).toEqual(expectedDependency);
  });

  it("should return a Dependency object with empty string for repository if project_urls is not present", () => {
    const packageInfo = {
      metadata: {
        metadata_version: "2.1",
        name: "six",
        version: "1.15.0",
        summary: "Python 2 and 3 compatibility utilities",
        home_page: "https://www.google.com",
        platform: ["UNKNOWN"],
        license: "MIT",
      },
    } as PackageInfo;

    const rootProjectName = "test";

    const expectedDependency = {
      rootProjectName: rootProjectName,
      name: "six",
      version: "1.15.0",
      publisher: "",
      repository: "",
      licenses: [
        {
          license: "MIT",
          url: "https://www.google.com",
        },
      ],
    } as Dependency;

    const actualDependency = convertPackageInfo(packageInfo, rootProjectName);

    expect(actualDependency).toEqual(expectedDependency);
  });
});

describe("getLicensesFromMetadata", () => {
  it("should return an array of licenses from metadata", () => {
    const metadata = {
      metadata_version: "2.1",
      name: "six",
      version: "1.15.0",
      summary: "Python 2 and 3 compatibility utilities",
      home_page: "https://www.google.com",
      platform: ["UNKNOWN"],
      license: "MIT",
      project_urls: ["Source, https://www.sourcecode.com"],
    } as Metadata;

    const expectedLicenses = ["MIT"];

    const actualLicenses = getLicensesFromMetadata(metadata);

    expect(actualLicenses).toEqual(expectedLicenses);
  });

  it("should return an array with 'UNKNOWN' if metadata does not contain a license", () => {
    const metadata = {
      metadata_version: "2.1",
      name: "six",
      version: "1.15.0",
      summary: "Python 2 and 3 compatibility utilities",
      home_page: "https://www.google.com",
      platform: ["UNKNOWN"],
      project_urls: ["Source, https://www.sourcecode.com"],
    } as Metadata;

    const expectedLicenses: string[] = ["UNKNOWN"];

    const actualLicenses = getLicensesFromMetadata(metadata);

    expect(actualLicenses).toEqual(expectedLicenses);
  });

  it("should return licenses from classifier if metadata does not contain a license", () => {
    const metadata = {
      metadata_version: "2.1",
      name: "six",
      version: "1.15.0",
      summary: "Python 2 and 3 compatibility utilities",
      home_page: "https://www.google.com",
      platform: ["UNKNOWN"],
      classifier: ["License :: OSI Approved :: MIT License"],
      project_urls: ["Source, https://www.sourcecode.com"],
    } as Metadata;

    const expectedLicenses: string[] = ["MIT License"];

    const actualLicenses = getLicensesFromMetadata(metadata);

    expect(actualLicenses).toEqual(expectedLicenses);
  });

  it("should return an array of licenses from classifier if metadata does not contain a license and classifier contains multiple licenses", () => {
    const metadata = {
      metadata_version: "2.1",
      name: "six",
      version: "1.15.0",
      summary: "Python 2 and 3 compatibility utilities",
      home_page: "https://www.google.com",
      platform: ["UNKNOWN"],
      classifier: [
        "License :: OSI Approved :: MIT License",
        "License :: OSI Approved :: Apache Software License",
      ],
      project_urls: ["Source, https://www.sourcecode.com"],
    } as Metadata;

    const expectedLicenses: string[] = [
      "MIT License",
      "Apache Software License",
    ];

    const actualLicenses = getLicensesFromMetadata(metadata);

    expect(actualLicenses).toEqual(expectedLicenses);
  });
});
