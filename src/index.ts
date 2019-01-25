import * as ts from 'typescript';

export default function transformer() {
  return (context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => {
    const visitorJSX: ts.Visitor = node => {
      if (ts.isJsxElement(node)) {
        return ts.createCall(ts.createIdentifier('h'), undefined, [
          ts.createStringLiteral(node.openingElement.tagName.getText()),
          ts.createArrayLiteral(
            node.children.map(child => {
              if (ts.isJsxExpression(child)) {
                return ts.createIdentifier(child.getText());
              }
              return ts.createStringLiteral(child.getText());
            })
          ),
        ]);
      } else if (ts.isJsxSelfClosingElement(node)) {
        const attrsProperty = ts.createPropertyAssignment(
          ts.createIdentifier('attrs'),
          ts.createObjectLiteral(
            node.attributes.properties.map(child => {
              if (ts.isJsxAttribute(child)) {
                return ts.createPropertyAssignment(
                  child.name,
                  ts.isJsxExpression(child.initializer)
                    ? child.initializer.expression
                    : child.initializer
                );
              }
              return undefined;
            })
          )
        );
        attrsProperty.initializer;
        return ts.createCall(ts.createIdentifier('h'), undefined, [
          ts.createStringLiteral(node.tagName.getText()),
          ts.createObjectLiteral([attrsProperty]),
        ]);
      }
      return ts.visitEachChild(node, visitorJSX, context);
    };

    return ts.visitNode(sourceFile, visitorJSX);
  };
}
