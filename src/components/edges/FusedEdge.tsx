import { getBezierPath, type EdgeProps } from '@xyflow/react'

export default function FusedEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const stroke = (data?.color as string | undefined) ?? '#374151'
  const offset = 3
  return (
    <g>
      <path d={edgePath} stroke={stroke} strokeWidth="2" fill="none" transform={`translate(${offset}, 0)`} />
      <path d={edgePath} stroke={stroke} strokeWidth="2" fill="none" transform={`translate(-${offset}, 0)`} />
    </g>
  )
}
