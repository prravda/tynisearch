"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TyniSearch = void 0;
const trie_1 = require("./trie");
const trampoline_1 = require("./trampoline");
class TyniSearch {
    constructor(rootNode) {
        this.rootNode = rootNode ? rootNode : new trie_1.TrieNode();
    }
    toJSON() {
        return this.rootNode.toJSON();
    }
    toJSONIteratively() {
        return this.rootNode.toJSONIteratively();
    }
    toJSONRecursively() {
        return this.rootNode.toJSONWithRecursively();
    }
    static fromJSON(jsonData) {
        const trie = new TyniSearch();
        trie.rootNode.children = new Map();
        const buildTrieFromJSON = (trieNodeData, trieNode) => {
            trieNode.isLastWord = trieNodeData.isLastWord;
            trieNode.output = new Set(trieNodeData.output);
            trieNode.fail = trieNodeData.fail;
            for (const charCode in trieNodeData.children) {
                const childData = trieNodeData.children[charCode];
                const childTrieNode = new trie_1.TrieNode();
                trieNode.children.set(charCode, childTrieNode);
                buildTrieFromJSON(childData, childTrieNode);
            }
        };
        buildTrieFromJSON(jsonData, trie.rootNode);
        return trie;
    }
    static fromJSONRecursively(jsonData) {
        const rootNode = new trie_1.TrieNode();
        const buildTrieFromJSONTrampoline = (trieNodeData, trieNode) => {
            return function () {
                trieNode.isLastWord = trieNodeData.isLastWord;
                trieNode.output = new Set(trieNodeData.output);
                trieNode.fail = trieNodeData.fail;
                for (const charCode in trieNodeData.children) {
                    const childData = trieNodeData.children[charCode];
                    const childTrieNode = new trie_1.TrieNode();
                    trieNode.children.set(charCode, childTrieNode);
                    buildTrieFromJSONTrampoline(childData, childTrieNode)();
                }
            };
        };
        const trampolinedBuildTrieFromJSON = (0, trampoline_1.trampoline)(buildTrieFromJSONTrampoline(jsonData, rootNode));
        trampolinedBuildTrieFromJSON();
        return new TyniSearch(rootNode);
    }
    static fromJSONIteratively(jsonData) {
        const trie = new TyniSearch();
        trie.rootNode.children = new Map();
        const stack = [
            { node: trie.rootNode, trieNodeData: jsonData },
        ];
        while (stack.length > 0) {
            const { node, trieNodeData } = stack.pop();
            node.isLastWord = trieNodeData.isLastWord;
            node.output = new Set(trieNodeData.output);
            node.fail = trieNodeData.fail;
            for (const charCode in trieNodeData.children) {
                const childData = trieNodeData.children[charCode];
                const childTrieNode = new trie_1.TrieNode();
                node.children.set(charCode, childTrieNode);
                stack.push({ node: childTrieNode, trieNodeData: childData });
            }
        }
        return trie;
    }
    charToIndex(character) {
        return String(character.charCodeAt(0));
    }
    insert(keyword) {
        let currentRoot = this.rootNode;
        for (const character of keyword) {
            const indexOfCharacter = this.charToIndex(character);
            if (!currentRoot.children.has(indexOfCharacter)) {
                currentRoot.children.set(indexOfCharacter, new trie_1.TrieNode());
            }
            currentRoot = currentRoot.children.get(indexOfCharacter);
        }
        currentRoot.isLastWord = true;
        currentRoot.output.add(keyword);
    }
    delete(keyword) {
        let currentRoot = this.rootNode;
        const parentStack = [];
        for (const character of keyword) {
            const indexOfCharacter = this.charToIndex(character);
            if (!currentRoot.children.has(indexOfCharacter)) {
                return;
            }
            parentStack.push(currentRoot);
            currentRoot = currentRoot.children.get(indexOfCharacter);
        }
        if (!currentRoot.isLastWord) {
            return;
        }
        if (currentRoot.children.size > 0) {
            currentRoot.output.delete(keyword);
            currentRoot.isLastWord = false;
            return;
        }
        currentRoot.isLastWord = false;
        currentRoot.output.delete(keyword);
        while (parentStack.length > 0) {
            const parentNodeOfNodeToDelete = parentStack.pop();
            const charCodeToRemove = this.charToIndex(keyword[parentStack.length]);
            if (parentNodeOfNodeToDelete.children.size === 1 &&
                !parentNodeOfNodeToDelete.children.get(charCodeToRemove).isLastWord) {
                parentNodeOfNodeToDelete.children.delete(charCodeToRemove);
            }
            else {
                break;
            }
        }
    }
    buildFailureLinks() {
        const queue = [];
        this.rootNode.fail = null;
        for (const child of this.rootNode.children.values()) {
            child.fail = this.rootNode;
            queue.push(child);
        }
        while (queue.length > 0) {
            const node = queue.shift();
            for (const [charCode, child] of node.children) {
                let failure = node.fail;
                while (failure !== null && !failure.children.has(charCode)) {
                    failure = failure.fail;
                }
                child.fail = (failure === null || failure === void 0 ? void 0 : failure.children.get(charCode)) || this.rootNode;
                child.output = new Set([...child.output, ...child.fail.output]);
                queue.push(child);
            }
        }
    }
    searchKeyword(keyword) {
        let currentNode = this.rootNode;
        for (const character of keyword) {
            const indexOfCharacter = this.charToIndex(character);
            const nextNode = currentNode.children.get(indexOfCharacter);
            if (!nextNode) {
                return false;
            }
            currentNode = nextNode;
        }
        return currentNode.isLastWord;
    }
    searchInSentence(sentence) {
        const keywordsFound = new Set();
        let currentRoot = this.rootNode;
        for (const character of sentence) {
            const indexOfCharacter = this.charToIndex(character);
            while (!currentRoot.children.has(indexOfCharacter) &&
                currentRoot !== this.rootNode) {
                currentRoot = currentRoot.fail;
            }
            currentRoot = currentRoot.children.get(indexOfCharacter) || this.rootNode;
            currentRoot.output.forEach((value) => keywordsFound.add(value));
        }
        return [...keywordsFound];
    }
}
exports.TyniSearch = TyniSearch;
