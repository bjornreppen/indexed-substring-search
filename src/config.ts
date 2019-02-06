export const config = {
  tokenize: (phrase: string) => {
    if (!phrase) return [];
    if (phrase.indexOf(" ") < 0) {
      return [phrase];
    }
    return phrase.split(/[.,\/\:\(\) -]/);
  }
};
