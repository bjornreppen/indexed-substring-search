import { config } from "../src/config";

test("Tokenize erosjonsmotstand", () => {
  const actual = config.tokenize("Erosjonsmotstand (i sorterte sedimenter)");
  expect(actual).toMatchSnapshot();
});
