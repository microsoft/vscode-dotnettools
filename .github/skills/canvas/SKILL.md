---
name: canvas
description: Show things visually using Canvas. Use when the human says "put this on the canvas," "show me a visual," "make a slide," or "visualize this." Canvas creates an HTML file and opens it as a borderless app window.
---
# Skill: Canvas

Canvas is how BlueBridge shows things visually. When the human says "put this on the canvas," "show me a visual," "make a slide," or "visualize this," Canvas is the tool.

Canvas creates an HTML file and opens it as a borderless app window -- no browser toolbar, no address bar. It looks like a native app.

---

## When to Use Canvas

Use canvas when the human needs to:

- See data, not just read it (charts, tables, comparisons)
- Share something with their team (a brief, a summary, a one-pager)
- Think visually (a layout, a framework, a decision map)
- Present something without opening PowerPoint

Do NOT use canvas for:
- Quick text answers (just reply in chat)
- Drafts that need editing (save to vault instead, open canvas when it is done)

---

## The Workflow

1. Human says something like: "put the org chart on the canvas" or "make me a visual summary of this"
2. You generate the HTML file, save it to `$env:USERPROFILE\OneDrive - Microsoft\Workbench\outputs\canvas\YYYY-MM-DD-topic.html`
3. Open it: `Start-Process "msedge.exe" -ArgumentList "--app=file:///$($env:USERPROFILE -replace "\\","/")/ OneDrive%20-%20Microsoft/Workbench/outputs/canvas/YYYY-MM-DD-topic.html", "--window-size=1400,900"`
4. You tell the human: "Canvas is open." Give the file path if they want to share it.

If the human says "can you update the canvas" or "change that heading" -- edit the HTML file and reopen. The old window will need to be closed first.

---

## File Naming

Canvas files live in `$env:USERPROFILE\OneDrive - Microsoft\Workbench\outputs\canvas\`. Name them clearly:

```
2026-02-24-q2-priorities.html
2026-02-24-team-skills-map.html
2026-02-24-meeting-brief-sarah.html
```

Date prefix first so they sort by recency. Topic second, hyphen-separated, lowercase.

---

## HTML Design Standards

Every canvas follows these rules:

**Light theme (default):**
```css
body          { background: #F1F5F9; color: #1E293B; font-family: system-ui, sans-serif; }
.card         { background: #FFFFFF; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
```

**Dark theme (when human prefers or for presentations):**
```css
body          { background: #1A1D23; color: #E2E8F0; }
.card         { background: #252A34; }
```

Always include:
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Readable at 1400x900 without scrolling (for single-screen visuals)
- No em dashes anywhere in the HTML content
- Real content only. No Lorem ipsum placeholders.

Offer a preview summary in chat before opening: "I'm about to show you a two-column layout with your Q2 priorities on the left and blockers on the right. Opening canvas..."

---

## Example Natural Language Triggers

| The human says | What you do |
|----------------|-------------|
| "Put this on the canvas" | Generate HTML for the current topic, open in canvas |
| "Make me a one-pager on this" | Design a single-page canvas document |
| "Show me a visual" | Choose the right chart or layout, generate, open |
| "I want to present this" | Ask: dark or light theme? Then build and open |
| "Can you make a slide?" | Canvas is the slide equivalent. Build and open. |
| "Open the canvas" | Open the most recent canvas file from the user's canvas output folder |

---

## What Canvas Cannot Do

- Print directly (tell the human to use Ctrl+P from the open canvas window)
- Save as PowerPoint (it is HTML; suggest they screenshot sections if needed)

Canvas files live on OneDrive and sync automatically. The human can share them from any device or send the link directly.
