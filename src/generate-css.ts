/**
 * CSS Generation - Pure function
 *
 * Generates the flex-ui.css content from tokens. No file I/O — just returns a string.
 * Used by: Vite plugin (build), CLI (consumers), tests.
 */

import {
  axis,
  axisToDirection,
  justify,
  justifyToCSS,
  align,
  alignToCSS,
  wrap,
  alignContent,
  alignContentToCSS,
  alignSelf,
  alignSelfToCSS,
  spacing as tokenSpacing,
  spacingKeys as tokenSpacingKeys,
} from "./tokens"
import { defaultConfig } from "./config"

const HEADER = `/**
 * Flex UI - CSS-only flexbox layouts
 *
 * Usage:
 *   <div data-flex data-axis="horizontal" data-gap="2" data-align="center">
 *     <div>Item 1</div>
 *     <div>Item 2</div>
 *   </div>
 *
 * Customize spacing by overriding CSS custom properties:
 *   :root {
 *     --flex-spacing-1: 0.5rem;
 *     --flex-spacing-2: 1rem;
 *   }
 */

`

interface ResolvedConfig {
  breakpoints: Record<string, number>
  breakpointKeys: string[]
  spacing: Record<string | number, string>
  spacingKeys: (string | number)[]
}

function resolveConfig(): ResolvedConfig {
  const breakpoints: Record<string, number> = { ...defaultConfig.breakpoints }

  return {
    breakpoints,
    breakpointKeys: Object.keys(breakpoints).sort(
      (a, b) => breakpoints[a] - breakpoints[b],
    ),
    spacing: tokenSpacing,
    spacingKeys: tokenSpacingKeys,
  }
}

