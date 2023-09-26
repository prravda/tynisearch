"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrieNode = void 0;
const trampoline_1 = require("./trampoline");
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isLastWord = false;
        this.fail = null;
        this.output = new Set();
    }
    toJSONTrampoline() {
        const node = this;
        return function () {
            const jsonTrieNode = {
                isLastWord: node.isLastWord,
                children: {},
                fail: null,
                output: [...node.output],
            };
            for (const [charCode, child] of node.children) {
                jsonTrieNode.children[charCode] = child.toJSONTrampoline()();
            }
            return jsonTrieNode;
        };
    }
    toJSONWithRecursively() {
        const trampolinedRecursiveToJSON = (0, trampoline_1.trampoline)(this.toJSONTrampoline());
        return trampolinedRecursiveToJSON();
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
    toJSONIteratively() {
        const jsonTrieNode = {
            isLastWord: this.isLastWord,
            children: {},
            fail: null,
            output: [...this.output],
        };
        const stack = [{ node: this, jsonTrieNode }];
        while (stack.length > 0) {
            const { node, jsonTrieNode } = stack.pop();
            for (const [charCode, child] of node.children) {
                const childJSONTrieNode = {
                    isLastWord: child.isLastWord,
                    children: {},
                    fail: child.fail,
                    output: [...child.output],
                };
                jsonTrieNode.children[charCode] = childJSONTrieNode;
                stack.push({ node: child, jsonTrieNode: childJSONTrieNode });
            }
        }
        return jsonTrieNode;
    }
}
exports.TrieNode = TrieNode;
