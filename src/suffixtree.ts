import { config } from "./config";
import { Index, INode } from "./node";
import { SuffixIndex } from "./suffixindex";

type IResult = {
  key: string;
  score: number;
};

/** A tiny substring search module
 * https://en.wikipedia.org/wiki/Suffix_tree
 * Can be optimized massively especially for space, but trading size for developer hours.
 */

export class SuffixTree {
  private index: Index;
  private keywatermark = 1;

  constructor(json: Index = { root: {}, map: {} }) {
    this.index = json;
  }

  /** Serialize the tree to string */
  public toJson() {
    return JSON.stringify(this.index);
  }

  /** Builds the qeryable index. */
  public buildIndex() {
    return new SuffixIndex(this.index);
  }

  /** Purge and limit number of hits for a given suffix. */
  public purge(maxHits = 10) {
    this.purgeInner(this.index.root, maxHits);
  }

  private purgeInner(node: INode, maxHits: number) {
    Object.keys(node).forEach((key) => {
      if (key === "$") {
        const sortedByScore = node[key].sort(
          (a: number[], b: number[]) => a[0] > b[0]
        );
        node[key] = sortedByScore.slice(0, maxHits);
      } else this.purgeInner(node[key], maxHits);
    });
  }

  /** index a sequence of words */
  public addSentence(sentence: string, searchResult: IResult) {
    if (!sentence) {
      return;
    }
    const words = config.tokenize(sentence);
    for (const word of words) {
      this.addWord(word, searchResult);
    }
  }

  /** index a single word */
  private addWord(word: string, searchResult: IResult) {
    if (word.length < 2) {
      return;
    }
    for (let i = 0; i < word.length; i++) {
      this.addSuffix(word.substring(i).toLowerCase(), searchResult);
    }
  }

  /** index ending of a string */
  private addSuffix(sub: string, searchResult: IResult) {
    let current = this.index.root;
    for (const char of sub) {
      if (!current[char]) {
        current[char] = {};
      }
      current = current[char];
    }
    if (!current.$) {
      current.$ = [];
    }
    let index = this.index.map[searchResult.key];
    if (!index) {
      this.index.map[searchResult.key] = this.keywatermark;
      index = this.keywatermark;
      this.keywatermark++;
    }
    current.$.push([searchResult.score, index]);
  }
}
