import { TrieNode } from "./trie";
export declare class TyniSearch {
    rootNode: TrieNode;
    constructor(rootNode?: TrieNode);
    serialize(): string;
    static deserialize(serializedData: string): TyniSearch;
    private charToIndex;
    private buildFailureLinks;
    private insertKeyword;
    insert(keywords: string[]): void;
    private deleteKeyword;
    delete(keywords: string[]): void;
    searchKeyword(keyword: string): boolean;
    searchInSentence(sentence: string): string[];
    private countNodesRecursive;
    getNumberOfNodes(): number;
    getAllKeywords(): string[];
}
