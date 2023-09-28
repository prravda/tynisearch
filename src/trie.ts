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

  /**
   * Add a new word to the trie
   */
  public toJSON(): Record<string, any> {
    try {
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
    } catch (e) {
      throw e;
    }
  }
}
