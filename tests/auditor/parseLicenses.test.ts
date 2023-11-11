import { parserFactory } from "../../src/auditor";

import { Configuration, Dependency } from "@jpfulton/license-auditor-common";

describe("parserFactory", () => {
  it("should return a function", () => {
    const configuration: Configuration = {
      whiteList: [],
      blackList: [],
      groupings: [],
      configurationSource: "default",
      configurationFileName: "",
    };
    const infoOutputter = jest.fn();
    const warnOutputter = jest.fn();
    const errorOutputter = jest.fn();

    const parser = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    expect(typeof parser).toBe("function");
  });

  it("should return a function that returns an object with the correct properties", () => {
    const configuration: Configuration = {
      whiteList: [],
      blackList: [],
      groupings: [],
      configurationSource: "default",
      configurationFileName: "",
    };
    const infoOutputter = jest.fn();
    const warnOutputter = jest.fn();
    const errorOutputter = jest.fn();

    const parser = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    const dependencies: Dependency[] = [];

    const actual = parser(dependencies);

    const expected = {
      uniqueCount: 0,
      whitelistedCount: 0,
      warnCount: 0,
      blacklistedCount: 0,
      allOutputs: [],
      blackListOutputs: [],
      warnOutputs: [],
      whiteListOutputs: [],
    };

    expect(actual).toEqual(expected);
  });

  it("should return a function that returns an object with the correct properties when given a dependency", () => {
    const configuration: Configuration = {
      whiteList: [],
      blackList: [],
      groupings: [],
      configurationSource: "default",
      configurationFileName: "",
    };
    const infoOutputter = jest.fn();
    const warnOutputter = jest.fn();
    const errorOutputter = jest.fn();

    const parser = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    const dependencies = [
      {
        rootProjectName: "test",
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
      },
    ];

    const actual = parser(dependencies);

    const expected = {
      uniqueCount: 1,
      whitelistedCount: 0,
      warnCount: 1,
      blacklistedCount: 0,
      allOutputs: [],
      blackListOutputs: [],
      warnOutputs: [],
      whiteListOutputs: [],
    };

    expect(actual).toEqual(expected);
  });

  it("should return a function that returns an object with the correct properties when given a dependency that is whitelisted", () => {
    const configuration: Configuration = {
      whiteList: ["MIT"],
      blackList: [],
      groupings: [],
      configurationSource: "default",
      configurationFileName: "",
    };
    const infoOutputter = jest.fn();
    const warnOutputter = jest.fn();
    const errorOutputter = jest.fn();

    const parser = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    const dependencies = [
      {
        rootProjectName: "test",
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
      },
    ];

    const actual = parser(dependencies);

    const expected = {
      uniqueCount: 1,
      whitelistedCount: 1,
      warnCount: 0,
      blacklistedCount: 0,
      allOutputs: [],
      blackListOutputs: [],
      warnOutputs: [],
      whiteListOutputs: [],
    };

    expect(actual).toEqual(expected);
  });

  it("should return a function that returns an object with the correct properties when given a dependency that is blacklisted", () => {
    const configuration: Configuration = {
      whiteList: [],
      blackList: ["MIT"],
      groupings: [],
      configurationSource: "default",
      configurationFileName: "",
    };
    const infoOutputter = jest.fn();
    const warnOutputter = jest.fn();
    const errorOutputter = jest.fn();

    const parser = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    const dependencies = [
      {
        rootProjectName: "test",
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
      },
    ];

    const actual = parser(dependencies);

    const expected = {
      uniqueCount: 1,
      whitelistedCount: 0,
      warnCount: 0,
      blacklistedCount: 1,
      allOutputs: [],
      blackListOutputs: [],
      warnOutputs: [],
      whiteListOutputs: [],
    };

    expect(actual).toEqual(expected);
  });

  it("should return a function that returns an object with the correct properties when given a dependency that is whitelisted and blacklisted", () => {
    const configuration: Configuration = {
      whiteList: ["MIT"],
      blackList: ["MIT"],
      groupings: [],
      configurationSource: "default",
      configurationFileName: "",
    };
    const infoOutputter = jest.fn();
    const warnOutputter = jest.fn();
    const errorOutputter = jest.fn();

    const parser = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    const dependencies = [
      {
        rootProjectName: "test",
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
      },
    ];

    const actual = parser(dependencies);

    const expected = {
      uniqueCount: 1,
      whitelistedCount: 1,
      warnCount: 0,
      blacklistedCount: 0,
      allOutputs: [],
      blackListOutputs: [],
      warnOutputs: [],
      whiteListOutputs: [],
    };

    expect(actual).toEqual(expected);
  });

  it("should return a function that returns an object with the correct properties when given a dependency that is whitelisted and has a full text license", () => {
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

    const configuration: Configuration = {
      whiteList: ["BSD 3-Clause License (Revised)"],
      blackList: [],
      groupings: [],
      configurationSource: "default",
      configurationFileName: "",
    };
    const infoOutputter = jest.fn();
    const warnOutputter = jest.fn();
    const errorOutputter = jest.fn();

    const parser = parserFactory(
      configuration,
      infoOutputter,
      warnOutputter,
      errorOutputter
    );

    const dependencies = [
      {
        rootProjectName: "test",
        name: "six",
        version: "1.15.0",
        publisher: "",
        repository: "https://www.sourcecode.com",
        licenses: [
          {
            license: "FULL TEXT",
            url: "https://www.google.com",
            fullText: licenseFullText,
          },
        ],
      },
    ];

    const actual = parser(dependencies);

    const expected = {
      uniqueCount: 1,
      whitelistedCount: 1,
      warnCount: 0,
      blacklistedCount: 0,
      allOutputs: [],
      blackListOutputs: [],
      warnOutputs: [],
      whiteListOutputs: [],
    };

    expect(actual).toEqual(expected);
  });
});
