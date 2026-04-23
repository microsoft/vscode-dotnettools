# Skill: Calendar View

Generate an interactive, scrollable HTML calendar view from a markdown schedule file. The calendar uses the Canvas skill to display as a borderless app window.

Any schedule with named categories (phases, milestones, events) and dates or date ranges can be visualized. Examples: iteration plans, project timelines, release schedules, marketing calendars, sprint plans, academic term schedules.

---

## When to Use

Use this skill when someone provides a markdown file (or describes a schedule) with named events and dates, and asks for a calendar view, visual timeline, or schedule visualization.

---

## Getting Started: Single Month or Multi-Month

The user may provide a full multi-month markdown schedule, OR they may provide just a single month (or even just describe their process verbally). Handle both cases.

### If the user provides a complete multi-month markdown file

Skip to the **Input Format** section and generate the calendar directly. Still ask for the calendar title before generating.

### If the user provides only one month (or describes their process)

Use the single month as a template to learn their recurring pattern, then **ask questions using the ask_user tool** to fill in the gaps before generating additional months. Ask one question at a time.

#### Step 1: Identify their categories

Look at the categories in their first month. Classify each as a **band** (date range) or **tag** (single date) based on whether it has an end date. Note the category names -- do not rename them.

#### Step 2: Ask about their recurring patterns

Based on what you see in month 1, ask targeted questions to confirm the pattern. Adapt these to whatever categories they have:

- "It looks like [event X] always lands on [day of week] -- is that always the case?"
- "[Phase Y] ran about [N] days/weeks. Is that typical, or does it vary?"
- "[Event A] and [Event B] happen on the same day. Is that always the case?"
- "I see [N] occurrences of [recurring event] during [phase]. Is that the pattern?"
- "Does [phase] always start the day after [other phase] ends?"

Only ask about things you cannot confidently infer. If the pattern is obvious, confirm it in one question rather than asking separately for each detail.

**Example for an iteration plan:** "Your releases land on Wednesdays, Dev runs ~3 weeks, and Endgame goes Thursday through the following Friday. Is that the standard pattern?"

#### Step 3: Ask how many months to generate

"How many months ahead should I generate? And what month should I start from?"

#### Step 4: Generate the markdown schedule

Using the confirmed pattern, generate the full multi-month markdown schedule file and show it to the user for approval before building the calendar. This becomes their source-of-truth file.

#### Step 5: Build the calendar

Once approved, generate the HTML calendar and open it via Canvas.

---

## Input Format

The source markdown must follow this structure. Each month is an H2 heading with a table of categories, start dates, and optional end dates:

```markdown
# Schedule Title

## April 2026

| Phase | Start Date | End Date |
|------|------------|----------|
| **CATEGORY NAME** | 03-30 | 04-01 |
| **SINGLE-DAY EVENT** | 04-01 | |
| **ANOTHER RANGE** | 04-02 | 04-21 |
```

The column headers can be "Phase", "Event", "Category", or similar -- adapt to whatever the user provides. The key requirement is: a name, a start date (MM-DD), and an optional end date (MM-DD).

### Example: Iteration plan

```markdown
## April 2026

| Phase | Start Date | End Date |
|------|------------|----------|
| **PLANNING** | 03-30 | 04-01 |
| **MAR STABLE RELEASE** | 04-01 | |
| **APR PRE-RELEASE 1** | 04-01 | |
| **DEV** | 04-02 | 04-21 |
| **CODE FREEZE** | 04-22 | |
| **ENDGAME** | 04-23 | 05-01 |
| **APR STABLE RELEASE** | 05-06 | |
```

### Classifying categories

Do NOT use keyword matching. Instead, classify based on the data:

- **Has an end date** (date range) => **Band** (colored horizontal strip spanning the date range)
- **No end date** (single date) => **Tag** (small pill-shaped label within the cell)

