import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Flex, FlexItem } from '../src/components/Flex'

describe('Flex', () => {
  it('renders with data-flex attribute', () => {
    const { container } = render(<Flex>content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-flex', '')
  })

  it('renders as div by default', () => {
    const { container } = render(<Flex>content</Flex>)
    expect(container.firstChild!.nodeName).toBe('DIV')
  })

  it('renders as a different element with as prop', () => {
    const { container } = render(<Flex as="ul">content</Flex>)
    expect(container.firstChild!.nodeName).toBe('UL')
    expect(container.firstChild).toHaveAttribute('data-flex', '')
  })

  it('renders as nav', () => {
    const { container } = render(<Flex as="nav">content</Flex>)
    expect(container.firstChild!.nodeName).toBe('NAV')
  })

  it('renders children', () => {
    const { getByText } = render(<Flex><span>hello</span></Flex>)
    expect(getByText('hello')).toBeInTheDocument()
  })

  it('sets data-axis', () => {
    const { container } = render(<Flex axis="horizontal">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-axis', 'horizontal')
  })

  it('sets data-gap', () => {
    const { container } = render(<Flex gap={2}>content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-gap', '2')
  })

  it('sets data-gap with named spacing "half"', () => {
    const { container } = render(<Flex gap="half">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-gap', 'half')
  })

  it('sets data-gap with named spacing "fourth"', () => {
    const { container } = render(<Flex gap="fourth">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-gap', 'fourth')
  })

  it('sets data-row-gap and data-column-gap', () => {
    const { container } = render(<Flex rowGap={3} columnGap={1}>content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-row-gap', '3')
    expect(container.firstChild).toHaveAttribute('data-column-gap', '1')
  })

  it('sets data-justify', () => {
    const { container } = render(<Flex justify="between">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-justify', 'between')
  })

  it('sets data-align', () => {
    const { container } = render(<Flex align="center">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-align', 'center')
  })

  it('sets data-align-content', () => {
    const { container } = render(<Flex alignContent="evenly">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-align-content', 'evenly')
  })

  it('sets data-wrap', () => {
    const { container } = render(<Flex wrap="wrap">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-wrap', 'wrap')
  })

  it('sets data-reverse', () => {
    const { container } = render(<Flex reverse>content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-reverse', '')
  })

  it('sets data-inline', () => {
    const { container } = render(<Flex inline>content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-inline', '')
  })

  it('passes className', () => {
    const { container } = render(<Flex className="custom">content</Flex>)
    expect(container.firstChild).toHaveAttribute('data-flex', '')
    expect(container.firstChild).toHaveClass('custom')
  })

  it('forwards onClick', () => {
    const onClick = jest.fn()
    const { container } = render(<Flex onClick={onClick}>content</Flex>)
    ;(container.firstChild as HTMLElement).click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  describe('responsive props', () => {
    it('sets base + breakpoint attributes for axis', () => {
      const { container } = render(
        <Flex axis={{ base: 'vertical', md: 'horizontal' }}>content</Flex>
      )
      expect(container.firstChild).toHaveAttribute('data-axis', 'vertical')
      expect(container.firstChild).toHaveAttribute('data-axis-md', 'horizontal')
    })

    it('sets base + multiple breakpoint attributes for gap', () => {
      const { container } = render(
        <Flex gap={{ base: 1, sm: 2, lg: 4 }}>content</Flex>
      )
      expect(container.firstChild).toHaveAttribute('data-gap', '1')
      expect(container.firstChild).toHaveAttribute('data-gap-sm', '2')
      expect(container.firstChild).toHaveAttribute('data-gap-lg', '4')
    })

    it('sets responsive justify', () => {
      const { container } = render(
        <Flex justify={{ base: 'start', xl: 'center' }}>content</Flex>
      )
      expect(container.firstChild).toHaveAttribute('data-justify', 'start')
      expect(container.firstChild).toHaveAttribute('data-justify-xl', 'center')
    })

    it('sets responsive align', () => {
      const { container } = render(
        <Flex align={{ base: 'stretch', md: 'center' }}>content</Flex>
      )
      expect(container.firstChild).toHaveAttribute('data-align', 'stretch')
      expect(container.firstChild).toHaveAttribute('data-align-md', 'center')
    })

    it('sets responsive wrap', () => {
      const { container } = render(
        <Flex wrap={{ base: 'nowrap', sm: 'wrap' }}>content</Flex>
      )
      expect(container.firstChild).toHaveAttribute('data-wrap', 'nowrap')
      expect(container.firstChild).toHaveAttribute('data-wrap-sm', 'wrap')
    })

    it('does not set breakpoint attributes that are undefined', () => {
      const { container } = render(
        <Flex axis={{ base: 'vertical', md: 'horizontal' }}>content</Flex>
      )
      expect(container.firstChild).not.toHaveAttribute('data-axis-xs')
      expect(container.firstChild).not.toHaveAttribute('data-axis-sm')
      expect(container.firstChild).not.toHaveAttribute('data-axis-lg')
      expect(container.firstChild).not.toHaveAttribute('data-axis-xl')
    })
  })

  describe('no props', () => {
    it('renders without data attributes when no props given', () => {
      const { container } = render(<Flex>content</Flex>)
      const el = container.firstChild as HTMLElement
      expect(el).toHaveAttribute('data-flex', '')
      expect(el).not.toHaveAttribute('data-axis')
      expect(el).not.toHaveAttribute('data-gap')
      expect(el).not.toHaveAttribute('data-reverse')
      expect(el).not.toHaveAttribute('data-inline')
    })
  })
})

describe('FlexItem', () => {
  it('renders with data-flex-item attribute', () => {
    const { container } = render(<FlexItem>content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-flex-item', '')
  })

  it('renders as div by default', () => {
    const { container } = render(<FlexItem>content</FlexItem>)
    expect(container.firstChild!.nodeName).toBe('DIV')
  })

  it('renders as a different element with as prop', () => {
    const { container } = render(<FlexItem as="li">content</FlexItem>)
    expect(container.firstChild!.nodeName).toBe('LI')
    expect(container.firstChild).toHaveAttribute('data-flex-item', '')
  })

  it('renders children', () => {
    const { getByText } = render(<FlexItem><span>hello</span></FlexItem>)
    expect(getByText('hello')).toBeInTheDocument()
  })

  it('sets data-grow', () => {
    const { container } = render(<FlexItem grow={1}>content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-grow', '1')
  })

  it('sets data-shrink', () => {
    const { container } = render(<FlexItem shrink={0}>content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-shrink', '0')
  })

  it('sets data-basis', () => {
    const { container } = render(<FlexItem basis="1/2">content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-basis', '1/2')
  })

  it('sets data-align-self', () => {
    const { container } = render(<FlexItem alignSelf="center">content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-align-self', 'center')
  })

  it('sets data-order', () => {
    const { container } = render(<FlexItem order="first">content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-order', 'first')
  })

  it('sets numeric order', () => {
    const { container } = render(<FlexItem order={3}>content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-order', '3')
  })

  it('passes className', () => {
    const { container } = render(<FlexItem className="custom">content</FlexItem>)
    expect(container.firstChild).toHaveAttribute('data-flex-item', '')
    expect(container.firstChild).toHaveClass('custom')
  })

  it('forwards onClick', () => {
    const onClick = jest.fn()
    const { container } = render(<FlexItem onClick={onClick}>content</FlexItem>)
    ;(container.firstChild as HTMLElement).click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  describe('responsive props', () => {
    it('sets responsive grow', () => {
      const { container } = render(
        <FlexItem grow={{ base: 0, md: 1 }}>content</FlexItem>
      )
      expect(container.firstChild).toHaveAttribute('data-grow', '0')
      expect(container.firstChild).toHaveAttribute('data-grow-md', '1')
    })

    it('sets responsive basis', () => {
      const { container } = render(
        <FlexItem basis={{ base: 'full', md: '1/2', lg: '1/3' }}>content</FlexItem>
      )
      expect(container.firstChild).toHaveAttribute('data-basis', 'full')
      expect(container.firstChild).toHaveAttribute('data-basis-md', '1/2')
      expect(container.firstChild).toHaveAttribute('data-basis-lg', '1/3')
    })

    it('sets responsive order', () => {
      const { container } = render(
        <FlexItem order={{ base: 'last', sm: 1 }}>content</FlexItem>
      )
      expect(container.firstChild).toHaveAttribute('data-order', 'last')
      expect(container.firstChild).toHaveAttribute('data-order-sm', '1')
    })
  })

  describe('no props', () => {
    it('renders without data attributes when no props given', () => {
      const { container } = render(<FlexItem>content</FlexItem>)
      const el = container.firstChild as HTMLElement
      expect(el).toHaveAttribute('data-flex-item', '')
      expect(el).not.toHaveAttribute('data-grow')
      expect(el).not.toHaveAttribute('data-shrink')
      expect(el).not.toHaveAttribute('data-basis')
    })
  })
})
