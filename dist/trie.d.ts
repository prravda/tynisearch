export declare class TrieNode {
    children: Map<string, TrieNode>;
    isLastWord: boolean;
    fail: TrieNode | null;
    output: Set<string>;
    constructor();
    toJSON(): Record<string, any>;
}
