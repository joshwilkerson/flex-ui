/**
 * Design Tokens - Single Source of Truth
 *
 * All breakpoints, spacing values, and property options are defined here.
 * Both the React component and CSS-only version are generated from these values.
 */

import {
  defaultConfig,
  defaultSpacingConfig,
  namedSpacing,
  resolveSpacing,
} from "../config"

// Breakpoints (min-width values in pixels)
export const breakpoints = defaultConfig.breakpoints

export type Breakpoint = keyof typeof breakpoints
export const breakpointKeys = Object.keys(breakpoints) as Breakpoint[]

// Spacing scale configuration
export const spacingConfig = defaultSpacingConfig

// Resolved spacing values (generated from unit + scale + named)
export const spacing: Record<string | number, string> = {
  ...resolveSpacing(spacingConfig),
  ...namedSpacing,
}

export type SpacingValue =
  | (typeof spacingConfig.scale)[number]
  | keyof typeof namedSpacing
export const spacingKeys: (string | number)[] = [
  ...spacingConfig.scale,
  ...Object.keys(namedSpacing),
]

// Axis values (maps to flex-direction)
export const axis = ["horizontal", "vertical"] as const
export type AxisValue = (typeof axis)[number]

export const axisToDirection: Record<AxisValue, string> = {
  horizontal: "row",
  vertical: "column",
}

// Justify values (maps to justify-content)
export const justify = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly",
] as const
export type JustifyValue = (typeof justify)[number]

export const justifyToCSS: Record<JustifyValue, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
}

// Align values (maps to align-items)
export const align = ["start", "end", "center", "stretch", "baseline"] as const
export type AlignValue = (typeof align)[number]

export const alignToCSS: Record<AlignValue, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
}

// Wrap values (maps to flex-wrap)
export const wrap = ["nowrap", "wrap", "wrap-reverse"] as const
export type WrapValue = (typeof wrap)[number]

// Align Content values (for multi-line flex containers)
export const alignContent = [
  "start",
  "end",
  "center",
  "stretch",
  "between",
  "around",
  "evenly",
] as const
export type AlignContentValue = (typeof alignContent)[number]

export const alignContentToCSS: Record<AlignContentValue, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
}

// Flex item values for StackItem
export const alignSelf = [
  "auto",
  "start",
  "end",
  "center",
  "stretch",
  "baseline",
] as const
export type AlignSelfValue = (typeof alignSelf)[number]

export const alignSelfToCSS: Record<AlignSelfValue, string> = {
  auto: "auto",
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
}
