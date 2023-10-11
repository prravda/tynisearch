import { TrieNode } from "./trie";
export declare class TyniSearch {
    accessor rootNode: TrieNode;
    constructor(rootNode?: TrieNode);
    /**
     * Serialize the trie to JSON.
     * @returns {string} Serialized trie.
     */
    serialize(): string;
    /**
     * Deserialize the trie from JSON. If `failureLinkBuilding` is false, the trie will not have failure links. The default value is true.
     * @param {string} serializedData Trie data to serialize.
     * @param {boolean} [failureLinkBuilding=true] failureLinkBuilding
     * @returns {TyniSearch} Deserialized trie from `JSON.stringify` processed trie.
     */
    static deserialize(serializedData: string, failureLinkBuilding?: boolean): TyniSearch;
    /**
     * Convert a character to its char code.
     * @param {string} character
     * @private
     */
    private charToIndex;
    /**
     * Build failure links for aho-corasick algorithm.
     */
    buildFailureLinks(): void;
    private insertKeyword;
    /**
     * Insert keywords into the trie.
     * And after deletion, rebuild failure links.
     * @param {string[]} keywords Keywords to insert.
     * @param {boolean} [failureLinkBuilding=true] failureLinkBuilding If true, rebuild failure links after insertion. The default value is true.
     */
    insert(keywords: string[], failureLinkBuilding?: boolean): void;
    private deleteKeyword;
    /**
     * Delete keywords from the trie.
     * And after deletion, rebuild failure links.
     * @param {string[]} keywords Keywords to delete.
     * @param {boolean} [failureLinkBuilding=true] failureLinkBuilding If true, rebuild failure links after deletion. The default value is true.
     */
    delete(keywords: string[], failureLinkBuilding?: boolean): void;
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
