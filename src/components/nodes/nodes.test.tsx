import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import MaleNode from './MaleNode'
import FemaleNode from './FemaleNode'
import PregnancyNode from './PregnancyNode'
import DeceasedNode from './DeceasedNode'
import StudentNode from './StudentNode'

vi.mock('@xyflow/react', () => ({
  Handle: ({ type, position, className }: { type: string; position: string; className?: string }) => (
    <div data-handle={type} data-position={position} className={className} />
  ),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
}))

const baseProps = {
  id: 'n1',
  selected: false,
  isConnectable: true,
  zIndex: 0,
  xPos: 0,
  yPos: 0,
  dragging: false,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
  type: 'male',
}

const makeProps = (overrides = {}) => ({
  ...baseProps,
  data: { label: 'Test', nodeType: 'male' as const, ...overrides },
})

describe('MaleNode', () => {
  it('renders a rect element', () => {
    const { container } = render(<MaleNode {...makeProps()} />)
    expect(container.querySelector('rect')).toBeTruthy()
  })
  it('displays the label', () => {
    const { getByText } = render(<MaleNode {...makeProps()} />)
    expect(getByText('Test')).toBeTruthy()
  })
})

describe('FemaleNode', () => {
  it('renders a circle element', () => {
    const { container } = render(<FemaleNode {...makeProps({ nodeType: 'female' as const })} />)
    expect(container.querySelector('circle')).toBeTruthy()
  })
})

describe('PregnancyNode', () => {
  it('renders a polygon element', () => {
    const { container } = render(<PregnancyNode {...makeProps({ nodeType: 'pregnancy' as const })} />)
    expect(container.querySelector('polygon')).toBeTruthy()
  })
})

describe('DeceasedNode', () => {
  it('renders an X overlay', () => {
    const { getByTestId } = render(<DeceasedNode {...makeProps({ nodeType: 'deceased' as const })} />)
    expect(getByTestId('deceased-x')).toBeTruthy()
  })
})

describe('StudentNode', () => {
  it('renders initial letter', () => {
    const { getByText } = render(<StudentNode {...makeProps({ label: 'Lucía', nodeType: 'student' as const })} />)
    expect(getByText('L')).toBeTruthy()
  })
})
