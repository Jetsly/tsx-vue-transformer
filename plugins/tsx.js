const ts = require('typescript');
const transformerFactory = require('../');

const printer = ts.createPrinter();

module.exports = {
  process(src, filename, config, options) {
    const result = ts.transpileModule(src, {
      transformers: {
        before: [transformerFactory()],
      },
    });
    return result.outputText;
  },
};
