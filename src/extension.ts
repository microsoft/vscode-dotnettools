// Extension entry point for C# Dev Kit
// This extension contributes file-nesting patterns for C# development

import * as vscode from 'vscode';

/**
 * Called when the extension is activated
 * @param context Extension context
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('C# Dev Kit extension is now active!');
    
    // Extension is activated to provide file-nesting configuration defaults
    // The actual configuration is defined in package.json configurationDefaults
}

/**
 * Called when the extension is deactivated
 */
export function deactivate() {}