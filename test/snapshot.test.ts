import * as ts from 'typescript';
import { join } from 'path';
import { readdirSync, statSync, readFileSync } from 'fs';
import transformerFactory from '../src';
const printer = ts.createPrinter();
const FIXTURES_DIR = join(__dirname, '__fixtures__');

describe('snapshot', () => {
  readdirSync(FIXTURES_DIR).forEach(fixtureName => {
    const fixtureFile = join(FIXTURES_DIR, fixtureName);
    if (statSync(fixtureFile).isFile()) {
      it(fixtureName.split('-').join(' '), () => {
        const sourceCode = readFileSync(fixtureFile, 'utf-8');
        const source = ts.createSourceFile(fixtureName, sourceCode, ts.ScriptTarget.ES2016, true);
        const result = ts.transform(source, [transformerFactory()]);
        const transformedSourceFile = result.transformed[0];
        const resultCode = printer.printFile(transformedSourceFile);
        expect(resultCode).toMatchSnapshot();
      });
    }
  });
});
