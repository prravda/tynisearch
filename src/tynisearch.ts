import { TrieNode } from "./trie";

export class TyniSearch {
  rootNode: TrieNode;
  constructor(rootNode?: TrieNode) {
    this.rootNode = rootNode ? rootNode : new TrieNode();
  }

  /**
   * Serialize the trie to JSON.
   * @returns {string} Serialized trie.
   */
  public serialize(): string {
    try {
      return JSON.stringify(this.rootNode.toJSON());
    } catch (e) {
      throw e;
    }
  }

  /**
   * Deserialize the trie from JSON.
   * @param {string} serializedData
   * @returns {TyniSearch} Deserialized trie.
   */
  public static deserialize(serializedData: string): TyniSearch {
    try {
      const trie = new TyniSearch();
      trie.rootNode.children = new Map<string, TrieNode>();

      const buildTrieFromJSON = (
        trieNodeData: Record<string, any>,
        trieNode: TrieNode,
      ) => {
        trieNode.isLastWord = trieNodeData.isLastWord;
        trieNode.output = new Set(trieNodeData.output);
        trieNode.fail = trieNodeData.fail || null;

        for (const charCode in trieNodeData.children) {
          const childData = trieNodeData.children[charCode];
          const childTrieNode = new TrieNode();
          trieNode.children.set(charCode, childTrieNode);

          buildTrieFromJSON(childData, childTrieNode);
        }
      };

      const jsonData = JSON.parse(serializedData);
      buildTrieFromJSON(jsonData, trie.rootNode);

      trie.buildFailureLinks();

      return trie;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Convert a character to its char code.
   * @param {string} character
   * @private
   */
  private charToIndex(character: string): string {
    try {
      return String(character.charCodeAt(0));
    } catch (e) {
      throw e;
    }
  }

  /**
   * Build failure links for aho-corasick algorithm.
   * @private
   */
  private buildFailureLinks(): void {
    try {
      const queue: TrieNode[] = [];
      this.rootNode.fail = null;

      for (const child of this.rootNode.children.values()) {
        child.fail = this.rootNode;
        queue.push(child);
      }

      while (queue.length > 0) {
        const node = queue.shift()!;

        for (const [charCode, child] of node.children) {
          let failure = node.fail;

          while (failure !== null && !failure.children.has(charCode)) {
            failure = failure.fail!;
          }

          child.fail = failure?.children.get(charCode) || this.rootNode;
          child.output = new Set([...child.output, ...child.fail.output]);
          queue.push(child);
        }
      }
    } catch (e) {
      throw e;
    }
  }

  private insertKeyword(keyword: string): void {
    try {
      let currentRoot = this.rootNode;
      for (const character of keyword) {
        const indexOfCharacter = this.charToIndex(character);

        if (!currentRoot.children.has(indexOfCharacter)) {
          currentRoot.children.set(indexOfCharacter, new TrieNode());
        }
        currentRoot = currentRoot.children.get(indexOfCharacter)!;
      }
      currentRoot.isLastWord = true;
      currentRoot.output.add(keyword);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Insert keywords into the trie.
   * And after deletion, rebuild failure links.
   * @param {string[]} keywords
   */
  public insert(keywords: string[]): void {
    try {
      keywords.forEach((keyword) => this.insertKeyword(keyword));
      this.buildFailureLinks();
    } catch (e) {
      throw e;
    }
  }

  private deleteKeyword(keyword: string): void {
    try {
      let currentRoot = this.rootNode;
      const parentStack: TrieNode[] = [];

      for (const character of keyword) {
        const indexOfCharacter = this.charToIndex(character);

        if (!currentRoot.children.has(indexOfCharacter)) {
          return;
        }

        parentStack.push(currentRoot);
        currentRoot = currentRoot.children.get(indexOfCharacter)!;
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
        const parentNodeOfNodeToDelete = parentStack.pop()!;
        const charCodeToRemove = this.charToIndex(keyword[parentStack.length]);

        if (
          parentNodeOfNodeToDelete.children.size === 1 &&
          !parentNodeOfNodeToDelete.children.get(charCodeToRemove)!.isLastWord
        ) {
          parentNodeOfNodeToDelete.children.delete(charCodeToRemove);
        } else {
          break;
        }
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Delete keywords from the trie.
   * And after deletion, rebuild failure links.
   * @param {string[]} keywords
   */
  public delete(keywords: string[]) {
    try {
      keywords.forEach((keyword) => this.deleteKeyword(keyword));
      this.buildFailureLinks();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Search for a keyword in the trie.
   * @param keyword
   * @returns {boolean} True if the keyword is found, false otherwise.
   */
  public searchKeyword(keyword: string): boolean {
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
    } catch (e) {
      throw e;
    }
  }

  /**
   * Search for keywords in a sentence.
   * @param {string} sentence
   * @returns {string[]} Keywords found in the sentence.
   */
  public searchInSentence(sentence: string): string[] {
    try {
      const keywordsFound: Set<string> = new Set<string>();
      let currentRoot = this.rootNode;

      for (const character of sentence) {
        const indexOfCharacter = this.charToIndex(character);

        while (
          !currentRoot.children.has(indexOfCharacter) &&
          currentRoot !== this.rootNode
        ) {
          currentRoot = currentRoot.fail!;
        }

        currentRoot =
          currentRoot.children.get(indexOfCharacter) || this.rootNode;
        currentRoot.output.forEach((value) => keywordsFound.add(value));
      }

      return [...keywordsFound];
    } catch (e) {
      throw e;
    }
  }

  private countNodesRecursive(node: TrieNode): number {
    try {
      let count = 1;

      for (const child of node.children.values()) {
        count += this.countNodesRecursive(child);
      }

      return count;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Get the number of nodes in the trie.
   * @returns {number} Number of nodes in the trie.
   */
  public getNumberOfNodes(): number {
    try {
      return this.countNodesRecursive(this.rootNode);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Get all keywords in the trie.
   * @returns {string[]} Keywords in the trie.
   */
  public getAllKeywords(): string[] {
    try {
      const stack: TrieNode[] = [this.rootNode];
      const keywords: string[] = [];

      while (stack.length > 0) {
        const node = stack.pop()!;
        if (node.isLastWord) {
          keywords.push([...node.output][0]);
        }
        node.children.forEach((child) => stack.push(child));
      }

      return keywords;
    } catch (e) {
      throw e;
    }
  }
}
