import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { generateCSS } from '../src/generate-css'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const flexCSS = generateCSS()

const SCREENSHOTS_DIR = path.resolve(__dirname, '../test-results/screenshots')

/** Wrap HTML content with flex.css loaded inline */
function flexPage(body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    ${flexCSS}
    /* Test helpers */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .box {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      font: bold 14px sans-serif;
      color: #fff;
      border-radius: 6px;
    }
    .box:nth-child(1) { background: #3b82f6; }
    .box:nth-child(2) { background: #8b5cf6; }
    .box:nth-child(3) { background: #ec4899; }
    .box:nth-child(4) { background: #f59e0b; }
    body { padding: 20px; background: #f8fafc; }
    .label { font: 12px monospace; color: #64748b; margin-bottom: 8px; }
  </style>
</head>
<body>${body}</body>
</html>`
}

type Box = { x: number; y: number; width: number; height: number; right: number; bottom: number }

/** Get bounding rects for all children of a selector */
async function getChildRects(page: import('@playwright/test').Page, selector: string): Promise<Box[]> {
  return page.evaluate((sel) => {
    const parent = document.querySelector(sel)!
    return Array.from(parent.children).filter(el => !el.classList.contains('label')).map((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }
    })
  }, selector)
}

// Ensure screenshot dir exists
test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
})

async function screenshot(page: import('@playwright/test').Page, name: string) {
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}.png`), fullPage: true })
}

// ─── Axis ────────────────────────────────────────────────────────

test('horizontal axis: children in a row', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-gap="2">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  // All on the same row
  expect(rects[0].y).toBe(rects[1].y)
  expect(rects[1].y).toBe(rects[2].y)
  // Each child to the right of the previous
  expect(rects[1].x).toBeGreaterThan(rects[0].right - 1)
  expect(rects[2].x).toBeGreaterThan(rects[1].right - 1)

  await screenshot(page, '01-horizontal')
})

test('vertical axis: children stacked', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="vertical" data-gap="2">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  // All in the same column
  expect(rects[0].x).toBe(rects[1].x)
  expect(rects[1].x).toBe(rects[2].x)
  // Each child below the previous
  expect(rects[1].y).toBeGreaterThan(rects[0].bottom - 1)
  expect(rects[2].y).toBeGreaterThan(rects[1].bottom - 1)

  await screenshot(page, '02-vertical')
})

// ─── Gap ─────────────────────────────────────────────────────────

test('gap spacing is correct', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-gap="3">
      <div class="box">1</div>
      <div class="box">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const gap = rects[1].x - rects[0].right
  // gap="3" = 24px (--flex-spacing-3)
  expect(gap).toBeCloseTo(24, 0)

  await screenshot(page, '03-gap-24px')
})

test('gap 0 means no space', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-gap="0">
      <div class="box">1</div>
      <div class="box">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const gap = rects[1].x - rects[0].right
  expect(gap).toBeCloseTo(0, 0)

  await screenshot(page, '04-gap-0')
})

test('large gap', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-gap="8">
      <div class="box">1</div>
      <div class="box">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const gap = rects[1].x - rects[0].right
  // gap="8" = 64px (--flex-spacing-8)
  expect(gap).toBeCloseTo(64, 0)

  await screenshot(page, '05-gap-64px')
})

test('named gap "half" = 4px', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-gap="half">
      <div class="box">1</div>
      <div class="box">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const gap = rects[1].x - rects[0].right
  expect(gap).toBeCloseTo(4, 0)

  await screenshot(page, '05a-gap-half')
})

test('named gap "fourth" = 2px', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-gap="fourth">
      <div class="box">1</div>
      <div class="box">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const gap = rects[1].x - rects[0].right
  expect(gap).toBeCloseTo(2, 0)

  await screenshot(page, '05b-gap-fourth')
})

// ─── Justify ─────────────────────────────────────────────────────

test('justify center', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 200 })
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-justify="center" data-gap="2" style="width:100%">
      <div class="box">1</div>
      <div class="box">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const parentRect = await page.evaluate(() => document.querySelector('[data-flex]')!.getBoundingClientRect())
  const childrenCenter = (rects[0].x + rects[rects.length - 1].right) / 2
  const parentCenter = (parentRect.x + parentRect.right) / 2
  expect(childrenCenter).toBeCloseTo(parentCenter, 0)

  await screenshot(page, '06-justify-center')
})

