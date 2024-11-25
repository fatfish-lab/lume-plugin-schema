// This plugin is inspired by lume/plugins/metas.ts. Credits to @oscarotero - Óscar Otero

import { merge } from "lume/core/utils/object.ts";
import { getDataValue } from "lume/core/utils/data_values.ts";

import type Site from "lume/core/site.ts";
import type { Page } from "lume/core/file.ts";

import { JSONLD } from "./formats/jsonld.ts"

export interface Options {
  /** The list extensions this plugin applies to */
  extensions?: string[];

  // The format used to store schema data
  format?: 'json-ld' | 'microdata' | 'rdfa';

  /** The name of the key in the data object */
  name?: string;
}

export interface Schema {
  "@context": string;
  "@type": string;

  headline?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: string | string[];

  /** Other meta tags */
  // deno-lint-ignore no-explicit-any
  [name: string]: any;
}

const defaults: Options = {
  extensions: [".html"],
  format: "json-ld",
  name: "schema",
};

/**
 * A plugin to insert schema.org metadata into files.
 * @see https://github.com/fatfish-lab/lume-plugin-schema
 */
export function schema(userOptions?: Options) {
  const options = merge(defaults, userOptions);
  const format = options.format;
  let Schema: JSONLD;

  if (format == 'json-ld') {
    Schema = new JSONLD();
  } else {
    throw new Error(`Unsupported format: ${format}. Only 'json-ld' is supported for now.`);
  }

  return (site: Site) => {
    // Configure the merged keys
    site.mergeKey(options.name, "object");
    site.process(options.extensions, (pages) => pages.forEach(schema));

    function schema(page: Page) {
      const schemas = page.data[options.name] as Schema | undefined;

      if (!schemas || !page.document) {
        return;
      }

      const { document, data } = page;
      const [main, other] = getSchemas(schemas);
      const schemaImage = getDataValue(data, main["image"]);

      const url = site.url(page.data.url, true);
      const image = schemaImage
        ? new URL(site.url(schemaImage), url).href
        : undefined;

      const context = getDataValue(data, main["@context"]);
      const type = getDataValue(data, main["@type"]);
      const headline = getDataValue(data, main.headline);
      const datePublished = getDataValue(data, main.datePublished);
      const dateModified = getDataValue(data, main.dateModified);
      const author = getDataValue(data, main.author);

      // Schema
      Schema.addSchema("@context", context || "https://schema.org");
      Schema.addSchema("@type", type);
      Schema.addSchema("headline", headline);
      Schema.addSchema("datePublished", datePublished);
      Schema.addSchema("dateModified", dateModified);
      Schema.addSchema("author", author);

      if (image) Schema.addSchema("image", image);

      for (const [name, value] of Object.entries(other)) {
        Schema.addSchema(name, getDataValue(data, value));
      }

      // Integrate schema
      Schema.integrateSchema(document);
    }
  };
}

export default schema;

function getSchemas(schemas: Schema): [Schema, Record<string, unknown>] {
  const {
    "@context": context,
    "@type": type,
    headline,
    image,
    datePublished,
    dateModified,
    author,
    ...other
  } = schemas;
  return [{
    "@context": context,
    "@type": type,
    headline,
    image,
    datePublished,
    dateModified,
    author,
  }, other];
}