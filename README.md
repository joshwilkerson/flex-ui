# flex-ui

CSS-first responsive flexbox layouts using data attributes. Works with plain HTML or as React components.

## Install

```bash
npm install flex-ui
```

## CSS-Only Usage

Include the CSS and use data attributes directly on your HTML:

```html
<link rel="stylesheet" href="node_modules/flex-ui/dist/flex-ui.css" />

<div data-flex data-axis="horizontal" data-gap="2" data-align="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flex Container

Add the `data-flex` attribute and configure with data attributes:

| Attribute | Values | Description |
|---|---|---|
| `data-axis` | `horizontal`, `vertical` | Flex direction |
| `data-gap` | `0`-`10`, `half`, `fourth` | Gap between items |
| `data-row-gap` | `0`-`10`, `half`, `fourth` | Row gap |
| `data-column-gap` | `0`-`10`, `half`, `fourth` | Column gap |
| `data-justify` | `start`, `end`, `center`, `between`, `around`, `evenly` | Main axis alignment |
| `data-align` | `start`, `end`, `center`, `stretch`, `baseline` | Cross axis alignment |
| `data-align-content` | `start`, `end`, `center`, `stretch`, `between`, `around`, `evenly` | Multi-line alignment |
| `data-wrap` | `nowrap`, `wrap`, `wrap-reverse` | Wrap behavior |
| `data-reverse` | (boolean) | Reverse direction |
| `data-inline` | (boolean) | Use `inline-flex` |

### Flex Item

Add the `data-flex-item` attribute to children for additional control:

| Attribute | Values | Description |
|---|---|---|
| `data-grow` | `0`-`5` | Flex grow |
| `data-shrink` | `0`-`3` | Flex shrink |
| `data-basis` | `auto`, `0`, `full`, `1/2`, `1/3`, `2/3`, `1/4`, `3/4` | Flex basis |
| `data-align-self` | `auto`, `start`, `end`, `center`, `stretch`, `baseline` | Override container alignment |
| `data-order` | `1`-`12`, `first`, `last`, `none` | Visual order |

### Responsive

Append a breakpoint suffix to any attribute for responsive behavior:

```html
<!-- Vertical on mobile, horizontal from md up -->
<div data-flex data-axis="vertical" data-axis-md="horizontal" data-gap="1" data-gap-lg="3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

Breakpoints: `xs` (480px), `sm` (600px), `md` (720px), `lg` (960px), `xl` (1200px)

## React Components

Optional React wrapper that outputs the same data attributes:

```tsx
import { Flex, FlexItem } from "flex-ui/react"
import "flex-ui" // include the CSS

<Flex axis="horizontal" gap={2} align="center">
  <FlexItem grow={1}>Main</FlexItem>
  <FlexItem basis="1/4">Sidebar</FlexItem>
</Flex>
```

Props accept responsive objects:

```tsx
<Flex
  axis={{ base: "vertical", md: "horizontal" }}
  gap={{ base: 1, lg: 3 }}
>
  <FlexItem basis={{ base: "full", md: "1/2" }}>Half</FlexItem>
  <FlexItem basis={{ base: "full", md: "1/2" }}>Half</FlexItem>
</Flex>
```

## Spacing Scale

The default spacing scale uses an 8px base unit:

| Key | Value |
|---|---|
| `0` | 0 |
| `fourth` | 2px |
| `half` | 4px |
| `1` | 8px |
| `2` | 16px |
| `3` | 24px |
| `4` | 32px |
| `5` | 40px |
| `6` | 48px |
| `7` | 56px |
| `8` | 64px |
| `9` | 72px |
| `10` | 80px |

Override spacing at runtime with CSS custom properties:

```css
:root {
  --flex-spacing-2: 1rem;
  --flex-spacing-half: 0.125rem;
}
```

## Customization

Generate a custom CSS file with your own breakpoints and spacing:

```bash
npx flex-ui
```

The interactive CLI walks you through:

1. Adjusting breakpoint values (xs, sm, md, lg, xl)
2. Setting a base spacing unit (e.g., `4px`, `0.5rem`)
3. Choosing an output path

The generated CSS replaces the default `flex-ui.css` with your custom values.

## License

MIT
