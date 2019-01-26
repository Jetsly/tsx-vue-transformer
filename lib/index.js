"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var htmlTags = require("html-tags");
var rootAttributes = [
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
var prefixes = ['props', 'domProps', 'on', 'nativeOn', 'hook', 'attrs'];
var getTag = function (tagName) {
    if (htmlTags.includes(tagName.getText())) {
        return ts.createStringLiteral(tagName.getText());
    }
    else {
        return ts.createIdentifier(tagName.getText());
    }
};
var visitAttrsProperties = function (properties) {
    var rootProperties = [];
    var otherKeys = [];
    var otherProperty = {};
    properties.forEach(function (property) {
        var propertyName = property.name.getText();
        if (ts.isJsxAttribute(property)) {
            var prefixIndex = prefixes.findIndex(function (prefix) {
                return RegExp("^" + prefix + "(-[a-z]|[A-Z])").test(propertyName);
            });
            var isPrefix = prefixIndex > -1;
            var isRoot = rootAttributes.indexOf(propertyName) > -1;
            var newName = ts.createStringLiteral(isPrefix
                ? propertyName.replace(RegExp("^" + prefixes[prefixIndex] + "-?(\\w)"), function (_, w) {
                    return w.toLowerCase();
                })
                : propertyName);
            var newProperty = ts.createPropertyAssignment(newName, property.initializer
                ? ts.isJsxExpression(property.initializer)
                    ? property.initializer.expression
                    : property.initializer
                : ts.createTrue());
            if (isPrefix) {
                var key = prefixes[prefixIndex];
                if (otherKeys.indexOf(key) === -1) {
                    otherProperty[key] = [];
                    otherKeys.push(key);
                }
                otherProperty[key].push(newProperty);
            }
            else if (isRoot) {
                rootProperties.push(newProperty);
            }
            else {
                if (otherKeys.indexOf('attrs') === -1) {
                    otherProperty['attrs'] = [];
                    otherKeys.push('attrs');
                }
                otherProperty.attrs.push(newProperty);
            }
        }
    });
    return Object.keys(otherProperty).reduce(function (previousProperties, attr) {
        return previousProperties.concat(ts.createPropertyAssignment(ts.createIdentifier(attr), ts.createObjectLiteral(otherProperty[attr])));
    }, rootProperties);
};
var visitJsxElement = function (node) {
    return ts.createCall(ts.createIdentifier('h'), undefined, [
        getTag(node.openingElement.tagName),
        ts.createArrayLiteral(node.children
            .map(function (child) {
            if (ts.isJsxExpression(child)) {
                return child.expression;
            }
            else if (ts.isJsxElement(child)) {
                return visitJsxElement(child);
            }
            else if (ts.isJsxText(child) && child.getText().trim().length) {
                return ts.createStringLiteral(child.getText());
            }
            return undefined;
        })
            .filter(Boolean)),
    ]);
};
function transformer() {
    return function (context) { return function (sourceFile) {
        var visitorJSX = function (node) {
            if (ts.isJsxElement(node)) {
                return visitJsxElement(node);
            }
            else if (ts.isJsxSelfClosingElement(node)) {
                return ts.createCall(ts.createIdentifier('h'), undefined, [
                    getTag(node.tagName),
                    ts.createObjectLiteral(visitAttrsProperties(node.attributes.properties)),
                ]);
            }
            return ts.visitEachChild(node, visitorJSX, context);
        };
        return ts.visitNode(sourceFile, visitorJSX);
    }; };
}
exports.default = transformer;
