import Format from "../format.ts";

export class JSONLD extends Format {
  json: Record<string, unknown>;

  constructor() {
    super();
    this.json = {};
  }

  // deno-lint-ignore no-explicit-any
  override addSchema(propName: string, content: any) {
    if (!content) {
      return;
    }

    if (typeof content === "string") {
      content = content
        .replaceAll(/<[^>]*>/g, "")
        .replaceAll(/\s+/g, " ")
        .trim();
    }

    this.json[propName] = content;
  }

  override integrateSchema(document: Document) {
    const $script = document.createElement("script");

    $script.setAttribute('type', "application/ld+json");
    $script.textContent = JSON.stringify(this.json);

    document.head.appendChild($script);
  }
}