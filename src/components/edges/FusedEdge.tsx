import { getBezierPath, type EdgeProps } from '@xyflow/react'

export default function FusedEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const offset = 3
  return (
    <g>
      <path d={edgePath} stroke="#374151" strokeWidth="2" fill="none" transform={`translate(${offset}, 0)`} />
      <path d={edgePath} stroke="#374151" strokeWidth="2" fill="none" transform={`translate(-${offset}, 0)`} />
    </g>
  )
}