This works for any domain -- "Sprint", "Review Period", "QA", "Launch Window" all become bands if they have a date range. "Deadline", "Release", "Milestone", "Checkpoint" all become tags if they are single dates.

---

## Output

A single HTML file saved via the Canvas skill (`YYYY-MM-DD-topic.html`). The calendar is scrollable vertically with one month section per iteration.

### Page structure

```
[Sticky top bar with title]
[Month 1 heading + calendar grid]
[Month 2 heading + calendar grid]
[Month N heading + calendar grid]
```

Before generating the calendar, **ask the user what they want the title to be** using the ask_user tool. The title appears in the sticky top bar and the HTML `<title>`. Do not assume a default -- every team/product will have a different name. For example: "C# in VS Code - Iteration Calendar".

Each month heading uses the format "Month YYYY" (e.g., "April 2026") -- normal case, no "Iteration" suffix.

---

## Calendar Grid

Each month is a standard Sun-Sat calendar grid. The grid must include enough weeks to contain ALL events for that iteration, from Planning through Stable Release (which often falls in the following calendar month).

### Grid sizing

Count the weeks needed from the Sunday before the first event to the Saturday after the last event. Typically 5-6 weeks per iteration.

### Cell types

| Class | Meaning |
|-------|---------|
| `.cal-day` | Standard weekday cell |
| `.cal-day.weekend` | Saturday or Sunday (slightly tinted background) |
| `.cal-day.outside` | Date from a different calendar month than the section heading |
| `.cal-day.today` | Current date (blue outline highlight) |

"Outside" means the date belongs to a different calendar month than the one labeled. For example, in the "April 2026" grid, any May dates are `.outside`. In the "May 2026" grid, any June dates are `.outside`. Dates that ARE in the labeled month are never `.outside`, even if they are in the first or last week row.

---

## Band System (Connected Phase Strips)

Bands are the core visual element. They create colored strips that flow continuously across cell boundaries, bridging week breaks.

### Band classes

Every band element gets the base `.band` class plus a position class:

| Class | Purpose | CSS positioning |
|-------|---------|----------------|
| `.band-start` | First day of a phase (or first weekday of a new week for a continuing phase) | `left: 6px; right: -1px; border-radius: 6px 0 0 6px;` |
| `.band-mid` | Middle day of a phase | `left: -1px; right: -1px;` (overlaps cell borders for seamless connection) |
| `.band-end` | Last day of a phase (or Friday when the phase continues next week) | `left: -1px; right: 6px; border-radius: 0 6px 6px 0;` |
| `.band-start.band-end` | Single-day band | `left: 6px; right: 6px; border-radius: 6px;` |

### Week continuation rule (IMPORTANT)

When a band phase spans multiple weeks, each new week starts a fresh band element:

- Friday of the ending week gets `.band-end`
- Monday of the new week gets `.band-start` with the phase label text (e.g., "Dev", "Endgame")
- This ensures every week row has a visible text label for any active phase

Weekend days (Sat/Sun) never get band elements -- bands break at Friday and resume Monday.

### Band text labels

- `.band-start` elements contain the phase label text: "Planning", "Dev", "Endgame"
- `.band-mid` and `.band-end` elements have no text content
- All band text is uppercase via CSS `text-transform: uppercase`

---

## Tag System (Single-Day Events)

Tags are pill-shaped labels for single-date events (milestones, releases, deadlines, checkpoints, etc.).

### Tag placement

Tags go inside a `.tags` container within the calendar cell:

```html
<div class="tags">
  <div class="tag tag-release">Apr Stable Release</div>
  <div class="tag tag-prerelease">May Pre-release 1</div>
</div>
```

### Interaction with bands

- If a cell has BOTH a band AND tags (e.g., Planning ends on the same day as a Stable Release), the `.tags` container uses `margin-top: 32px` (default) to sit below the band.
- If a cell has tags but NO band (e.g., Code Freeze day), use `style="margin-top:0"` on the `.tags` container.

### Tag text

Use the full phase name from the markdown, preserving the month prefix. All tag text is uppercase via CSS.

