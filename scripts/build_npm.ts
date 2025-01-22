import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    // package.json properties
    name: "@iacobus/bip39",
    version: Deno.args[0],
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
