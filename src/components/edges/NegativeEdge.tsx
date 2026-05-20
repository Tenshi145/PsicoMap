import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function NegativeEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const stroke = (data?.color as string | undefined) ?? '#dc2626'
  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{ stroke, strokeWidth: 2, strokeDasharray: '6 4' }}
    />
  )
}
