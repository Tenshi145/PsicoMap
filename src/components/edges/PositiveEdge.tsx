import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function PositiveEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{ stroke: '#16a34a', strokeWidth: 2.5 }}
    />
  )
}
