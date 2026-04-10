/**
 * Flex UI Configuration
 *
 * Consumers can create a flex.config.ts file to customize
 * breakpoints, spacing, and output path for CSS generation.
 */

export interface SpacingConfig {
  /**
   * Base spacing unit (e.g., "4px", "0.25rem", "1rem")
   * Each spacing step will be a multiple of this value
   */
  unit: string

  /**
   * Multipliers for each spacing step
   * @example [0, 1, 2, 3, 4, 6, 8, 12, 16] generates 0, 4px, 8px, 12px, ...
   */
  scale: number[]
}

export interface FlexConfig {
  /**
   * Custom breakpoints (min-width in pixels)
   * @example { sm: 640, md: 768, lg: 1024, xl: 1280 }
   */
  breakpoints?: Record<string, number>

  /**
   * Custom spacing - either explicit values or unit + multipliers
   * @example { unit: '4px', scale: [0, 1, 2, 3, 4, 6, 8] }
   * @example { 0: '0', 1: '0.25rem', 2: '0.5rem', 4: '1rem' }
   */
  spacing?: SpacingConfig | Record<string | number, string>

  /**
   * Output file path for generated CSS (relative to cwd)
   * @default "./flex-ui.css"
   */
  output?: string
}

/**
 * Check if spacing config uses unit + scale format
 */
export function isSpacingWithUnit(
  spacing: SpacingConfig | Record<string | number, string>,
): spacing is SpacingConfig {
  return "unit" in spacing && "scale" in spacing
}

/**
 * Resolve spacing config to final key-value pairs
 */
export function resolveSpacing(
  spacing: SpacingConfig | Record<string | number, string>,
): Record<string | number, string> {
  if (!isSpacingWithUnit(spacing)) {
    return spacing
  }

  const { unit, scale } = spacing
  const unitMatch = unit.match(/^([\d.]+)(.+)$/)

  if (!unitMatch) {
    throw new Error(
      `Invalid spacing unit: ${unit}. Expected format like "4px" or "0.25rem"`,
    )
  }

  const unitValue = parseFloat(unitMatch[1])
  const unitSuffix = unitMatch[2]

  const resolved: Record<number, string> = {}
  for (const multiplier of scale) {
    const value = unitValue * multiplier
    resolved[multiplier] = value === 0 ? "0" : `${value}${unitSuffix}`
  }

  return resolved
}

/**
 * Default spacing using unit + scale format
 */
export const defaultSpacingConfig: SpacingConfig = {
  unit: "8px",
  scale: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}

/**
 * Additional named spacing values
 */
export const namedSpacing: Record<string, string> = {
  fourth: "2px",
  half: "4px",
}

/**
 * Default configuration values
 */
export const defaultConfig = {
  breakpoints: {
    xs: 480,
    sm: 600,
    md: 720,
    lg: 960,
    xl: 1200,
  },
  spacing: defaultSpacingConfig,
  output: "./flex-ui.css",
} as const satisfies Required<FlexConfig>

export type DefaultBreakpoint = keyof typeof defaultConfig.breakpoints
export type DefaultSpacing = (typeof defaultSpacingConfig.scale)[number]
