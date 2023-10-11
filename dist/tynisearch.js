"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _TyniSearch_rootNode_accessor_storage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TyniSearch = void 0;
const trie_1 = require("./trie");
class TyniSearch {
    get rootNode() { return __classPrivateFieldGet(this, _TyniSearch_rootNode_accessor_storage, "f"); }
    set rootNode(value) { __classPrivateFieldSet(this, _TyniSearch_rootNode_accessor_storage, value, "f"); }
    constructor(rootNode) {
        _TyniSearch_rootNode_accessor_storage.set(this, void 0);
        this.rootNode = rootNode ? rootNode : new trie_1.TrieNode();
    }
    /**
     * Serialize the trie to JSON.
     * @returns {string} Serialized trie.
     */
    serialize() {
        try {
            return JSON.stringify(this.rootNode.toJSON());
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Deserialize the trie from JSON. If `failureLinkBuilding` is false, the trie will not have failure links. The default value is true.
     * @param {string} serializedData Trie data to serialize.
     * @param {boolean} [failureLinkBuilding=true] failureLinkBuilding
     * @returns {TyniSearch} Deserialized trie from `JSON.stringify` processed trie.
     */
    static deserialize(serializedData, failureLinkBuilding = true) {
        try {
            const trie = new TyniSearch();
            trie.rootNode.children = new Map();
            const buildTrieFromJSON = (trieNodeData, trieNode) => {
                trieNode.isLastWord = trieNodeData.isLastWord;
                trieNode.output = new Set(trieNodeData.output);
                trieNode.fail = trieNodeData.fail || null;
                for (const charCode in trieNodeData.children) {
                    const childData = trieNodeData.children[charCode];
                    const childTrieNode = new trie_1.TrieNode();
                    trieNode.children.set(charCode, childTrieNode);
                    buildTrieFromJSON(childData, childTrieNode);
                }
            };
            const jsonData = JSON.parse(serializedData);
            buildTrieFromJSON(jsonData, trie.rootNode);
            failureLinkBuilding ? trie.buildFailureLinks() : null;
            return trie;
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Convert a character to its char code.
     * @param {string} character
     * @private
     */
    charToIndex(character) {
        try {
            return String(character.charCodeAt(0));
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Build failure links for aho-corasick algorithm.
     */
    buildFailureLinks() {
        try {
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
        catch (e) {
            throw e;
        }
    }
    insertKeyword(keyword) {
        try {
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
        catch (e) {
            throw e;
        }
    }
    /**
     * Insert keywords into the trie.
     * And after deletion, rebuild failure links.
     * @param {string[]} keywords Keywords to insert.
     * @param {boolean} [failureLinkBuilding=true] failureLinkBuilding If true, rebuild failure links after insertion. The default value is true.
     */
    insert(keywords, failureLinkBuilding = true) {
        try {
            keywords.forEach((keyword) => this.insertKeyword(keyword));
            failureLinkBuilding ? this.buildFailureLinks() : null;
        }
        catch (e) {
            throw e;
        }
    }
    deleteKeyword(keyword) {
        try {
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
        catch (e) {
            throw e;
        }
    }
    /**
     * Delete keywords from the trie.
     * And after deletion, rebuild failure links.
     * @param {string[]} keywords Keywords to delete.
     * @param {boolean} [failureLinkBuilding=true] failureLinkBuilding If true, rebuild failure links after deletion. The default value is true.
     */
    delete(keywords, failureLinkBuilding = true) {
        try {
            keywords.forEach((keyword) => this.deleteKeyword(keyword));
            failureLinkBuilding ? this.buildFailureLinks() : null;
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Search for a keyword in the trie.
     * @param keyword
     * @returns {boolean} True if the keyword is found, false otherwise.
     */
    searchKeyword(keyword) {
        try {
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
        catch (e) {
            throw e;
        }
    }
    /**
     * Search for keywords in a sentence.
     * @param {string} sentence
     * @returns {string[]} Keywords found in the sentence.
     */
    searchInSentence(sentence) {
        try {
            const keywordsFound = new Set();
            let currentRoot = this.rootNode;
            for (const character of sentence) {
                const indexOfCharacter = this.charToIndex(character);
                while (!currentRoot.children.has(indexOfCharacter) &&
                    currentRoot !== this.rootNode) {
                    currentRoot = currentRoot.fail;
                }
                currentRoot =
                    currentRoot.children.get(indexOfCharacter) || this.rootNode;
                currentRoot.output.forEach((value) => keywordsFound.add(value));
            }
            return [...keywordsFound];
        }
        catch (e) {
            throw e;
        }
    }
    countNodesRecursive(node) {
        try {
            let count = 1;
            for (const child of node.children.values()) {
                count += this.countNodesRecursive(child);
            }
            return count;
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Get the number of nodes in the trie.
     * @returns {number} Number of nodes in the trie.
     */
    getNumberOfNodes() {
        try {
            return this.countNodesRecursive(this.rootNode);
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * Get all keywords in the trie.
     * @returns {string[]} Keywords in the trie.
     */
    getAllKeywords() {
        try {
            const stack = [this.rootNode];
            const keywords = [];
            while (stack.length > 0) {
                const node = stack.pop();
                if (node.isLastWord) {
                    keywords.push([...node.output][0]);
                }
                node.children.forEach((child) => stack.push(child));
            }
            return keywords;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.TyniSearch = TyniSearch;
_TyniSearch_rootNode_accessor_storage = new WeakMap();
