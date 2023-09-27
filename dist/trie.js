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
    toJSON() {
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
}
exports.TrieNode = TrieNode;
