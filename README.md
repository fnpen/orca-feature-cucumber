<div align="center">

# 🥒 Cucumber (Gherkin) for Orca

**Syntax highlighting, a new-file template and format on save for Cucumber `.feature` files.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Orca](https://img.shields.io/badge/Orca-%E2%89%A51.4.248-blue.svg)](https://github.com/stablyai/orca)
![Plugin](https://img.shields.io/badge/plugin-trusted--worker-lightgrey.svg)

</div>

---

A port of [VSCucumberAutoComplete](https://github.com/alexkrechik/VSCucumberAutoComplete) to [Orca](https://github.com/stablyai/orca). It needs no build step and has no dependencies.

## ✨ Features

| | |
|---|---|
| 🎨 **Highlighting** | Keywords, tags, tables, doc strings, comments and `<placeholders>` in `.feature` and `.testcase` files |
| 🧹 **Format on save** | Indents each line by its keyword, aligns table columns, trims trailing spaces and pretty-prints JSON doc strings |
| 📄 **New feature file** | A ready-to-edit template in the tab bar **+** menu |
| 🔣 **Editing** | Comments with `#`, bracket and quote auto-closing, indentation-based folding |

### Format on save

Before:

```gherkin
Feature: Cart
Scenario: Add item
Given the cart:
|sku|price|
|apple|$5|
Then it works
```

After saving:

```gherkin
Feature: Cart
  Scenario: Add item
    Given the cart:
      | sku   | price |
      | apple | $5    |
    Then it works
```

Only explicit saves format the file; autosave never does. If the file is already formatted, the save goes through unchanged, and the file keeps its own line endings (LF or CRLF).

## 📦 Install

```sh
orca plugin install fnpen/orca-feature-cucumber
```

Orca prints what the plugin is granted and an approval command. Run that command to install:

```sh
orca plugin install fnpen/orca-feature-cucumber --approve <fingerprint>
```

You can also review and enable it in **Orca → Settings → Plugins**.

| Command | |
|---|---|
| `orca plugin list` | Check it is running |
| `orca plugin update fnpen.cucumber` | Update to the latest commit |
| `orca plugin logs fnpen.cucumber` | See why a file did not format |
| `orca plugin uninstall fnpen.cucumber` | Remove it |

## ⚙️ Settings

**Settings → Plugins → Cucumber (Gherkin)**

| Setting | Default | |
|---|---|---|
| **Format on save** | on | Format `.feature` / `.testcase` files on save. Highlighting stays on when this is off. |
| **Indent size** | `2` | Spaces per indent level; `0` indents with a tab. |
| **Keep doc strings as written** | on | Leave lines between `"""` or `'''` untouched. JSON doc strings are pretty-printed either way. |
| **Indent overrides** | empty | JSON object mapping a line prefix to an indent level, `"relative"` (same as the next line) or `"relativeUp"` (same as the previous line). |

#### Non-English keywords

The formatter knows the English keywords. For other languages, map yours in **Indent overrides**:

```json
{
  "Característica": 0,
  "Escenario": 1,
  "Dado": 2,
  "Cuando": 2,
  "Entonces": 2,
  "Y": 2
}
```

Default levels: `Feature` 0 · `Rule`, `Background`, `Scenario` 1 · `Examples` and steps 2 · tables and doc strings 3 · comments and tags follow the next line.

## 🚧 Not included

Orca's plugin API has no completion, inline diagnostics, go-to-definition or snippets. So step autocomplete, step validation and jumping to step definitions from the original extension are not available.

## 🛠 Development

```sh
orca plugin validate .   # check the manifest and files
orca plugin test .       # run src/worker.test.ts
orca plugin inspect .    # show what the plugin adds and is granted
```

| Path | |
|---|---|
| `orca-plugin.json` | Manifest: syntax, new-file template, save hook, settings |
| `src/worker.ts` | `editor.save.before` hook that formats the file |
| `src/format.ts` | Formatter ported from upstream |
| `syntaxes/` | TextMate grammar and language configuration |
| `templates/new.feature` | New-file template |

## 📜 License

[MIT](LICENSE) © 2026 Ilya Zolotov.
The grammar, language configuration and formatter come from [VSCucumberAutoComplete](https://github.com/alexkrechik/VSCucumberAutoComplete), © 2018 Alexander Krechik, MIT.
