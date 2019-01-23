import { config } from "./config";
import { INode } from "./node";

export class SuffixIndex {
  private index: INode;

  constructor(index: INode) {
    this.index = index;
  }

  /** Look up one or more substrings, return the set matching both */
  public queryPhrase(q: string) {
    const words = config.tokenize(q);
    const wordMatches: any = [];
    words.forEach(word => {
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
      result.push({ key: key, score: score });
    });
    result.sort((a: any, b: any) => b.score - a.score);
    return result;
  }

  /** Look up a single word in the index */
  public queryWord(q: string) {
    q = q.toLowerCase();
    let current = this.index;
    for (const char of q) {
      if (!current[char]) {
        return {};
      }
      current = current[char];
    }
    const results = this.reduce(current, {});
    return results;
    //      return results.sort((a: any, b: any) => {
    //      return (Object as any).values(b)[0] - (Object as any).values(a)[0];
    //  });
  }

  private reduce(r: INode, s: any, parentKey: string = "") {
    Object.keys(r).forEach(key => {
      if (parentKey === "$") {
        s[key] = Math.max(s[key] || 0, r[key]);
      } else {
        this.reduce(r[key], s, key);
      }
    });
    return s;
  }
}
