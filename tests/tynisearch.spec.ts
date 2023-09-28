import { TyniSearch } from "../src";
import {
  ExampleTitleAndExpectedKeywordList,
  KeywordListForTesting,
  KeywordListWithoutWhiteSpace,
  KeywordListWithWhiteSpace,
  TestSuiteForDelete,
} from "./test-dataset-for-trie";

describe("testing for trie, simply finding keyword exist or not in trie", () => {
  let tyniSearch: TyniSearch;

  beforeEach(() => {
    tyniSearch = new TyniSearch();

    tyniSearch.insert([
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]);
  });

  it("should return true for the result of finding exist keywords", () => {
    const { EXIST } = KeywordListForTesting;
    for (const existKeyword of EXIST) {
      expect(tyniSearch.searchKeyword(existKeyword)).toBe(true);
    }
  });

  it("should return false for the result of finding exist keywords", () => {
    const { NOT_EXIST } = KeywordListForTesting;
    for (const existKeyword of NOT_EXIST) {
      expect(tyniSearch.searchKeyword(existKeyword)).toBe(false);
    }
  });
});

describe("testing for trie and aho-corasick pattern matching searching", () => {
  let keywordSearchMachine: TyniSearch;
  beforeEach(() => {
    keywordSearchMachine = new TyniSearch();

    keywordSearchMachine.insert([
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]);
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
  let tyniSearch: TyniSearch;

  beforeEach(() => {
    tyniSearch = new TyniSearch();
    tyniSearch.insert([
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]);
  });

  it("should not found a keyword which be removed", () => {
    const { keywordToDelete, expectedKeywordList, title } =
      TestSuiteForDelete[0];
    tyniSearch.delete(keywordToDelete);
    const result = tyniSearch.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  it("ignore removing not existed keyword", () => {
    const { keywordToDelete, expectedKeywordList, title } =
      TestSuiteForDelete[1];
    expect(() => tyniSearch.delete(keywordToDelete)).not.toThrowError();
    tyniSearch.delete(keywordToDelete);
    const result = tyniSearch.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });
});

describe("testing for deletion: a little bit more complex scenario", () => {
  let tyniSearch: TyniSearch;

  beforeEach(() => {
    tyniSearch = new TyniSearch();
  });

  it("removing keyword scenario. 0", () => {
    tyniSearch.insert(["비비고", "비에고", "비에삼", "비비삼"]);
    tyniSearch.delete(["비비고", "비비삼"]);

    const result = tyniSearch.searchInSentence(
      "비비고의 별명은 비에고, 비에삼, 그리고 비비삼이다.",
    );
    expect(result.sort()).toStrictEqual(["비에고", "비에삼"].sort());
  });

  it("removing keyword scenario. 1", () => {
    tyniSearch.insert(["비비고", "비비고라니", "비비고병특"]);
    tyniSearch.delete(["비비고"]);

    const result = tyniSearch.searchInSentence(
      "비비고의 별명은 비비고라니, 그리고 비비고병특이다.",
    );
    expect(result.sort()).toStrictEqual(["비비고라니", "비비고병특"].sort());
    expect(result).not.toContain("비비고");
  });

  it("removing keyword scenario. 2", () => {
    tyniSearch.insert(["비비고", "비비고병특", "비비고라니", "비비고병역특례"]);
    tyniSearch.delete(["비비고병특"]);

    const result = tyniSearch.searchInSentence(
      "비비고의 별명은 비비고라니, 그리고 비비고병특이다. 여기서 병특은 준말이며, 비비고병역특례가 풀 네임이다.",
    );
    expect(result.sort()).toStrictEqual(
      ["비비고라니", "비비고", "비비고병역특례"].sort(),
    );
    expect(result).not.toContain("비비고병특");
  });
});

describe("testing for trie serialization / de-serialization", () => {
  let tyniSearch: TyniSearch;

  beforeEach(() => {
    tyniSearch = new TyniSearch();

    tyniSearch.insert([
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]);
  });

  it("should be serialized", () => {
    const serializedResult = tyniSearch.serialize();
    expect(typeof serializedResult).toEqual("string");
  });

  it("should be parsed into KeywordSearchMachine instance from serialized result", () => {
    const serializedResult = tyniSearch.serialize();
    expect(() => TyniSearch.deserialize(serializedResult)).not.toThrowError();
    const parsedResult = TyniSearch.deserialize(serializedResult);
    expect(parsedResult).toBeInstanceOf(TyniSearch);
  });

  it("should work well when finding keywords from a string", () => {
    const serializedResult = tyniSearch.serialize();
    const parsedResult = TyniSearch.deserialize(serializedResult);

    const { title, expectedKeywordList } =
      ExampleTitleAndExpectedKeywordList[0];
    const result = parsedResult.searchInSentence(title);
    expect(result.sort()).toEqual(expectedKeywordList.sort());
  });

  it("should throw an error when parsing invalid serialized result", () => {
    const invalidSer = "invalid";
    expect(() => TyniSearch.deserialize(invalidSer)).toThrowError();
  });
});

describe("testing for building failure link", () => {
  let instanceA: TyniSearch;
  let instanceB: TyniSearch;

  beforeEach(() => {
    instanceA = new TyniSearch();
    instanceA.insert([
      ...KeywordListWithoutWhiteSpace.slice(0, 5),
      ...KeywordListWithWhiteSpace.slice(0, 5),
    ]);

    instanceB = new TyniSearch();
    instanceB.insert([
      ...KeywordListWithoutWhiteSpace.slice(0, 5),
      ...KeywordListWithWhiteSpace.slice(0, 5),
    ]);
  });

  it("should assure the same result to same input", () => {
    expect(instanceA).toStrictEqual(instanceB);
  });
});

describe("testing for getting the number of nodes", () => {
  it('should return 7 when inserting ["abc", "abcd", "abcde", "abcdef"]', () => {
    const tyniSearch = new TyniSearch();
    tyniSearch.insert(["abc", "abcd", "abcde", "abcdef"]);

    expect(tyniSearch.getNumberOfNodes()).toEqual(7);
  });
});

describe("testing for getting all keywords from trie", () => {
  let tyniSearch: TyniSearch;

  beforeEach(() => {
    tyniSearch = new TyniSearch();
    tyniSearch.insert([
      ...KeywordListWithoutWhiteSpace,
      ...KeywordListWithWhiteSpace,
    ]);
  });

  it("should assure the same result to same input", () => {
    expect(tyniSearch.getAllKeywords().sort()).toStrictEqual(
      [...KeywordListWithoutWhiteSpace, ...KeywordListWithWhiteSpace].sort(),
    );
  });
});
