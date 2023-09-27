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
}
