import { TrieNode } from "./trie";
import { trampoline } from "./trampoline";

export class TyniSearch {
  rootNode: TrieNode;
  constructor(rootNode?: TrieNode) {
    this.rootNode = rootNode ? rootNode : new TrieNode();
  }
  public toJSON(): Record<string, any> {
    return this.rootNode.toJSON();
  }

  public toJSONIteratively(): Record<string, any> {
    return this.rootNode.toJSONIteratively();
  }

  public toJSONRecursively(): Record<string, any> {
    return this.rootNode.toJSONWithRecursively();
  }

  public static fromJSON(jsonData: Record<string, any>): TyniSearch {
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

    buildTrieFromJSON(jsonData, trie.rootNode);
    return trie;
  }

  public static fromJSONRecursively(jsonData: Record<string, any>) {
    const rootNode = new TrieNode();

    const buildTrieFromJSONTrampoline = (
      trieNodeData: Record<string, any>,
      trieNode: TrieNode,
    ) => {
      return function () {
        trieNode.isLastWord = trieNodeData.isLastWord;
        trieNode.output = new Set(trieNodeData.output);
        trieNode.fail = trieNodeData.fail;

        for (const charCode in trieNodeData.children) {
          const childData = trieNodeData.children[charCode];
          const childTrieNode = new TrieNode();
          trieNode.children.set(charCode, childTrieNode);

          buildTrieFromJSONTrampoline(childData, childTrieNode)();
        }
      };
    };

    const trampolinedBuildTrieFromJSON = trampoline(
      buildTrieFromJSONTrampoline(jsonData, rootNode),
    );
    trampolinedBuildTrieFromJSON();

    return new TyniSearch(rootNode);
  }

  public static fromJSONIteratively(jsonData: Record<string, any>): TyniSearch {
    const trie = new TyniSearch();
    trie.rootNode.children = new Map<string, TrieNode>();

    const stack: { node: TrieNode; trieNodeData: Record<string, any> }[] = [
      { node: trie.rootNode, trieNodeData: jsonData },
    ];

    while (stack.length > 0) {
      const { node, trieNodeData } = stack.pop()!;
      node.isLastWord = trieNodeData.isLastWord;
      node.output = new Set(trieNodeData.output);
      node.fail = trieNodeData.fail;

      for (const charCode in trieNodeData.children) {
        const childData = trieNodeData.children[charCode];
        const childTrieNode = new TrieNode();
        node.children.set(charCode, childTrieNode);

        stack.push({ node: childTrieNode, trieNodeData: childData });
      }
    }

    return trie;
  }

  private charToIndex(character: string): string {
    return String(character.charCodeAt(0));
  }

  public insert(keyword: string): void {
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

  public delete(keyword: string) {
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

  public buildFailureLinks(): void {
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
}
