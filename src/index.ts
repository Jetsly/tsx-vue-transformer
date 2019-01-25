import * as ts from 'typescript';

export default function transformer() {
  return (context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => {
    const visitorJSX: ts.Visitor = node => {
      if (ts.isJsxElement(node)) {
        return ts.createCall(ts.createIdentifier('h'), undefined, [
          ts.createStringLiteral(node.openingElement.tagName.getText()),
          ts.createArrayLiteral(
            node.children.map(child => ts.createStringLiteral(child.getText()))
          ),
        ]);
      }
      return ts.visitEachChild(node, visitorJSX, context);
    };

    return ts.visitNode(sourceFile, visitorJSX);
  };
}
