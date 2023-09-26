import { TrieNode } from "./trie";
export declare class TyniSearch {
    rootNode: TrieNode;
    constructor(rootNode?: TrieNode);
    toJSON(): Record<string, any>;
    toJSONIteratively(): Record<string, any>;
    toJSONRecursively(): Record<string, any>;
    static fromJSON(jsonData: Record<string, any>): TyniSearch;
    static fromJSONRecursively(jsonData: Record<string, any>): TyniSearch;
    static fromJSONIteratively(jsonData: Record<string, any>): TyniSearch;
    private charToIndex;
    insert(keyword: string): void;
    delete(keyword: string): void;
    buildFailureLinks(): void;
    searchKeyword(keyword: string): boolean;
    searchInSentence(sentence: string): string[];
}
