"use strict";
// Extension entry point for C# Dev Kit
// This extension contributes file-nesting patterns for C# development
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
/**
 * Called when the extension is activated
 * @param context Extension context
 */
function activate(context) {
    console.log('C# Dev Kit extension is now active!');
    // Extension is activated to provide file-nesting configuration defaults
    // The actual configuration is defined in package.json configurationDefaults
}
/**
 * Called when the extension is deactivated
 */
function deactivate() { }
//# sourceMappingURL=extension.js.map