import { TrieNode } from "./trie";
export declare class TyniSearch {
    rootNode: TrieNode;
    constructor(rootNode?: TrieNode);
    /**
     * Serialize the trie to JSON.
     * @returns {string} Serialized trie.
     */
    serialize(): string;
    /**
     * Deserialize the trie from JSON.
     * @param {string} serializedData
     * @returns {TyniSearch} Deserialized trie.
     */
    static deserialize(serializedData: string): TyniSearch;
    /**
     * Convert a character to its char code.
     * @param {string} character
     * @private
     */
    private charToIndex;
    /**
     * Build failure links for aho-corasick algorithm.
     * @private
     */
    private buildFailureLinks;
    private insertKeyword;
    /**
     * Insert keywords into the trie.
     * And after deletion, rebuild failure links.
     * @param {string[]} keywords
     */
    insert(keywords: string[]): void;
    private deleteKeyword;
    /**
     * Delete keywords from the trie.
     * And after deletion, rebuild failure links.
     * @param {string[]} keywords
     */
    delete(keywords: string[]): void;
    /**
     * Search for a keyword in the trie.
     * @param keyword
     * @returns {boolean} True if the keyword is found, false otherwise.
     */
    searchKeyword(keyword: string): boolean;
    /**
     * Search for keywords in a sentence.
     * @param {string} sentence
     * @returns {string[]} Keywords found in the sentence.
     */
    searchInSentence(sentence: string): string[];
    private countNodesRecursive;
    /**
     * Get the number of nodes in the trie.
     * @returns {number} Number of nodes in the trie.
     */
    getNumberOfNodes(): number;
    /**
     * Get all keywords in the trie.
     * @returns {string[]} Keywords in the trie.
     */
    getAllKeywords(): string[];
}
