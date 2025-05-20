# Implementation Guide: Collapse All Feature for Solution View

This document provides a concise guide for implementing the "Collapse All" feature in the Solution View for the C# DevKit extension.

## Feature Summary

- **Feature**: Add a "Collapse All" button to the Solution View that collapses all projects but keeps the solution itself expanded
- **Issue**: [#612 - Being able to collapse all folders in solution view in C# DevKit](https://github.com/microsoft/vscode-dotnettools/issues/612)
- **User Experience**: Clicking the button collapses all projects to their root nodes while keeping the solution expanded

## Implementation Steps

### 1. Update package.json

Add the command and menu contribution for the collapse all button:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "dotnet.solution.explorer.collapseAll",
        "title": "Collapse All",
        "icon": "$(collapse-all)"
      }
    ],
    "menus": {
      "view/title": [
        {
          "command": "dotnet.solution.explorer.collapseAll",
          "when": "view == dotnet.solution.explorer",
          "group": "navigation"
        }
      ]
    }
  }
}
```

### 2. Register Command Handler

In the extension activation function (or wherever commands are registered):

```typescript
context.subscriptions.push(
  vscode.commands.registerCommand('dotnet.solution.explorer.collapseAll', async () => {
    // Implementation goes here - see the code samples in collapse-all-implementation.ts
    // for detailed implementation options
  })
);
```

### 3. Implement Command Logic

There are two main approaches:

#### Approach A: Direct node manipulation (preferred)

```typescript
// Get the solution tree provider and root node
const solutionNode = solutionTreeProvider.getRoot();

// Collapse all project nodes but keep solution expanded
if (solutionNode && solutionNode.children) {
  for (const projectNode of solutionNode.children) {
    await vscode.commands.executeCommand('list.collapse', projectNode);
  }
}
```

#### Approach B: Using list.collapseAll and then re-expanding the solution

```typescript
// First collapse everything
await vscode.commands.executeCommand('list.collapseAll');

// Then expand only the root (solution) node
const rootNode = solutionTreeProvider.getRoot();
if (rootNode) {
  await vscode.commands.executeCommand('list.expand', rootNode);
}
```

### 4. Error Handling

Add appropriate error handling to the command implementation:

```typescript
try {
  // Command implementation
} catch (err) {
  vscode.window.showErrorMessage(`Failed to collapse solution items: ${err}`);
}
```

### 5. Add Keyboard Shortcut Support (Optional)

If keyboard shortcut support is desired, consider adding a keybinding in package.json:

```json
{
  "contributes": {
    "keybindings": [
      {
        "command": "dotnet.solution.explorer.collapseAll",
        "key": "ctrl+shift+c",
        "mac": "cmd+shift+c",
        "when": "view == dotnet.solution.explorer && viewFocus"
      }
    ]
  }
}
```

## Testing Checklist

- [ ] Verify the collapse all button appears in the Solution View title bar
- [ ] Verify clicking the button collapses all projects but keeps the solution expanded
- [ ] Test with different solution sizes (small, medium, large)
- [ ] Check keyboard shortcut functionality (if implemented)
- [ ] Verify the collapsed state is preserved when switching between views
- [ ] Test accessibility with screen readers

## Related Documents

- [Detailed Design Document](./collapse-all-solution-view.md)
- [Reference Implementation](./collapse-all-implementation.ts)
- [UI Mockup](./collapse-all-ui-mockup.md)

## Notes

- The actual implementation details may vary depending on how the Solution View is currently implemented in the codebase
- Consider adding telemetry to track usage of this feature
- If performance is an issue with large solutions, consider adding progress indication or optimizing the collapse operation