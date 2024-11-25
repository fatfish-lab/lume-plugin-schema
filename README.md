# Lume plugin schema

Add schema to your Lume website.

> This plugin is inspired by lume/plugins/metas.ts.
> Credits to @oscarotero - Óscar Otero

## Options

- extensions: `string[]` - The extensions of the files to add schema to. Default: `[".html"]`
- format: `string` - The format of the schema (`json-ld` | `microdata` | `rdfa`). Default: `"json-ld"`
- name: `string` - The key name for the schma values definitions

## Description

This plugin is still under development. For know only `json-ld` format is supported.
It's used to add schema and structured data to your website, helping improving SEO. The data must be defined in the `schema` keyword of every page you want to add schema to.

## Installation

```ts
import lume from "lume/mod.ts";
import schema from "https://deno.land/x/fatfishlab_lume_plugin_schema@0.0.1/mod.ts";


const site = lume();

site.use(schema(/* Options */));

export default site;

```

> **Note:** For easier plugin version management, the best is to add an imports in your deno.json file :
> ```json
> {
>   "imports": {
>     "schema/": "https://deno.land/x/fatfishlab_lume_plugin_schema@0.0.1/"
>   }
> }
> ```
> And then import the plugin in your `_config.ts` file :
> ```ts
> import schema from "schema/mod.ts";
> ```


## Usage

In a data file (like `/_data.yml`) in the root of your project or in a specific folder, add the schama values:

```yaml
schema:
  type: "Article"
  headline: =title
  datePublished: =date
  dateModified: =date
  articleBody: =content
```

