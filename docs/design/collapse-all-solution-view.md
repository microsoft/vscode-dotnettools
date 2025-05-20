# Design Document: Collapse All Feature for Solution View

## Overview

This document outlines the design and implementation approach for adding a "Collapse All" feature to the Solution View in the C# DevKit extension for Visual Studio Code.

## Background

Users have requested the ability to collapse all folders in the Solution View, similar to the functionality already available in the standard VS Code Explorer view. Based on user feedback, the desired behavior is to collapse all projects but keep the solution itself expanded (Option A in the issue discussion).

## User Experience

When a user clicks the "Collapse All" button in the Solution View:

1. All projects in the solution will be collapsed to show only their root nodes
2. The solution itself will remain expanded, showing the list of projects
3. The focus will remain on the previously selected item or move to the first visible item if the previously selected item is now hidden

## UI Design

The "Collapse All" button should be added to the title bar of the Solution View, consistent with other VS Code views:

```
Solution Explorer       [Refresh] [Collapse All] [...]
├── MySolution
│   ├── Project1        (collapsed)
│   ├── Project2        (collapsed)
│   └── Project3        (collapsed)
```

The icon should be the standard VS Code "Collapse All" icon (a double-arrow pointing left) for consistency.

## Implementation Approach

### 1. Add the Collapse All Command

Register a new command in the `package.json`:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "dotnet.solution.explorer.collapseAll",
        "title": "Collapse All",
        "icon": "$(collapse-all)"
      }
    ]
  }
}
```

### 2. Add the Command to the Solution View Title

Add the command to the Solution View title bar in `package.json`:

```json
{
  "contributes": {
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

### 3. Implement the Command Handler

Create a command handler that collapses all projects but leaves the solution itself expanded:

```typescript
// In the file that handles solution view commands
context.subscriptions.push(
  vscode.commands.registerCommand('dotnet.solution.explorer.collapseAll', async () => {
    // Get the solution view tree provider
    const provider = solutionTreeProvider; // Replace with the actual reference to the provider
    
    // The solution is typically the root node
    const solutionNode = provider.getRoot();
    
    // Collapse all child nodes (projects) but keep the solution expanded
    if (solutionNode && solutionNode.children && solutionNode.children.length > 0) {
      for (const projectNode of solutionNode.children) {
        // Collapse this project node
        await vscode.commands.executeCommand('list.collapseItem', projectNode);
      }
    }
  })
);
```

### 4. Alternative Approach Using TreeView API

If the Solution View is implemented using VS Code's TreeView API, we can use the built-in `collapseAll` method but modify it to exclude the root node:

```typescript
// In the file that handles solution view commands
context.subscriptions.push(
  vscode.commands.registerCommand('dotnet.solution.explorer.collapseAll', async () => {
    // Get the TreeView instance
    const treeView = extensionContext.treeView; // Replace with the actual reference to the tree view
    
    // First collapse everything
    await vscode.commands.executeCommand('list.collapseAll');
    
    // Then expand only the root node (solution)
    const rootNode = treeView.selection[0] || treeView.getRoot();
    if (rootNode) {
      await vscode.commands.executeCommand('list.expand', rootNode);
    }
  })
);
```

## Considerations and Edge Cases

1. **Large Solutions**: For very large solutions, collapsing all projects might take a moment. Consider adding visual feedback during the operation.

2. **Selection Preservation**: After collapsing, the current selection should be preserved if still visible, or reset to an appropriate node if hidden.

3. **Accessibility**: Ensure the collapse all button has appropriate accessibility labels and follows VS Code's accessibility guidelines.

4. **State Persistence**: The collapsed/expanded state should be persisted across VS Code sessions.

## Testing

Test the following scenarios:

1. Clicking the "Collapse All" button in a solution with multiple projects
2. Verifying that only projects collapse and the solution remains expanded
3. Checking that the selection behavior works as expected
4. Ensuring the command works via keyboard shortcuts and the command palette

## Future Enhancements

1. Add a keyboard shortcut for the collapse all function
2. Consider adding an "Expand All" function as a complementary feature
3. Allow customization of the collapse behavior (e.g., option to also collapse the solution)

## Related Issues

- [#612 - Being able to collapse all folders in solution view in C# DevKit](https://github.com/microsoft/vscode-dotnettools/issues/612)