Examples: "Apr Stable Release", "May Pre-release 2", "Code Freeze", "Jun Pre-release 4 (RC)"

---

## Color Scheme

Colors are assigned dynamically based on the categories found in the schedule. Do NOT hardcode colors to specific phase names.

### Color palette

Use this palette, assigning colors in order as new categories are encountered. Bands and tags draw from separate pools:

**Band palette** (for date-range phases):

| Slot | Background | Text | Good for |
|------|-----------|------|----------|
| 1 | `#DBEAFE` | `#1E40AF` | Blue - first phase |
| 2 | `#D1FAE5` | `#065F46` | Green - longest/main phase |
| 3 | `#FEE2E2` | `#991B1B` | Red/pink - urgent/final phase |
| 4 | `#FEF9C3` | `#854D0E` | Yellow - caution phase |
| 5 | `#E0E7FF` | `#3730A3` | Indigo - extra phase |
| 6 | `#FFEDD5` | `#9A3412` | Orange - extra phase |

**Tag palette** (for single-day events):

| Slot | Background | Text | Good for |
|------|-----------|------|----------|
| 1 | `#7C3AED` | `#F5F3FF` | Dark purple - major milestones |
| 2 | `#F3E8FF` | `#6B21A8` | Light purple - recurring events |
| 3 | `#FEF3C7` | `#92400E` | Amber - warnings/freezes |
| 4 | `#DBEAFE` | `#1E40AF` | Blue - informational |
| 5 | `#D1FAE5` | `#065F46` | Green - approvals/completions |
| 6 | `#FEE2E2` | `#991B1B` | Red - critical deadlines |

### Assignment strategy

1. Group categories by type (band or tag)
2. Identify distinct category "families" (e.g., all "Pre-release" variants share one color, all "Sprint Review" variants share one color)
3. Assign a color from the palette to each family
4. Generate CSS classes using slugified category names (e.g., `.band-dev`, `.tag-code-freeze`)

If the user has preferences about which color goes where, ask. Otherwise use your best judgment to assign colors that feel intuitive (e.g., red for urgent phases, green for productive work phases).

---

## Complete CSS

Below is the base CSS to include in the HTML `<style>` block. The layout, grid, band mechanics, and tag styles are fixed. The color classes (`.band-*` and `.tag-*`) are generated dynamically based on the categories found in the schedule.

### Base CSS (copy exactly):

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: #F1F5F9;
  color: #1E293B;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 0 48px 80px;
  min-height: 100vh;
}

/* Sticky top bar */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #F1F5F9;
  padding: 28px 0 16px;
}
.top-bar h1 {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.3px;
}

/* Month sections */
.month-section {
  margin-bottom: 40px;
  max-width: 1100px;
}
.month-heading {
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding-top: 8px;
}

.cal {
  width: 100%;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  overflow: hidden;
}