export function generateCSS(): string {
  const config = resolveConfig()
  const { breakpoints, breakpointKeys, spacingKeys, spacing } = config

  let css = HEADER

  // Spacing tokens as CSS custom properties
  css += `/* ----- Spacing Tokens ----- */\n`
  css += `:root {\n`
  for (const key of spacingKeys) {
    css += `  --flex-spacing-${key}: ${spacing[key]};\n`
  }
  css += `}\n\n`

  // Base flex class
  css += `[data-flex] {\n  display: flex;\n}\n\n`
  css += `[data-flex][data-inline] {\n  display: inline-flex;\n}\n\n`

  // ===== BASE SELECTORS =====

  css += `/* ----- Axis ----- */\n`
  for (const value of axis) {
    css += `[data-flex][data-axis="${value}"] { flex-direction: ${axisToDirection[value]}; }\n`
    css += `[data-flex][data-axis="${value}"][data-reverse] { flex-direction: ${axisToDirection[value]}-reverse; }\n`
  }
  css += `\n`

  css += `/* ----- Gap ----- */\n`
  for (const key of spacingKeys) {
    css += `[data-flex][data-gap="${key}"] { gap: var(--flex-spacing-${key}); }\n`
  }
  css += `\n`

  css += `/* ----- Row Gap ----- */\n`
  for (const key of spacingKeys) {
    css += `[data-flex][data-row-gap="${key}"] { row-gap: var(--flex-spacing-${key}); }\n`
  }
  css += `\n`

  css += `/* ----- Column Gap ----- */\n`
  for (const key of spacingKeys) {
    css += `[data-flex][data-column-gap="${key}"] { column-gap: var(--flex-spacing-${key}); }\n`
  }
  css += `\n`

  css += `/* ----- Justify ----- */\n`
  for (const value of justify) {
    css += `[data-flex][data-justify="${value}"] { justify-content: ${justifyToCSS[value]}; }\n`
  }
  css += `\n`

  css += `/* ----- Align ----- */\n`
  for (const value of align) {
    css += `[data-flex][data-align="${value}"] { align-items: ${alignToCSS[value]}; }\n`
  }
  css += `\n`

  css += `/* ----- Align Content ----- */\n`
  for (const value of alignContent) {
    css += `[data-flex][data-align-content="${value}"] { align-content: ${alignContentToCSS[value]}; }\n`
  }
  css += `\n`

  css += `/* ----- Wrap ----- */\n`
  for (const value of wrap) {
    css += `[data-flex][data-wrap="${value}"] { flex-wrap: ${value}; }\n`
  }
  css += `\n`

  // ===== FLEX ITEM BASE SELECTORS =====

  css += `/* ----- Flex Item: Grow ----- */\n`
  for (let i = 0; i <= 5; i++) {
    css += `[data-flex-item][data-grow="${i}"] { flex-grow: ${i}; }\n`
  }
  css += `\n`

  css += `/* ----- Flex Item: Shrink ----- */\n`
  for (let i = 0; i <= 3; i++) {
    css += `[data-flex-item][data-shrink="${i}"] { flex-shrink: ${i}; }\n`
  }
  css += `\n`

  css += `/* ----- Flex Item: Basis ----- */\n`
  css += `[data-flex-item][data-basis="auto"] { flex-basis: auto; }\n`
  css += `[data-flex-item][data-basis="0"] { flex-basis: 0; }\n`
  css += `[data-flex-item][data-basis="full"] { flex-basis: 100%; }\n`
  css += `[data-flex-item][data-basis="1/2"] { flex-basis: 50%; }\n`
  css += `[data-flex-item][data-basis="1/3"] { flex-basis: 33.333333%; }\n`
  css += `[data-flex-item][data-basis="2/3"] { flex-basis: 66.666667%; }\n`
  css += `[data-flex-item][data-basis="1/4"] { flex-basis: 25%; }\n`
  css += `[data-flex-item][data-basis="3/4"] { flex-basis: 75%; }\n`
  css += `\n`

  css += `/* ----- Flex Item: Align Self ----- */\n`
  for (const value of alignSelf) {
    css += `[data-flex-item][data-align-self="${value}"] { align-self: ${alignSelfToCSS[value]}; }\n`
  }
  css += `\n`

  css += `/* ----- Flex Item: Order ----- */\n`
  css += `[data-flex-item][data-order="first"] { order: -9999; }\n`
  css += `[data-flex-item][data-order="last"] { order: 9999; }\n`
  css += `[data-flex-item][data-order="none"] { order: 0; }\n`
  for (let i = 1; i <= 12; i++) {
    css += `[data-flex-item][data-order="${i}"] { order: ${i}; }\n`
  }
  css += `\n`

  // ===== RESPONSIVE SELECTORS =====

  for (const bp of breakpointKeys) {
    const minWidth = breakpoints[bp]
    css += `/* ===== ${bp.toUpperCase()} (${minWidth}px) ===== */\n`
    css += `@media screen and (min-width: ${minWidth}px) {\n`

    for (const value of axis) {
      css += `  [data-flex][data-axis-${bp}="${value}"] { flex-direction: ${axisToDirection[value]}; }\n`
      css += `  [data-flex][data-axis-${bp}="${value}"][data-reverse] { flex-direction: ${axisToDirection[value]}-reverse; }\n`
    }

    for (const key of spacingKeys) {
      css += `  [data-flex][data-gap-${bp}="${key}"] { gap: var(--flex-spacing-${key}); }\n`
    }

    for (const key of spacingKeys) {
      css += `  [data-flex][data-row-gap-${bp}="${key}"] { row-gap: var(--flex-spacing-${key}); }\n`
    }

    for (const key of spacingKeys) {
      css += `  [data-flex][data-column-gap-${bp}="${key}"] { column-gap: var(--flex-spacing-${key}); }\n`
    }

    for (const value of justify) {
      css += `  [data-flex][data-justify-${bp}="${value}"] { justify-content: ${justifyToCSS[value]}; }\n`
    }

    for (const value of align) {
      css += `  [data-flex][data-align-${bp}="${value}"] { align-items: ${alignToCSS[value]}; }\n`
    }

    for (const value of alignContent) {
      css += `  [data-flex][data-align-content-${bp}="${value}"] { align-content: ${alignContentToCSS[value]}; }\n`
    }

    for (const value of wrap) {
      css += `  [data-flex][data-wrap-${bp}="${value}"] { flex-wrap: ${value}; }\n`
    }

    for (let i = 0; i <= 5; i++) {
      css += `  [data-flex-item][data-grow-${bp}="${i}"] { flex-grow: ${i}; }\n`
    }

    for (let i = 0; i <= 3; i++) {
      css += `  [data-flex-item][data-shrink-${bp}="${i}"] { flex-shrink: ${i}; }\n`
    }

    css += `  [data-flex-item][data-basis-${bp}="auto"] { flex-basis: auto; }\n`
    css += `  [data-flex-item][data-basis-${bp}="0"] { flex-basis: 0; }\n`
    css += `  [data-flex-item][data-basis-${bp}="full"] { flex-basis: 100%; }\n`
    css += `  [data-flex-item][data-basis-${bp}="1/2"] { flex-basis: 50%; }\n`
    css += `  [data-flex-item][data-basis-${bp}="1/3"] { flex-basis: 33.333333%; }\n`
    css += `  [data-flex-item][data-basis-${bp}="2/3"] { flex-basis: 66.666667%; }\n`
    css += `  [data-flex-item][data-basis-${bp}="1/4"] { flex-basis: 25%; }\n`
    css += `  [data-flex-item][data-basis-${bp}="3/4"] { flex-basis: 75%; }\n`

    for (const value of alignSelf) {
      css += `  [data-flex-item][data-align-self-${bp}="${value}"] { align-self: ${alignSelfToCSS[value]}; }\n`
    }

    css += `  [data-flex-item][data-order-${bp}="first"] { order: -9999; }\n`
    css += `  [data-flex-item][data-order-${bp}="last"] { order: 9999; }\n`
    css += `  [data-flex-item][data-order-${bp}="none"] { order: 0; }\n`
    for (let i = 1; i <= 12; i++) {
      css += `  [data-flex-item][data-order-${bp}="${i}"] { order: ${i}; }\n`
    }

    css += `}\n\n`
  }

  return css
}
