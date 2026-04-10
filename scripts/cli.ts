#!/usr/bin/env node
/**
 * Flex UI CLI
 *
 * Usage:
 *   npx flex-ui           Interactive customization + CSS generation
 *   npx flex-ui --help    Show help
 */

import inquirer from "inquirer"
import figlet from "figlet"

const DEFAULTS = {
  breakpoints: { xs: 480, sm: 600, md: 720, lg: 960, xl: 1200 },
  unit: "8px",
  scale: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  named: { fourth: 0.25, half: 0.5 },
  output: "./flex-ui.css",
}

function parseUnit(unit: string): { value: number; suffix: string } | null {
  const match = unit.match(/^([\d.]+)(.+)$/)
  if (!match) return null
  return { value: parseFloat(match[1]), suffix: match[2] }
}

function deriveSpacing(unit: string): Record<string | number, string> {
  const parsed = parseUnit(unit)
  if (!parsed) throw new Error(`Invalid unit: ${unit}`)

  const spacing: Record<string | number, string> = {}

  for (const multiplier of DEFAULTS.scale) {
    const val = parsed.value * multiplier
    spacing[multiplier] = val === 0 ? "0" : `${val}${parsed.suffix}`
  }

  for (const [name, multiplier] of Object.entries(DEFAULTS.named)) {
    const val = parsed.value * multiplier
    spacing[name] = val === 0 ? "0" : `${val}${parsed.suffix}`
  }

  return spacing
}

function printBanner(): void {
  const banner = figlet.textSync("FLEX-UI", {
    font: "ANSI Shadow",
  })
  console.log()
  console.log(banner)
  console.log()
}

async function run(): Promise<void> {
  printBanner()

  // Breakpoints
  console.log("📱 Breakpoints\n")
  const bpAnswers = await inquirer.prompt(
    Object.entries(DEFAULTS.breakpoints).map(([name, defaultVal]) => ({
      type: "input" as const,
      name,
      message: `${name} (px)`,
      default: String(defaultVal),
      validate: (val: string) => {
        const n = parseInt(val, 10)
        return isNaN(n) || n < 0 ? "Enter a valid positive number" : true
      },
    })),
  )

  const breakpoints: Record<string, number> = {}
  for (const [name, val] of Object.entries(bpAnswers)) {
    breakpoints[name] = parseInt(val as string, 10)
  }

  // Breakpoints summary table
  console.log()
  const bpTable: Record<string, string> = {}
  for (const [name, val] of Object.entries(breakpoints)) {
    bpTable[name] = `${val}px`
  }
  console.table(bpTable)

  // Spacing
  console.log("\n📏 Spacing\n")
  const { unit } = await inquirer.prompt([
    {
      type: "input",
      name: "unit",
      message: "Base unit",
      default: DEFAULTS.unit,
      validate: (val: string) => {
        return parseUnit(val) ? true : 'Use a format like "8px" or "0.5rem"'
      },
    },
  ])

  // Preview derived scale
  const spacing = deriveSpacing(unit)
  console.log()
  const scaleTable: Record<string, string> = {}
  for (const [key, val] of Object.entries(spacing)) {
    scaleTable[key] = val
  }
  console.table(scaleTable)

  // Output
  console.log()
  const { output } = await inquirer.prompt([
    {
      type: "input",
      name: "output",
      message: "Output path",
      default: DEFAULTS.output,
    },
  ])

  // Generate
  console.log()
  const { generate } = await import("./generate-flex-css.js")
  await generate(process.cwd(), {
    breakpoints,
    spacing,
    output,
  })
}

function printHelp(): void {
  printBanner()
  console.log(`  Usage:`)
  console.log(
    `    npx flex-ui             Interactive customization + CSS generation`,
  )
  console.log(`    npx flex-ui --help      Show this help`)
  console.log()
  console.log(`  Walks you through customizing breakpoints and spacing,`)
  console.log(`  then generates a CSS file for both React and CSS-only usage.`)
  console.log()
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === "help" || command === "--help" || command === "-h") {
    printHelp()
    return
  }

  if (command) {
    console.error(`Unknown command: ${command}`)
    printHelp()
    process.exit(1)
  }

  await run()
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
