export declare class TrieNode {
    children: Map<string, TrieNode>;
    isLastWord: boolean;
    fail: TrieNode | null;
    output: Set<string>;
    constructor();
    private toJSONTrampoline;
    toJSONWithRecursively(): Record<string, any>;
    toJSON(): Record<string, any>;
    toJSONIteratively(): Record<string, any>;
}
