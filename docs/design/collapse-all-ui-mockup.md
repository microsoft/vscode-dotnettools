# UI Mockup: Collapse All Button in Solution View

This document provides mockups of how the "Collapse All" button should appear in the Solution View and how it behaves when clicked.

## Solution View with Collapse All Button

The "Collapse All" button should be placed in the view's title bar, next to the existing buttons like Refresh:

```
┌─────────────────────────────────────────────────────────┐
│ SOLUTION EXPLORER                            [↻] [◀◀] […] │
├─────────────────────────────────────────────────────────┤
│ ▼ MySolution                                           │
│   ▼ Project1                                           │
│     ▼ Dependencies                                     │
│       ▼ NuGet Packages                                 │
│         ├─ Package1                                    │
│         └─ Package2                                    │
│     ▼ Properties                                       │
│       └─ launchSettings.json                           │
│     ├─ Controllers                                     │
│     └─ Program.cs                                      │
│   ▼ Project2                                           │
│     ▼ Dependencies                                     │
│     ▼ Properties                                       │
│     └─ Program.cs                                      │
│   ▼ Project3                                           │
│     ├─ Dependencies                                    │
│     └─ Module.cs                                       │
└─────────────────────────────────────────────────────────┘
```

## After Clicking Collapse All

After clicking the "Collapse All" button, the projects should collapse but the solution should remain expanded:

```
┌─────────────────────────────────────────────────────────┐
│ SOLUTION EXPLORER                            [↻] [◀◀] […] │
├─────────────────────────────────────────────────────────┤
│ ▼ MySolution                                           │
│   ▶ Project1                                           │
│   ▶ Project2                                           │
│   ▶ Project3                                           │
└─────────────────────────────────────────────────────────┘
```

## Icon Design

The "Collapse All" button should use the standard VS Code "collapse-all" icon from the Codicon library. This is typically represented as a left-facing double arrow (◀◀).

## Tooltip

When hovering over the button, a tooltip should appear with the text "Collapse All" to clearly describe its function.

## Keyboard Shortcut Support

While the primary access method is clicking the button, the feature should also be accessible via a keyboard shortcut, ideally matching the shortcut used for the standard VS Code Explorer "Collapse All" functionality.

## Accessibility Considerations

The button should have appropriate ARIA labels for screen readers, typically "Collapse All Projects" to accurately describe what the button does in the context of the Solution View.