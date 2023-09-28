export declare class TrieNode {
    children: Map<string, TrieNode>;
    isLastWord: boolean;
    fail: TrieNode | null;
    output: Set<string>;
    constructor();
    /**
     * Add a new word to the trie
     */
    toJSON(): Record<string, any>;
}