.cal-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #0F172A;
}
.cal-header-cell {
  padding: 10px 0;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94A3B8;
}
.cal-header-cell.weekend { color: #475569; }

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.cal-day {
  min-height: 120px;
  border-right: 1px solid #E2E8F0;
  border-bottom: 1px solid #E2E8F0;
  padding: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.cal-day:nth-child(7n) { border-right: none; }
.cal-day.outside { background: #F8FAFC; }
.cal-day.weekend { background: #FAFBFD; }
.cal-day.today {
  outline: 2.5px solid #3B82F6;
  outline-offset: -2.5px;
  z-index: 3;
}

.day-number {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 0;
}
.cal-day.outside .day-number { color: #CBD5E1; }
.cal-day.today .day-number { color: #3B82F6; font-weight: 800; }

/* Bands: connected phase strips */
.band {
  position: absolute;
  height: 24px;
  top: 30px;
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  z-index: 2;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.band-start {
  left: 6px;
  right: -1px;
  border-radius: 6px 0 0 6px;
  padding-left: 8px;
}
.band-mid {
  left: -1px;
  right: -1px;
}
.band-end {
  left: -1px;
  right: 6px;
  border-radius: 0 6px 6px 0;
}
.band-start.band-end {
  left: 6px;
  right: 6px;
  border-radius: 6px;
  padding-left: 8px;
}

/* Tags: single-day event pills */
.tags {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Dynamic color classes (generate per schedule):

For each band category, generate a class like:
```css
.band-planning { background: #DBEAFE; color: #1E40AF; }
.band-dev      { background: #D1FAE5; color: #065F46; }
```

For each tag category family, generate a class like:
```css
.tag-release     { background: #7C3AED; color: #F5F3FF; }
.tag-prerelease  { background: #F3E8FF; color: #6B21A8; }
.tag-freeze      { background: #FEF3C7; color: #92400E; }
```

Slugify the category name for the class: lowercase, spaces/special chars become hyphens. Use the same class for all variants in a family (e.g., "Pre-release 1", "Pre-release 2", "Pre-release 3 (RC)" all use `.tag-prerelease`).

---

## Algorithm: Markdown to Calendar

Follow these steps to convert the markdown schedule into HTML:

### Step 1: Parse months

Each H2 heading defines a month section. Extract the month name and year.

### Step 2: Parse categories

For each month, read the table rows. For each row, extract:
- Category name (text inside `**...**`)
- Start date (MM-DD format)
- End date (MM-DD format, may be empty for single-day events)

### Step 3: Classify categories

- **Has an end date** => **Band** (date range rendered as connected horizontal strip)
- **No end date** => **Tag** (single-day pill label)

Group similar categories into families for color assignment (e.g., "Apr Pre-release 1" and "Apr Pre-release 2" are the same family).

### Step 4: Determine grid range

For each month, find the earliest start date and latest end date across all phases. Expand to the surrounding Sunday (start) and Saturday (end). This gives the week rows needed.

### Step 5: Build the grid

For each day in the grid range:
1. Determine day of week (Sun=0 through Sat=6)
2. Skip weekends for band rendering (no bands on Sat/Sun)
3. For weekdays, check if any band phase is active:
   - If the day is the phase start date, or Monday of a continuing phase => `.band-start` with label text
   - If the day is the phase end date, or Friday of a phase that continues next week => `.band-end`
   - Otherwise if the day is within a band phase range => `.band-mid`
4. Check if any tags fall on this day and add them
5. Apply cell classes: `.outside` if the date's calendar month differs from the section month, `.weekend` for Sat/Sun, `.today` for current date

### Step 6: Assemble HTML

Wrap in the standard Canvas HTML structure with the full CSS, sticky top bar, and month sections.

---

## Example Cell Patterns

**Band start day:**
```html
<div class="cal-day">
  <div class="day-number">2</div>
  <div class="band band-dev band-start">Dev</div>
</div>
```

**Band continuation on Monday (label repeated):**
```html
<div class="cal-day">
  <div class="day-number">6</div>
  <div class="band band-dev band-start">Dev</div>
</div>
```

**Band middle day:**
```html
<div class="cal-day">
  <div class="day-number">7</div>
  <div class="band band-dev band-mid"></div>
</div>
```

**Band middle day with a tag below it:**
```html
<div class="cal-day">
  <div class="day-number">8</div>
  <div class="band band-dev band-mid"></div>
  <div class="tags">
    <div class="tag tag-prerelease">Apr Pre-release 2</div>
  </div>
</div>
```

**Tag-only day (no band):**
```html
<div class="cal-day">
  <div class="day-number">22</div>
  <div class="tags" style="margin-top:0">
    <div class="tag tag-freeze">Code Freeze</div>
    <div class="tag tag-prerelease">Apr Pre-release 4 (RC)</div>
  </div>
</div>
```

**Multiple tags on a day with a band:**
```html
<div class="cal-day">
  <div class="day-number">1</div>
  <div class="band band-planning band-end"></div>
  <div class="tags">
    <div class="tag tag-release">Mar Stable Release</div>
    <div class="tag tag-prerelease">Apr Pre-release 1</div>
  </div>
</div>
```

**Outside cell with no events:**
```html
<div class="cal-day outside"><div class="day-number">7</div></div>
```

**Weekend cell:**
```html
<div class="cal-day weekend"><div class="day-number">4</div></div>
```

**Today cell:**
```html
<div class="cal-day today">
  <div class="day-number">10</div>
  <div class="band band-dev band-mid"></div>
</div>
```

Note: The class names in these examples (e.g., `band-dev`, `tag-prerelease`) are from an iteration plan. For other schedules, generate class names from the actual category names (e.g., `band-sprint`, `tag-deadline`, `band-review-period`).

---

## Handling Date Changes

When the user asks to change any date, duration, or number of recurring events, **always ask clarifying questions using the ask_user tool** before making changes. You need to understand two things:

1. **Is this a one-off slip or a structural change?** A single event delayed by a day does NOT mean the entire cadence shifts by a day. The next occurrence should still land on its usual day. Only structural changes (like removing a recurring event or moving a phase to a different week) affect downstream dates.

2. **Should downstream dates cascade or stay fixed?**

### One-off vs structural changes

| User says | Type | What to do |
|-----------|------|------------|
| "[Event] slipped to [day]" | **One-off** | Move just that one event. Ask: "Should anything else move, or just this one?" |
| "Move [phase] to [new date]" | **Structural** | Ask: "Should everything after it cascade to new dates, or stay where they are?" |
| "I want fewer [recurring events]" | **Structural** | Ask: "That changes when [downstream phase] starts. Should the rest of the schedule cascade?" |
| "Extend [phase] by N days" | **Structural** | Ask: "Should [next phase] and everything after shift later, or stay on current dates?" |
| "[Event] is moving to [day] this month" | **One-off** | Move just that event. Ask: "Is this a one-time change, or should all future occurrences also move?" |

**Key principle:** Always ask about the *impact* of the change. Do not assume that moving one date by N days means everything else shifts by N days. Most single-event delays are one-off and do not affect the recurring cadence.

### Cascade rules (when the user confirms structural cascading)

Infer the cascade rules from the user's existing schedule. Look at month 1 to determine:

- What day of the week do releases/pre-releases/code freeze land on?
- How many days is each phase (Planning, Dev, Endgame)?
- What's the ordering and gap between phases?
- Do any events share a day (e.g., Stable Release + next Pre-release 1)?

Then apply those same patterns when cascading. For example, if you observe that Code Freeze always lands on Wednesday and Endgame always starts the next Thursday, preserve that when shifting dates.

Do NOT hardcode any specific day-of-week or phase length. Always derive the pattern from the schedule you were given.

After making changes, update the HTML calendar and refresh the browser. For the source markdown file, follow the user's preference (see below).

### Source markdown editing preference

The first time a date change is made, **ask the user** whether they want you to also update their source markdown file when you make changes, or if they prefer to manage it themselves. Remember their answer for the rest of the session.

Example: "When I update the calendar, should I also update your markdown schedule file to match, or do you prefer to manage that file yourself?"

---

## Checklist Before Delivery

- [ ] Every weekday within a band phase has a `.band` element
- [ ] Every Monday of a continuing phase has `.band-start` with the phase label
- [ ] Every Friday before a weekend where the phase continues has `.band-end`
- [ ] Tags on band days have default `margin-top: 32px`; tags on non-band days have `style="margin-top:0"`
- [ ] Dates from adjacent months are marked `.outside`
- [ ] Current date cell has `.today` class
- [ ] Month headings are normal case ("April 2026", not "APRIL 2026")
- [ ] No legend is rendered (the colors are self-explanatory)
- [ ] All text (bands, tags) is uppercase via CSS `text-transform`
- [ ] Calendar opens via the Canvas skill workflow
