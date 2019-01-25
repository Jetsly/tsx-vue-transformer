"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function transformer() {
    return function (context) { return function (sourceFile) {
        var visitorJSX = function (node) {
            if (ts.isJsxElement(node)) {
                return ts.createCall(ts.createIdentifier('h'), undefined, [
                    ts.createStringLiteral(node.openingElement.tagName.getText()),
                    ts.createArrayLiteral(node.children.map(function (child) { return ts.createStringLiteral(child.getText()); })),
                ]);
            }
            return ts.visitEachChild(node, visitorJSX, context);
        };
        return ts.visitNode(sourceFile, visitorJSX);
    }; };
}
exports.default = transformer;
