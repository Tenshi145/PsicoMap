import { Handle, Position } from '@xyflow/react'
import type { NodeProps, Node } from '@xyflow/react'
import type { NodeMeta } from '../../types'

export default function MaleNode({ data, selected }: NodeProps<Node<NodeMeta>>) {
  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500 rounded-sm' : ''}`}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <rect x="2" y="2" width="56" height="56" rx="2"
          fill={data.color ?? '#dbeafe'} stroke={data.color ? '#374151' : '#1e40af'}
          strokeWidth="2.5" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100 text-center px-1 leading-tight">
        {data.label}
      </span>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Left} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3" />
    </div>
  )
}
