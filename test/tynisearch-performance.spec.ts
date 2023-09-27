import { TyniSearch } from "../src";
import { readFile } from "node:fs/promises";

// number of total dataset is about 700k
describe("performance testing for trie", () => {
  let tyniSearch = new TyniSearch();
  let numberOfWordsForTesting = 10_000;
  let partialSet: string[];

  beforeAll(async () => {
    const data = await readFile(`${__dirname}/dataset.txt`, "utf-8");

    partialSet = data.split(/\r?\n/).slice(0, numberOfWordsForTesting);

    console.log(
      `Number of words pushed into trie: ${new Intl.NumberFormat().format(
        numberOfWordsForTesting,
      )}`,
    );
  });

  it(`performance check - insert ${new Intl.NumberFormat().format(
    numberOfWordsForTesting,
  )} words`, () => {
    tyniSearch.insert(partialSet);

    console.log(
      `performance check - insert ${new Intl.NumberFormat().format(
        numberOfWordsForTesting,
      )} words into trie, serialize`,
    );

    expect(tyniSearch.getAllKeywords().length).toEqual(numberOfWordsForTesting);
  });

  it("performance check - serde", () => {
    const serialized = tyniSearch.serialize();
    tyniSearch = TyniSearch.deserialize(serialized);

    expect(tyniSearch).toBeInstanceOf(TyniSearch);
  });

  it("performance check - add a new word, build failure links again", () => {
    tyniSearch.insert(["나랑드", "사이다"]);
  });

  it("performance check - search the word just before added", () => {
    const result = tyniSearch.searchInSentence("나랑드 사이다 특가");
    expect(result.sort()).toEqual(["나랑드", "사이다"].sort());
  });

  it("performance check - search keywords from random string", () => {
    const result = tyniSearch.searchInSentence(
      "agostino, al bud, and, alameda",
    );
    console.log(result);
    expect(result.sort()).toEqual(["agostino", "al bud", "alameda"].sort());
  });

  it("performance check - delete, build failure link, and search the deleted keyword", () => {
    tyniSearch.delete(["나랑드", "사이다"]);

    const result = tyniSearch.searchInSentence("나랑드 사이다 특가");
    expect(result).not.toContain("나랑드");
    expect(result).not.toContain("사이다");
  });
});
