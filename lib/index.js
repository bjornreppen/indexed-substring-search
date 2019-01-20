"use strict";
const fs = require("fs");
const metabase = JSON.parse(fs.readFileSync("metabase.json"));
const index = {};
Object.keys(metabase).forEach(kode => {
    if (kode !== "meta") {
        const node = metabase[kode];
        if (kode.indexOf("LA-MP-KL") === 0)
            indexNode(node);
    }
});
indexSentence("terreng", { "CM-TERRENG": 100 });
indexSentence("sorter kode", { "CM-SORT-KODE": 100 });
indexSentence("sorter navn", { "CM-SORT-NAVN": 100 });
indexSentence("github hjelp bidra source", { "CM-GITHUB": 100 });
fs.writeFileSync("index.json", JSON.stringify(index));
function indexNode(node) {
    const scaler = 1.0 / (1 + node.overordnet.length);
    indexWord(node.kode, { [node.kode]: 1.0 * scaler });
    indexSentence(node.tittel.nb, { [node.kode]: 0.5 * scaler });
    /*  indexSentence(node.ingress, { [node.kode]: 0.33 * scaler });
    if (node.graf) {
      node.graf.forEach(graf => {
        indexSentence(graf.type, { [node.kode]: 0.25 * scaler });
        graf.noder.forEach(relasjon => {
          indexWord(relasjon.kode, { [node.kode]: 1.0 * scaler });
          indexSentence(relasjon.tittel.nb, { [node.kode]: 0.25 * scaler });
        });
      });
    }*/
}
function indexSentence(sentence, result) {
    if (!sentence)
        return;
    const words = sentence.split(/[.,\/\: -]/);
    for (const word of words)
        indexWord(word, result);
}
function indexWord(word, match) {
    if (word.length < 2)
        return;
    console.log(match, word);
    for (let i = 0; i < word.length; i++) {
        indexSubString(word.substring(i).toLowerCase(), match);
    }
}
function indexSubString(sub, match) {
    let current = index;
    for (const char of sub) {
        if (!current[char])
            current[char] = {};
        current = current[char];
    }
    current["$"] = match;
}
//console.log(JSON.stringify(index));
