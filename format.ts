import { Options } from './mod.ts';

export default class Format {
  type: Options['format'];
  // deno-lint-ignore no-explicit-any
  addSchema(propName: string, content: any): void {
    throw new Error('Method not implemented.');
  }

  integrateSchema(document: Document): void {
    throw new Error('Method not implemented.');
  }
}