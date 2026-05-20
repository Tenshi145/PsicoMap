import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { NodeMeta } from '../../types'

export default function PregnancyNode({ data, selected }: NodeProps<NodeMeta>) {
  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <polygon points="30,4 58,56 2,56"
          className="fill-yellow-100 stroke-yellow-800 dark:fill-yellow-900 dark:stroke-yellow-300"
          strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <span className="absolute inset-0 flex items-end justify-center pb-2 text-xs font-medium text-gray-800 dark:text-gray-100 text-center px-1 leading-tight">
        {data.label}
      </span>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
    </div>
  )
}