test('justify between', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 200 })
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-justify="between" style="width:100%">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const parentRect = await page.evaluate(() => document.querySelector('[data-flex]')!.getBoundingClientRect())
  // First child at start, last at end
  expect(rects[0].x).toBeCloseTo(parentRect.x, 0)
  expect(rects[2].right).toBeCloseTo(parentRect.right, 0)
  // Equal spacing between items
  const gap1 = rects[1].x - rects[0].right
  const gap2 = rects[2].x - rects[1].right
  expect(gap1).toBeCloseTo(gap2, 0)

  await screenshot(page, '07-justify-between')
})

// ─── Align ───────────────────────────────────────────────────────

test('align center', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-align="center" data-gap="2" style="height:200px; background:#e2e8f0; border-radius:8px;">
      <div class="box" style="height:40px">S</div>
      <div class="box" style="height:80px">M</div>
      <div class="box" style="height:60px">L</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const parentRect = await page.evaluate(() => document.querySelector('[data-flex]')!.getBoundingClientRect())
  const parentCenterY = parentRect.y + parentRect.height / 2
  // Each child's vertical center should be near the parent's center
  for (const r of rects) {
    const childCenterY = r.y + r.height / 2
    expect(childCenterY).toBeCloseTo(parentCenterY, 0)
  }

  await screenshot(page, '08-align-center')
})

test('align stretch', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-align="stretch" data-gap="2" style="height:200px; background:#e2e8f0; border-radius:8px;">
      <div class="box" style="height:auto">1</div>
      <div class="box" style="height:auto">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  const parentRect = await page.evaluate(() => document.querySelector('[data-flex]')!.getBoundingClientRect())
  // Children should stretch to full parent height
  for (const r of rects) {
    expect(r.height).toBeCloseTo(parentRect.height, 0)
  }

  await screenshot(page, '09-align-stretch')
})

// ─── Wrap ────────────────────────────────────────────────────────

test('wrap: items flow to next line', async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 400 })
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-wrap="wrap" data-gap="2" style="width:300px;">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
      <div class="box">4</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  // With 80px boxes + 16px gap in 300px container: 3 fit on first row, 4th wraps
  // At minimum, not all items should be on the same row
  const rows = new Set(rects.map(r => Math.round(r.y)))
  expect(rows.size).toBeGreaterThan(1)

  await screenshot(page, '10-wrap')
})

// ─── Reverse ─────────────────────────────────────────────────────

test('reverse: horizontal items in reverse order', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-reverse data-gap="2">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  // DOM order is 1,2,3 but visually 3 should be leftmost
  expect(rects[0].x).toBeGreaterThan(rects[1].x)
  expect(rects[1].x).toBeGreaterThan(rects[2].x)

  await screenshot(page, '11-reverse')
})

// ─── FlexItem ────────────────────────────────────────────────────

test('flex-item grow: item fills remaining space', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 200 })
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" style="width:100%">
      <div data-flex-item box" data-grow="0" style="width:auto">1</div>
      <div data-flex-item box" data-grow="1" style="width:auto">2</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  // Second item should be wider than the first (it grows)
  expect(rects[1].width).toBeGreaterThan(rects[0].width)

  await screenshot(page, '12-grow')
})

test('flex-item basis: 1/2 splits evenly', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 200 })
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" style="width:560px">
      <div data-flex-item box" data-basis="1/2" style="width:auto">A</div>
      <div data-flex-item box" data-basis="1/2" style="width:auto">B</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  expect(rects[0].width).toBeCloseTo(rects[1].width, 0)
  expect(rects[0].width).toBeCloseTo(280, 0)

  await screenshot(page, '13-basis-half')
})

