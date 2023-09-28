"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrieNode = void 0;
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isLastWord = false;
        this.fail = null;
        this.output = new Set();
    }
    /**
     * Add a new word to the trie
     */
    toJSON() {
        try {
            const jsonTrieNode = {
                isLastWord: this.isLastWord,
                children: {},
                fail: null,
                output: [...this.output],
            };
            for (const [charCode, child] of this.children) {
                jsonTrieNode.children[charCode] = child.toJSON();
            }
            return jsonTrieNode;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.TrieNode = TrieNode;
