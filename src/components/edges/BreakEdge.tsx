import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function BreakEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const stroke = (data?.color as string | undefined) ?? '#9ca3af'
  return <BaseEdge path={edgePath} style={{ stroke, strokeWidth: 2, strokeDasharray: '8 5' }} />
}
