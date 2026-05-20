import { Handle, Position } from '@xyflow/react'
import type { NodeProps, Node } from '@xyflow/react'
import type { NodeMeta } from '../../types'

export default function FemaleNode({ data, selected }: NodeProps<Node<NodeMeta>>) {
  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500 rounded-full' : ''}`}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="28"
          className="fill-pink-100 stroke-pink-800 dark:fill-pink-900 dark:stroke-pink-300"
          strokeWidth="2.5" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-100 text-center px-2 leading-tight">
        {data.label}
      </span>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Left} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3" />
    </div>
  )
}
