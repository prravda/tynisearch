import { TyniSearch } from "../tynisearch";
import {
  ExampleTitleAndExpectedKeywordList,
  KeywordListForTesting,
  KeywordListWithoutWhiteSpace,
  KeywordListWithWhiteSpace,
  TestSuiteForDelete,
} from "./test-dataset-for-trie";

describe("testing for trie, simply finding keyword exist or not in trie", () => {
  let keywordSearchMachine: TyniSearch;

  beforeEach(() => {
    keywordSearchMachine = new TyniSearch();
    // inserting keywords
    for (const word of [
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]) {
      keywordSearchMachine.insert(word);
      keywordSearchMachine.buildFailureLinks();
    }
  });

  it("should return true for the result of finding exist keywords", () => {
    const { EXIST } = KeywordListForTesting;
    for (const existKeyword of EXIST) {
      expect(keywordSearchMachine.searchKeyword(existKeyword)).toBe(true);
    }
  });

  it("should return false for the result of finding exist keywords", () => {
    const { NOT_EXIST } = KeywordListForTesting;
    for (const existKeyword of NOT_EXIST) {
      expect(keywordSearchMachine.searchKeyword(existKeyword)).toBe(false);
    }
  });
});

describe("testing for trie and aho-corasick pattern matching searching", () => {
  let keywordSearchMachine: TyniSearch;
  beforeEach(() => {
    keywordSearchMachine = new TyniSearch();
    // inserting keywords
    for (const word of [
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]) {
      keywordSearchMachine.insert(word);
      keywordSearchMachine.buildFailureLinks();
    }
  });

  it("[ case 0 ] should find all matched keywords as a list", () => {
    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[0];
    const result = keywordSearchMachine.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  it("[ case 1 ] should find all matched keywords as a list", () => {
    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[1];
    const result = keywordSearchMachine.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  it("[ case 2 ] should find all matched keywords as a list", () => {
    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[2];
    const result = keywordSearchMachine.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  it("[ case 3 ] should find all matched keywords as a list", () => {
    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[2];
    const result = keywordSearchMachine.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  it("[ case 4 ] should find all matched keywords as a list", () => {
    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[3];
    const result = keywordSearchMachine.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });
});

describe("testing for deletion", () => {
  let keywordSearchMachineInstance: TyniSearch;

  beforeEach(() => {
    keywordSearchMachineInstance = new TyniSearch();
    // insert keywords into trie
    for (const word of [
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]) {
      keywordSearchMachineInstance.insert(word);
    }
    keywordSearchMachineInstance.buildFailureLinks();
  });

  it("should not found a keyword which be removed", () => {
    const { keywordToDelete, expectedKeywordList, title } =
      TestSuiteForDelete[0];
    keywordSearchMachineInstance.delete(keywordToDelete);
    const result = keywordSearchMachineInstance.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  it("ignore removing not existed keyword", () => {
    const { keywordToDelete, expectedKeywordList, title } =
      TestSuiteForDelete[1];
    expect(() =>
      keywordSearchMachineInstance.delete(keywordToDelete),
    ).not.toThrowError();
    keywordSearchMachineInstance.delete(keywordToDelete);
    const result = keywordSearchMachineInstance.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });
});

describe("testing for deletion: a little bit more complex scenario", () => {
  let instance: TyniSearch;

  beforeEach(() => {
    instance = new TyniSearch();
  });

  it("removing keyword scenario. 0", () => {
    const mockKeywords = ["비비고", "비에고", "비에삼", "비비삼"];
    mockKeywords.forEach((keyword) => instance.insert(keyword));

    instance.delete("비비고");
    instance.delete("비비삼");

    instance.buildFailureLinks();

    const result = instance.searchInSentence(
      "비비고의 별명은 비에고, 비에삼, 그리고 비비삼이다.",
    );
    expect(result.sort()).toStrictEqual(["비에고", "비에삼"].sort());
  });

  it("removing keyword scenario. 1", () => {
    const mockKeywords = ["비비고", "비비고라니", "비비고병특"];
    mockKeywords.forEach((keyword) => instance.insert(keyword));

    instance.delete("비비고");

    instance.buildFailureLinks();

    const result = instance.searchInSentence(
      "비비고의 별명은 비비고라니, 그리고 비비고병특이다.",
    );
    expect(result.sort()).toStrictEqual(["비비고라니", "비비고병특"].sort());
    expect(result).not.toContain("비비고");
  });

  it("removing keyword scenario. 2", () => {
    const mockKeywords = [
      "비비고",
      "비비고병특",
      "비비고라니",
      "비비고병역특례",
    ];
    mockKeywords.forEach((keyword) => instance.insert(keyword));

    instance.delete("비비고병특");

    instance.buildFailureLinks();

    const result = instance.searchInSentence(
      "비비고의 별명은 비비고라니, 그리고 비비고병특이다. 여기서 병특은 준말이며, 비비고병역특례가 풀 네임이다.",
    );
    expect(result.sort()).toStrictEqual(
      ["비비고라니", "비비고", "비비고병역특례"].sort(),
    );
    expect(result).not.toContain("비비고병특");
  });
});

describe("testing for trie serialization / de-serialization", () => {
  let keywordSearchMachineInstance: TyniSearch;

  beforeEach(() => {
    keywordSearchMachineInstance = new TyniSearch();
    // insert keywords into trie
    for (const word of [
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]) {
      keywordSearchMachineInstance.insert(word);
    }
  });

  it("should be serialized to JSON", () => {
    const serializedResult = keywordSearchMachineInstance.toJSON();
    expect(serializedResult).toBeInstanceOf(Object);
  });

  it("should be parsed into KeywordSearchMachine instance from serialized result", () => {
    const serializedResult = keywordSearchMachineInstance.toJSON();
    expect(() => TyniSearch.fromJSON(serializedResult)).not.toThrowError();
    const parsedResult = TyniSearch.fromJSON(serializedResult);
    expect(parsedResult).toBeInstanceOf(TyniSearch);
  });

  it("should work well when finding keywords from a string", () => {
    const serializedResult = keywordSearchMachineInstance.toJSON();
    const parsedResult = TyniSearch.fromJSON(serializedResult);

    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[0];
    parsedResult.buildFailureLinks();
    const result = parsedResult.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });
});

describe("testing for trie serialization / de-serialization in iterative way", () => {
  let keywordSearchMachineInstance: TyniSearch;

  beforeEach(() => {
    keywordSearchMachineInstance = new TyniSearch();
    // insert keywords into trie
    for (const word of [
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]) {
      keywordSearchMachineInstance.insert(word);
    }
  });

  it("should be serialized to JSON", () => {
    const serializedResult = keywordSearchMachineInstance.toJSONIteratively();
    expect(serializedResult).toBeInstanceOf(Object);
  });

  it("should be parsed into KeywordSearchMachine instance from serialized result", () => {
    const serializedResult = keywordSearchMachineInstance.toJSONIteratively();
    expect(() =>
      TyniSearch.fromJSONIteratively(serializedResult),
    ).not.toThrowError();
    const parsedResult = TyniSearch.fromJSONIteratively(serializedResult);
    expect(parsedResult).toBeInstanceOf(TyniSearch);
  });

  it("should work well when finding keywords from a string", () => {
    const serializedResult = keywordSearchMachineInstance.toJSONIteratively();
    const parsedResult = TyniSearch.fromJSONIteratively(serializedResult);

    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[0];
    parsedResult.buildFailureLinks();
    const result = parsedResult.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });
});

describe("testing for trie serialization / de-serialization using trampoline", () => {
  let keywordSearchMachineInstance: TyniSearch;
  beforeEach(() => {
    keywordSearchMachineInstance = new TyniSearch();
    // insert keywords into trie
    for (const word of [
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]) {
      keywordSearchMachineInstance.insert(word);
    }
  });

  it("should be serialized to JSON", () => {
    const serializedResult = keywordSearchMachineInstance.toJSONRecursively();
    expect(serializedResult).toBeInstanceOf(Object);
  });

  it("should be parsed into KeywordSearchMachine instance from serialized result", () => {
    const serializedResult = keywordSearchMachineInstance.toJSONRecursively();
    expect(() =>
      TyniSearch.fromJSONRecursively(serializedResult),
    ).not.toThrowError();
    const parsedResult = TyniSearch.fromJSONRecursively(serializedResult);
    expect(parsedResult).toBeInstanceOf(TyniSearch);
  });

  it("should work well when finding keywords from a string", () => {
    const serializedResult = keywordSearchMachineInstance.toJSONRecursively();
    const parsedResult = TyniSearch.fromJSONRecursively(serializedResult);

    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[0];
    parsedResult.buildFailureLinks();
    const result = parsedResult.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  describe("testing for building failure link", () => {
    let instanceA: TyniSearch;
    let instanceB: TyniSearch;
    beforeEach(() => {
      instanceA = new TyniSearch();
      // insert keywords into trie
      for (const word of [
        ...KeywordListWithoutWhiteSpace.slice(0, 5),
        ...KeywordListWithWhiteSpace.slice(0, 5),
      ]) {
        instanceA.insert(word);
      }

      instanceB = new TyniSearch();
      // insert keywords into trie
      for (const word of [
        ...KeywordListWithoutWhiteSpace.slice(0, 5),
        ...KeywordListWithWhiteSpace.slice(0, 5),
      ]) {
        instanceB.insert(word);
      }
    });

    it("should assure the same result to same input", () => {
      instanceA.buildFailureLinks();
      instanceB.buildFailureLinks();

      expect(instanceA).toStrictEqual(instanceB);
    });

    it("should assure the idempotency", () => {
      instanceA.buildFailureLinks();

      instanceB.buildFailureLinks();
      instanceB.buildFailureLinks();

      expect(instanceA).toStrictEqual(instanceB);
    });
  });
});
