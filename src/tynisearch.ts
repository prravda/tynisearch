import { TrieNode } from "./trie";

export class TyniSearch {
  rootNode: TrieNode;
  constructor(rootNode?: TrieNode) {
    this.rootNode = rootNode ? rootNode : new TrieNode();
  }
  public serialize(): string {
    return JSON.stringify(this.rootNode.toJSON());
  }

  public static deserialize(serializedData: string): TyniSearch {
    const trie = new TyniSearch();
    trie.rootNode.children = new Map<string, TrieNode>();

    const buildTrieFromJSON = (
      trieNodeData: Record<string, any>,
      trieNode: TrieNode,
    ) => {
      trieNode.isLastWord = trieNodeData.isLastWord;
      trieNode.output = new Set(trieNodeData.output);
      trieNode.fail = trieNodeData.fail;

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
  }

  private charToIndex(character: string): string {
    return String(character.charCodeAt(0));
  }

  private buildFailureLinks(): void {
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
  }

  private insertKeyword(keyword: string): void {
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
  }

  public insert(keywords: string[]): void {
    keywords.forEach((keyword) => this.insertKeyword(keyword));
    this.buildFailureLinks();
  }

  private deleteKeyword(keyword: string): void {
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
  }

  public delete(keywords: string[]) {
    keywords.forEach((keyword) => this.deleteKeyword(keyword));
    this.buildFailureLinks();
  }

  public searchKeyword(keyword: string): boolean {
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

  public searchInSentence(sentence: string): string[] {
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

      currentRoot = currentRoot.children.get(indexOfCharacter) || this.rootNode;
      currentRoot.output.forEach((value) => keywordsFound.add(value));
    }

    return [...keywordsFound];
  }

  private countNodesRecursive(node: TrieNode): number {
    let count = 1;

    for (const child of node.children.values()) {
      count += this.countNodesRecursive(child);
    }

    return count;
  }

  public getNumberOfNodes(): number {
    return this.countNodesRecursive(this.rootNode);
  }

  public getAllKeywords(): string[] {
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
  }
}
