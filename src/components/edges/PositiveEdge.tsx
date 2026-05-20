import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function PositiveEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const stroke = (data?.color as string | undefined) ?? '#16a34a'
  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{ stroke, strokeWidth: 2.5 }}
    />
  )
}
