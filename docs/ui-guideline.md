# UI and UX Guidelines - Family Finance

This document provides style definitions, layout architecture, and component usage instructions to build a modern, clean, and responsive user interface for **Family Finance** using **shadcn/ui** and **Tailwind CSS**.

---

## 1. Core Visual Tokens

### 1.1. Color Palette (Sleek Zinc & Emerald Accent)
A premium dark/light adaptive slate-and-emerald palette focused on financial clarity.

| Variable | Tailwind Equivalent | Light Mode HEX | Dark Mode HEX | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Background** | `bg-background` | `#FFFFFF` | `#09090B` (Zinc-950) | Main viewport backdrop |
| **Card** | `bg-card` | `#F4F4F5` | `#18181B` (Zinc-900) | Content containers, boards |
| **Border** | `border-border` | `#E4E4E7` | `#27272A` (Zinc-800) | Dividers, boundaries |
| **Primary** | `text-primary` | `#09090B` | `#FAFAFA` | Dominant text, active states |
| **Secondary** | `text-muted-foreground`| `#71717A` | `#A1A1AA` | Labels, subtitles, hints |
| **Accent / Gain** | `text-emerald-500` | `#059669` | `#10B981` | Income metrics, progress bars |
| **Destructive / Loss** | `text-destructive` | `#DC2626` | `#EF4444` | Expense metrics, over-budget tags |

### 1.2. Typography
- **Primary Font Family**: `Inter` (Fallback: `sans-serif`)
- **Scale**:
  - `h1`: `text-3xl font-extrabold tracking-tight` (Page Titles)
  - `h2`: `text-xl font-semibold tracking-tight` (Section Headers)
  - `h3`: `text-lg font-medium` (Card Headers)
  - `body`: `text-sm font-normal text-muted-foreground` (General UI text)
  - `number`: `font-mono font-semibold` (Financial ledgers, balances)

### 1.3. Spacing & Grid System
- Standard padding increments (Tailwind scale):
  - Card inner padding: `p-6` (1.5rem)
  - Layout spacing: `gap-6` (1.5rem)
  - List item vertical spacing: `space-y-3` (0.75rem)
  - Touch target margins: `m-2` (0.5rem)

---

## 2. Layout & Navigation

### 2.1. Responsive Rules
- **Mobile First Viewport**: Below `768px` (`md` breakpoint), the navigation shifts from a permanent left Sidebar to a bottom Nav Bar or collapsible Drawer sheet.
- **Grid Layout Rules**:
  - Mobile: Single column.
  - Tablet (`md`): 2 columns.
  - Desktop (`lg` / `xl`): 3 columns for main metrics, single wide column for transaction sheets.

### 2.2. Dashboard Sidebar (Desktop)
A clean vertical sidebar containing:
1. **Brand Header**: "Family Finance" (Logo + Small icon).
2. **Navigation Items**:
   - Dashboard (`/`)
   - Accounts (`/accounts`)
   - Categories (`/categories`)
   - Transactions (`/transactions`)
   - Budgets (`/budgets`)
   - Saving Goals (`/saving-goals`)
   - Reports (`/reports`)
3. **Footer**: User profile capsule (Email, Log Out button).

### 2.3. Navigation Bar (Mobile / Tablet)
- Fixed bottom sticky bar containing high-frequency icons:
  - Home (Dashboard)
  - Plus Icon (Opens "Quick Transaction" Drawer)
  - Transactions list
  - Settings (Menu for Accounts, Categories, Saving Goals, Log Out).

---

## 3. UI Component Specifications (via shadcn/ui)

### 3.1. Cards (`shadcn/ui/card`)
Used to display account info, budgets, goals, and aggregate dashboard metrics.
* **Layout Structure**:
  - Header: Left-aligned bold label, right-aligned secondary icon.
  - Content: Large mono-spaced monetary text (e.g. `Rp 15.000.000`).
  - Footer: Small helper text or percentage delta changes.
* **Interactive Hover States**: Subtle border color highlight (`hover:border-zinc-500 dark:hover:border-zinc-400 transition-colors`).

```tsx
<Card className="transition-colors hover:border-zinc-400">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
    <Wallet className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold font-mono">Rp 15.350.000,00</div>
    <p className="text-xs text-emerald-500 font-medium">+12.5% from last month</p>
  </CardContent>
</Card>
```

### 3.2. Tables (`shadcn/ui/table`)
Utilized for listing transaction ledgers.
* **Requirements**:
  - Scrollable container for mobile sizing.
  - Column alignment: Names/descriptions are left-aligned; Dates are centered; Amounts are right-aligned using monospaced font.
  - Alternating row borders with clean hover background triggers (`hover:bg-muted/50`).

### 3.3. Dialogs & Drawers (`shadcn/ui/dialog` & `shadcn/ui/drawer`)
* **Responsive Dialog Behavior**:
  - When viewed on **Desktop**, edit/creation forms must open inside a centered `<Dialog>` modal.
  - When viewed on **Mobile**, forms must slide up from the bottom inside a `<Drawer>` sheet.

### 3.4. Form Elements & Fields (`shadcn/ui/form` + `react-hook-form` + `zod`)
* **Input Elements**:
  - Number fields for currency must align to the right side of the field with a leading currency sign pre-appended.
  - Date picker (`Popover` containing `Calendar`) for flexible data entry.
  - Select components with clear icons representing account types or category tags.
* **Validation Feedback**: Invalid fields trigger a border color shift to red (`border-destructive`) and display inline warning text.

---

## 4. Key Page Layouts

### 4.1. Dashboard Layout
```
+------------------------------------------------------------+
|  Sidebar   |  HEADER: Welcome, Family!           [Log Out] |
|            |                                               |
|  Dashboard |  +-----------------------------------------+  |
|  Accounts  |  | Total Balance  | Income        | Expense|  |
|  Transact. |  | Rp 15M         | Rp 25M        | Rp 450K|  |
|  Budgets   |  +-----------------------------------------+  |
|  Goals     |                                               |
|  Reports   |  +---------------------+ +-----------------+  |
|            |  | Budget Tracker      | | Expense Chart   |  |
|            |  | Groceries: 22% spent| | [Donut Chart]   |  |
|            |  +---------------------+ +-----------------+  |
|            |                                               |
|            |  +-----------------------------------------+  |
|            |  | Recent Transactions                     |  |
|            |  | - Groceries (Rp 450.000)   2026-07-22   |  |
|            |  +-----------------------------------------+  |
+------------+-----------------------------------------------+
```

### 4.2. Transaction Form Layout
* Dynamic fields according to chosen `type` tab (`Income`, `Expense`, or `Transfer`):
  - Selecting **Transfer** hides the "Category" selector and replaces the single "Account" selector with "Source Account" and "Destination Account" pickers.
  - Selecting **Income** hides the "Source Account" selector.
  - Selecting **Expense** hides the "Destination Account" selector.
