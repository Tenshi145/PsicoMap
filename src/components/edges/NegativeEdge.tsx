import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function NegativeEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{ stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '6 4' }}
    />
  )
}
