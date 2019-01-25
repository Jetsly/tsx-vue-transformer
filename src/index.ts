import * as ts from 'typescript';

const rootAttributes = [
  'staticClass',
  'class',
  'style',
  'key',
  'ref',
  'refInFor',
  'slot',
  'scopedSlots',
  'model',
];
const prefixes = ['props', 'domProps', 'on', 'nativeOn', 'hook', 'attrs'];
const char = '-';

const visitAttrsProperties = (properties: ts.NodeArray<ts.JsxAttributeLike>) => {
  const rootProperties: ts.PropertyAssignment[] = [];
  const otherKeys = [];
  const otherProperty: { [key: string]: ts.PropertyAssignment[] } = {};
  properties.forEach(property => {
    const propertyName = property.name.getText();
    if (ts.isJsxAttribute(property)) {
      const prefixIndex = prefixes.indexOf(propertyName.split(char)[0]);
      const isPrefix = prefixIndex > -1;
      const isAttrs = rootAttributes.indexOf(propertyName) === -1;
      const isRoot = rootAttributes.indexOf(propertyName) > -1;
      const newName = ts.createStringLiteral(
        isPrefix
          ? propertyName
              .split(char)
              .slice(1)
              .join(char)
          : propertyName
      );
      const newProperty: ts.PropertyAssignment = ts.createPropertyAssignment(
        newName,
        property.initializer
          ? ts.isJsxExpression(property.initializer)
            ? property.initializer.expression
            : property.initializer
          : ts.createTrue()
      );
      if (isPrefix) {
        const key = prefixes[prefixIndex];
        if (otherKeys.indexOf(key) === -1) {
          otherProperty[key] = [];
          otherKeys.push(key);
        }
        otherProperty[key].push(newProperty);
      } else if (isRoot) {
        rootProperties.push(newProperty);
      } else if (isAttrs) {
        if (otherKeys.indexOf('attrs') === -1) {
          otherProperty['attrs'] = [];
          otherKeys.push('attrs');
        }
        otherProperty.attrs.push(newProperty);
      }
    }
  });

  return Object.keys(otherProperty).reduce((previousProperties, attr) => {
    return previousProperties.concat(
      ts.createPropertyAssignment(
        ts.createIdentifier(attr),
        ts.createObjectLiteral(otherProperty[attr])
      )
    );
  }, rootProperties);
};

export default function transformer() {
  return (context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => {
    const visitorJSX: ts.Visitor = node => {
      if (ts.isJsxElement(node)) {
        return ts.createCall(ts.createIdentifier('h'), undefined, [
          ts.createStringLiteral(node.openingElement.tagName.getText()),
          ts.createArrayLiteral(
            node.children.map(child => {
              if (ts.isJsxExpression(child)) {
                return child.expression;
              }
              return ts.createStringLiteral(child.getText());
            })
          ),
        ]);
      } else if (ts.isJsxSelfClosingElement(node)) {
        return ts.createCall(ts.createIdentifier('h'), undefined, [
          ts.createStringLiteral(node.tagName.getText()),
          ts.createObjectLiteral(visitAttrsProperties(node.attributes.properties)),
        ]);
      }
      return ts.visitEachChild(node, visitorJSX, context);
    };

    return ts.visitNode(sourceFile, visitorJSX);
  };
}
