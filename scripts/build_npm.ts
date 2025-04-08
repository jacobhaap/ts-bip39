import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: [
    "./src/mod.ts",
    { name: "./lite", path: "./src/lite/mod.ts" },
    { name: "./utils", path: "./src/utils/mod.ts" },
    { name: "./wordlist/english", path: "./src/wordlists/english.ts" },
    { name: "./wordlist/chinese_simplified", path: "./src/wordlists/chinese_simplified.ts" },
    { name: "./wordlist/chinese_traditional", path: "./src/wordlists/chinese_traditional.ts" },
    { name: "./wordlist/czech", path: "./src/wordlists/czech.ts" },
    { name: "./wordlist/french", path: "./src/wordlists/french.ts" },
    { name: "./wordlist/italian", path: "./src/wordlists/italian.ts" },
    { name: "./wordlist/japanese", path: "./src/wordlists/japanese.ts" },
    { name: "./wordlist/korean", path: "./src/wordlists/korean.ts" },
    { name: "./wordlist/portuguese", path: "./src/wordlists/portuguese.ts" },
    { name: "./wordlist/spanish", path: "./src/wordlists/spanish.ts" },
  ],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    // package.json properties
    name: Deno.args[0],
    version: Deno.args[1],
    description: "An extended implementation of BIP39.",
    license: "MIT",
    homepage: "https://github.com/jacobhaap/bip39/#readme",
    repository: {
      type: "git",
      url: "git+https://gitlab.com/jacobhaap/bip39.git",
    },
    bugs: {
      url: "https://github.com/jacobhaap/bip39/issues",
    },
    author: {
        name: "Jacob V. B. Haap",
        url: "https://iacobus.xyz/"
    },
    keywords: [
        "bip39",
        "wordlist",
        "mnemonic",
        "entropy"
    ]
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
