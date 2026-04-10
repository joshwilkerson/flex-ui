import type { Breakpoint } from "../../tokens"

// Types for responsive props
type ResponsiveValue<T> = T | ({ base: T } & Partial<Record<Breakpoint, T>>)

type AxisValue = "horizontal" | "vertical"
type SpacingValue = number | `${number}` | "half" | "fourth"
type JustifyValue = "start" | "end" | "center" | "between" | "around" | "evenly"
type AlignValue = "start" | "end" | "center" | "stretch" | "baseline"
type AlignContentValue =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "between"
  | "around"
  | "evenly"
type WrapValue = "nowrap" | "wrap" | "wrap-reverse"
type AlignSelfValue =
  | "auto"
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "baseline"

export interface FlexProps {
  /** HTML element to render as */
  as?: keyof React.JSX.IntrinsicElements
  /** Flex axis direction */
  axis?: ResponsiveValue<AxisValue>
  /** Gap between items */
  gap?: ResponsiveValue<SpacingValue>
  /** Row gap (overrides gap for rows) */
  rowGap?: ResponsiveValue<SpacingValue>
  /** Column gap (overrides gap for columns) */
  columnGap?: ResponsiveValue<SpacingValue>
  /** Main axis alignment */
  justify?: ResponsiveValue<JustifyValue>
  /** Cross axis alignment */
  align?: ResponsiveValue<AlignValue>
  /** Multi-line alignment */
  alignContent?: ResponsiveValue<AlignContentValue>
  /** Wrap behavior */
  wrap?: ResponsiveValue<WrapValue>
  /** Reverse direction */
  reverse?: boolean
  /** Use inline-flex */
  inline?: boolean
  /** Additional CSS classes */
  className?: string
  /** Child elements */
  children: React.ReactNode
  /** Click handler */
  onClick?: () => void
}

/**
 * Convert a responsive prop to data-attributes
 */
function toDataAttrs<T>(
  name: string,
  value: ResponsiveValue<T> | undefined,
): Record<string, string> {
  if (value === undefined) return {}

  const attrs: Record<string, string> = {}

  if (typeof value === "object" && value !== null && "base" in value) {
    // Responsive object
    attrs[`data-${name}`] = String(value.base)
    const breakpoints: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"]
    for (const bp of breakpoints) {
      if (value[bp] !== undefined) {
        attrs[`data-${name}-${bp}`] = String(value[bp])
      }
    }
  } else {
    // Simple value
    attrs[`data-${name}`] = String(value)
  }

  return attrs
}

export function Flex({
  as: Component = "div",
  axis,
  gap,
  rowGap,
  columnGap,
  justify,
  align,
  alignContent,
  wrap,
  reverse,
  inline,
  className = "",
  children,
  onClick,
}: FlexProps) {
  const dataAttrs: Record<string, string | undefined> = {
    ...toDataAttrs("axis", axis),
    ...toDataAttrs("gap", gap),
    ...toDataAttrs("row-gap", rowGap),
    ...toDataAttrs("column-gap", columnGap),
    ...toDataAttrs("justify", justify),
    ...toDataAttrs("align", align),
    ...toDataAttrs("align-content", alignContent),
    ...toDataAttrs("wrap", wrap),
    ...(reverse ? { "data-reverse": "" } : {}),
    ...(inline ? { "data-inline": "" } : {}),
  }

  return (
    <Component
      data-flex=""
      className={className || undefined}
      {...dataAttrs}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

Flex.displayName = "Flex"

// FlexItem types
export interface FlexItemProps {
  /** HTML element to render as */
  as?: keyof React.JSX.IntrinsicElements
  /** Flex grow factor */
  grow?: ResponsiveValue<number>
  /** Flex shrink factor */
  shrink?: ResponsiveValue<number>
  /** Flex basis */
  basis?: ResponsiveValue<string>
  /** Align self */
  alignSelf?: ResponsiveValue<AlignSelfValue>
  /** Order */
  order?: ResponsiveValue<number | "first" | "last" | "none">
  /** Additional CSS classes */
  className?: string
  /** Child elements */
  children: React.ReactNode
  /** Click handler */
  onClick?: () => void
}

export function FlexItem({
  as: Component = "div",
  grow,
  shrink,
  basis,
  alignSelf,
  order,
  className = "",
  children,
  onClick,
}: FlexItemProps) {
  const dataAttrs: Record<string, string> = {
    ...toDataAttrs("grow", grow),
    ...toDataAttrs("shrink", shrink),
    ...toDataAttrs("basis", basis),
    ...toDataAttrs("align-self", alignSelf),
    ...toDataAttrs("order", order),
  }

  return (
    <Component
      data-flex-item=""
      className={className || undefined}
      {...dataAttrs}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

FlexItem.displayName = "FlexItem"

// Re-export types
export type {
  ResponsiveValue,
  AxisValue,
  SpacingValue,
  JustifyValue,
  AlignValue,
  AlignContentValue,
  WrapValue,
  AlignSelfValue,
}
