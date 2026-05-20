import { type EdgeProps } from '@xyflow/react'

export default function ConflictEdge({ sourceX, sourceY, targetX, targetY }: EdgeProps) {
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const len = Math.sqrt(dx * dx + dy * dy)
  const zigzags = 6
  const amplitude = 8
  const points: string[] = []

  for (let i = 0; i <= zigzags * 2; i++) {
    const t = i / (zigzags * 2)
    const x = sourceX + dx * t
    const y = sourceY + dy * t
    const perp = (i % 2 === 0 ? amplitude : -amplitude) * (len > 0 ? 1 : 0)
    const nx = -dy / len
    const ny = dx / len
    points.push(`${x + nx * perp},${y + ny * perp}`)
  }

  return (
    <polyline
      points={points.join(' ')}
      fill="none"
      stroke="#ef4444"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  )
}
