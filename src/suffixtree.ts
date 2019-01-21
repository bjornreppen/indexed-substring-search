import * as fs from "fs";
import { config } from "./config";
import { INode, IResult } from "./node";
import { SuffixIndex } from "./suffixindex";

/** A tiny substring search module
 * https://en.wikipedia.org/wiki/Suffix_tree
 * Can be optimized massively especially for space, but trading size for developer hours.
 */
export class SuffixTree {
  private index: INode;

  constructor(json = {}) {
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
    let current = this.index;
    for (const char of sub) {
      if (!current[char]) {
        current[char] = {};
      }
      current = current[char];
    }
    if (!current.$) {
      current.$ = {};
    }
    current.$[searchResult.key] = searchResult.score;
  }
}
