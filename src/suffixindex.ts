import { config } from "./config";
import { Index, INode, IResult, IResultEntry, ReverseMap } from "./node";

export class SuffixIndex {
  private index: Index;
  private reverseMap: ReverseMap;

  constructor(index: Index) {
    this.index = index;
    this.reverseMap = Object.keys(this.index.map).reduce<ReverseMap>(
      (acc, e) => {
        const value = this.index.map[e];
        acc[value] = e;
        return acc;
      },
      {}
    );
  }

  /** Look up one or more substrings, return the set matching both */
  public queryPhrase(q: string) {
    const words = config.tokenize(q);
    const wordMatches: any = [];
    words.forEach((word) => {
      wordMatches.push(this.queryWord(word));
    });
    // For our intersect, sort the shortest result set first
    wordMatches.sort((a: any, b: any) => a.length - b.length);
    const result: any = [];
    const [first, ...rest] = wordMatches;
    Object.keys(first).forEach((key: string) => {
      let score = first[key];
      for (const rx of rest) {
        if (!(key in rx)) {
          return;
        }
        score *= rx[key];
      }
      result.push({ key, score });
    });
    result.sort((a: any, b: any) => b.score - a.score);
    return result;
  }

  /** Look up a single word in the index */
  public queryWord(q: string) {
    q = q.toLowerCase();
    let current = this.index.root;
    for (const char of q) {
      if (!current[char]) {
        return {};
      }
      current = current[char];
    }
    return this.reduce(current, {});
  }

  private reduce(node: INode | IResult, hits: any, parentKey: string = "") {
    if (parentKey === "$") this.reduceHits(node as IResultEntry[], hits);
    else {
      Object.keys(node).forEach((key) => {
        this.reduce(node[key], hits, key);
      });
    }
    return hits;
  }

  private reduceHits(node: IResultEntry[], hits: any) {
    node.forEach(([score, key]) => {
      hits[this.reverseMap[key]] = Math.max(hits[key] || 0, score);
    });
  }
}
