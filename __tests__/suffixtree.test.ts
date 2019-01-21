import { SuffixTree } from "../src/";

test("Banana", () => {
  const tree = new SuffixTree();
  tree.addSentence("banana", { key: "BANANA", score: 1 });
  expect(tree).toMatchSnapshot();
});

test("Banana search nana", () => {
  const tree = new SuffixTree();
  tree.addSentence("banana", { key: "BANANA", score: 1 });
  const index = tree.buildIndex();
  expect(index.queryWord("nana")).toMatchSnapshot();
});

test("Banana ban search 'nana ban'", () => {
  const tree = new SuffixTree();
  tree.addSentence("banana ban", { key: "BANANA", score: 1 });
  const index = tree.buildIndex();
  expect(index.queryPhrase("nana ban")).toMatchSnapshot();
});

test("Multiple hits sharing phrases", () => {
  const actual = query(
    [
      { phrase: "wood", key: "wood", score: 1 },
      { phrase: "branch", key: "wood", score: 1 }
    ],
    "wood"
  );
  expect(actual).toMatchSnapshot();
});

const query = (indexInput: any[], query: string) => {
  const tree = new SuffixTree();
  indexInput.forEach(sentence =>
    tree.addSentence("banana ban", { key: "BANANA", score: 1 })
  );
  const index = tree.buildIndex();
  return index.queryPhrase("nana ban");
};
