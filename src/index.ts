import * as ts from 'typescript';
import * as htmlTags from 'html-tags';
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
const getTag = (tagName: ts.JsxTagNameExpression) => {
  if (htmlTags.includes(tagName.getText())) {
    return ts.createStringLiteral(tagName.getText());
  } else {
    return ts.createIdentifier(tagName.getText());
  }
};

const visitAttrsProperties = (properties: ts.NodeArray<ts.JsxAttributeLike>) => {
  const rootProperties: ts.PropertyAssignment[] = [];
  const otherKeys = [];
  const otherProperty: { [key: string]: ts.PropertyAssignment[] } = {};
  properties.forEach(property => {
    const propertyName = property.name.getText();
    if (ts.isJsxAttribute(property)) {
      const prefixIndex = prefixes.findIndex(prefix =>
        RegExp(`^${prefix}(\-[a-z]|[A-Z])`).test(propertyName)
      );
      const isPrefix = prefixIndex > -1;
      const isRoot = rootAttributes.indexOf(propertyName) > -1;
      const newName = ts.createStringLiteral(
        isPrefix
          ? propertyName.replace(RegExp(`^${prefixes[prefixIndex]}-?(\\w)`), (_, w) =>
              w.toLowerCase()
            )
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
      } else {
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

const visitJsxElement = (node: ts.JsxElement) => {
  return ts.createCall(ts.createIdentifier('h'), undefined, [
    getTag(node.openingElement.tagName),
    ts.createArrayLiteral(
      node.children
        .map(child => {
          if (ts.isJsxExpression(child)) {
            return child.expression;
          } else if (ts.isJsxElement(child)) {
            return visitJsxElement(child);
          } else if (ts.isJsxText(child) && child.getText().trim().length) {
            return ts.createStringLiteral(child.getText());
          }
          return undefined;
        })
        .filter(Boolean)
    ),
  ]);
};

export default function transformer() {
  return (context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => {
    const visitorJSX: ts.Visitor = node => {
      if (ts.isJsxElement(node)) {
        return visitJsxElement(node);
      } else if (ts.isJsxSelfClosingElement(node)) {
        return ts.createCall(ts.createIdentifier('h'), undefined, [
          getTag(node.tagName),
          ts.createObjectLiteral(visitAttrsProperties(node.attributes.properties)),
        ]);
      }
      return ts.visitEachChild(node, visitorJSX, context);
    };

    return ts.visitNode(sourceFile, visitorJSX);
  };
}
