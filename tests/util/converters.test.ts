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

  it("should return a Dependency object with license 'FULL TEXT' if license is longer than 50 characters", () => {
    const licenseFullText = `BSD 3-Clause License (Revised)
        
    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are
    met:
    
    1. Redistributions of source code must retain the above copyright
       notice, this list of conditions and the following disclaimer.
    
    2. Redistributions in binary form must reproduce the above copyright
       notice, this list of conditions and the following disclaimer in the
       documentation and/or other materials provided with the distribution.
    
    3. Neither the name of the project nor the names of its contributors
       may be used to endorse or promote products derived from this software
       without specific prior written permission.
    
    THIS SOFTWARE IS PROVIDED BY THE PROJECT AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED.  IN NO EVENT SHALL THE PROJECT OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
    OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
    HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
    LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
    OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.`;

    const packageInfo = {
      metadata: {
        metadata_version: "2.1",
        name: "six",
        version: "1.15.0",
        summary: "Python 2 and 3 compatibility utilities",
        home_page: "https://www.google.com",
        platform: ["UNKNOWN"],
        license: licenseFullText,
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
          license: "FULL TEXT",
          url: "https://www.google.com",
          fullText: licenseFullText,
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
