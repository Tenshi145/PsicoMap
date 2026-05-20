import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function BreakEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  return <BaseEdge path={edgePath} style={{ stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '8 5' }} />
}
