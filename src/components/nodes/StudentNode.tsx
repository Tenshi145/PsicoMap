import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { NodeMeta } from '../../types'

export default function StudentNode({ data, selected }: NodeProps<NodeMeta>) {
  const initial = (data.label || '?')[0].toUpperCase()
  return (
    <div className={`relative ${selected ? 'ring-2 ring-violet-500 rounded-full' : ''}`}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="26"
          className="fill-violet-100 stroke-violet-700 dark:fill-violet-900 dark:stroke-violet-300"
          strokeWidth="2.5" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-violet-800 dark:text-violet-200">
        {initial}
      </span>
      <div className="absolute -bottom-5 left-0 right-0 text-center text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
        {data.label}
      </div>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Left} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3" />
    </div>
  )
}
