import { trampoline, TrampolineFunction } from "./trampoline";

export class TrieNode {
  children: Map<string, TrieNode>;
  isLastWord: boolean;
  fail: TrieNode | null;
  output: Set<string>;
  constructor() {
    this.children = new Map<string, TrieNode>();
    this.isLastWord = false;
    this.fail = null;
    this.output = new Set<string>();
  }

  private toJSONTrampoline(): TrampolineFunction<Record<string, any>> {
    const node = this;

    return function () {
      const jsonTrieNode: Record<string, any> = {
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

  public toJSONWithRecursively(): Record<string, any> {
    const trampolinedRecursiveToJSON = trampoline(this.toJSONTrampoline());
    return trampolinedRecursiveToJSON();
  }

  public toJSON(): Record<string, any> {
    const jsonTrieNode: Record<string, any> = {
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

  public toJSONIteratively(): Record<string, any> {
    const jsonTrieNode: Record<string, any> = {
      isLastWord: this.isLastWord,
      children: {},
      fail: null,
      output: [...this.output],
    };

    const stack: {
      node: TrieNode;
      jsonTrieNode: Record<string, any>;
    }[] = [{ node: this, jsonTrieNode }];

    while (stack.length > 0) {
      const { node, jsonTrieNode } = stack.pop()!;
      for (const [charCode, child] of node.children) {
        const childJSONTrieNode: Record<string, any> = {
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
