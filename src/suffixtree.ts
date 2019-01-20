const fs = require("fs");

interface STNode {
  [key: string]: any;
}

const tokenize = (sentence: String) => sentence.split(/[.,\/\: -]/);

/**  A tiny substring search module
   https://en.wikipedia.org/wiki/Suffix_tree
   Can be optimized massively especially for space, but trading size for developer hours.
   */
export module SuffixTree {
  export class Builder {
    private index: STNode;

    constructor() {
      this.index = {};
    }

    /** Load suffix tree from disk */
    load(filepath: String) {
      this.index = JSON.parse(fs.readFileSync(filepath));
      return new Index(this.index);
    }

    /** Save a build suffix tree to disk */
    save(filepath: String) {
      fs.writeFileSync(filepath, this.toJson());
    }

    /** Serialize the tree to string */
    toJson() {
      return JSON.stringify(this.index);
    }

    /** Builds the qeryable index. */
    buildIndex() {
      return new Index(this.index);
    }

    /** index a sequence of words */
    addSentence(sentence: String, searchResult: Object) {
      if (!sentence) return;
      const words = tokenize(sentence);
      for (const word of words) this.addWord(word, searchResult);
    }

    /** index a single word */
    private addWord(word: String, searchResult: Object) {
      if (word.length < 2) return;
      for (let i = 0; i < word.length; i++) {
        this.addSuffix(word.substring(i).toLowerCase(), searchResult);
      }
    }

    /** index ending of a string */
    private addSuffix(sub: String, searchResult: Object) {
      let current = this.index;
      for (const char of sub) {
        if (!current[char]) current[char] = {};
        current = current[char];
      }
      current["$"] = searchResult;
    }
  }

  class Index {
    index: STNode;
    constructor(index: STNode) {
      this.index = index;
    }

    private reduce(r: STNode, s: any) {
      Object.keys(r).forEach(key => {
        if (key === "$") s[r[key]] = {};
        else this.reduce(r[key], s);
      });
      return s;
    }

    /** Look up one or more substrings, return the set matching both */
    queryPhrase(q: String) {
      const words = tokenize(q);
      let r: any = [];
      words.forEach(word => {
        r.push(this.queryWord(word));
      });
      // For our intersect, sort the shortest result set first
      r.sort((a: any, b: any) => a.length - b.length);
      let res: any = [];
      const [first, ...rest] = r;
      Object.keys(first).forEach((key: string) => {
        let score = first.score;
        for (let i = 0; i < rest.length; i++) {
          if (!(key in rest[i])) return;
          score *= rest[i].score;
        }
        res.push({ [key]: score });
      });
      return res;
    }

    /** Look up a single word in the index */
    queryWord(q: String) {
      q = q.toLowerCase();
      let current = this.index;
      for (const char of q) {
        if (!current[char]) return {};
        current = current[char];
      }
      const results = this.reduce(current, {});
      return results;
      //      return results.sort((a: any, b: any) => {
      //      return (Object as any).values(b)[0] - (Object as any).values(a)[0];
      //  });
    }
  }
}
