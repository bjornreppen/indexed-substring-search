import { SuffixTree } from "../src/";

test("Banana", () => {
  const tree = new SuffixTree.Builder();
  tree.addSentence("banana", 4);
  expect(tree).toMatchSnapshot();
});

test("Banana search nana", () => {
  const tree = new SuffixTree.Builder();
  tree.addSentence("banana", "BANANA");
  const index = tree.buildIndex();
  expect(index.queryWord("nana")).toMatchSnapshot();
});

test("Banana ban search 'nana ban'", () => {
  const tree = new SuffixTree.Builder();
  tree.addSentence("banana", "BANANA");
  tree.addSentence("ban", "BANANA");
  const index = tree.buildIndex();
  expect(index.queryPhrase("nana ban")).toMatchSnapshot();
});
