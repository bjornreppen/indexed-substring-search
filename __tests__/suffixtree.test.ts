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

test("i myra eller skogen", () => {
  const actual = query(
    [
      { phrase: "in the woods", key: "myr", score: 1 },
      { phrase: "in the forest", key: "skog", score: 0.9 }
    ],
    "the in"
  );
  expect(actual).toMatchSnapshot();
});

const query = (indexInput: any[], query: string) => {
  const tree = new SuffixTree();
  indexInput.forEach(e =>
    tree.addSentence(e.phrase, { key: e.key, score: e.score })
  );
  const index = tree.buildIndex();
  return index.queryPhrase(query);
};