test('flex-item order', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-gap="2">
      <div data-flex-item box" data-order="3">A</div>
      <div data-flex-item box" data-order="1">B</div>
      <div data-flex-item box" data-order="2">C</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  // DOM: A(order 3), B(order 1), C(order 2)
  // Visual: B, C, A — so B is leftmost
  // rects[0]=A, rects[1]=B, rects[2]=C
  expect(rects[1].x).toBeLessThan(rects[2].x) // B before C
  expect(rects[2].x).toBeLessThan(rects[0].x) // C before A

  await screenshot(page, '14-order')
})

// ─── Row Gap / Column Gap ────────────────────────────────────────

test('rowGap and columnGap', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="horizontal" data-wrap="wrap" data-row-gap="4" data-column-gap="1" style="width:200px;">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>
  `))

  const rects = await getChildRects(page, '[data-flex]')
  // Items on the same row: column gap = 8px (spacing-1)
  if (rects[0].y === rects[1].y) {
    const colGap = rects[1].x - rects[0].right
    expect(colGap).toBeCloseTo(8, 0)
  }
  // Items on different rows: row gap = 32px (spacing-4)
  const rows = [...new Set(rects.map(r => Math.round(r.y)))].sort((a, b) => a - b)
  if (rows.length > 1) {
    const firstRowBottom = Math.max(...rects.filter(r => Math.round(r.y) === rows[0]).map(r => r.bottom))
    const secondRowTop = Math.min(...rects.filter(r => Math.round(r.y) === rows[1]).map(r => r.y))
    const rowGap = secondRowTop - firstRowBottom
    expect(rowGap).toBeCloseTo(32, 0)
  }

  await screenshot(page, '15-row-col-gap')
})

// ─── Inline ──────────────────────────────────────────────────────

test('inline: flex container is inline-flex', async ({ page }) => {
  await page.setContent(flexPage(`
    <span>Before</span>
    <div data-flex data-axis="horizontal" data-inline data-gap="1">
      <div class="box" style="width:40px;height:40px">1</div>
      <div class="box" style="width:40px;height:40px">2</div>
    </div>
    <span>After</span>
  `))

  const display = await page.evaluate(() =>
    getComputedStyle(document.querySelector('[data-flex]')!).display
  )
  expect(display).toBe('inline-flex')

  await screenshot(page, '16-inline')
})

// ─── Responsive (viewport resize) ───────────────────────────────

test('responsive axis: vertical on small, horizontal on md', async ({ page }) => {
  await page.setContent(flexPage(`
    <div data-flex data-axis="vertical" data-axis-md="horizontal" data-gap="2">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>
  `))

  // Small viewport — should be vertical
  await page.setViewportSize({ width: 400, height: 600 })
  await page.waitForTimeout(100)
  let rects = await getChildRects(page, '[data-flex]')
  expect(rects[0].x).toBe(rects[1].x) // same column
  expect(rects[1].y).toBeGreaterThan(rects[0].bottom - 1)

  await screenshot(page, '17-responsive-small')

  // Wide viewport (≥720px md breakpoint) — should be horizontal
  await page.setViewportSize({ width: 800, height: 600 })
  await page.waitForTimeout(100)
  rects = await getChildRects(page, '[data-flex]')
  expect(rects[0].y).toBe(rects[1].y) // same row
  expect(rects[1].x).toBeGreaterThan(rects[0].right - 1)

  await screenshot(page, '18-responsive-wide')
})

// ─── Screenshot Grid Generation ─────────────────────────────────

test.afterAll(async () => {
  const files = fs.readdirSync(SCREENSHOTS_DIR)
    .filter(f => f.endsWith('.png'))
    .sort()

  if (files.length === 0) return

  const cards = files.map(f => {
    const name = f.replace('.png', '').replace(/^\d+-/, '')
    return `
      <div class="card">
        <img src="${f}" />
        <div class="caption">${name}</div>
      </div>`
  }).join('\n')

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Flex UI — Visual Test Grid</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px; }
    h1 { font-size: 24px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .card {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #334155;
    }
    .card img { width: 100%; display: block; }
    .caption {
      padding: 10px 14px;
      font-size: 13px;
      font-family: monospace;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <h1>Flex UI — Visual Test Grid</h1>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`

  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'grid.html'), html)
  console.log(`\n📸 Screenshot grid: test-results/screenshots/grid.html\n`)
})
