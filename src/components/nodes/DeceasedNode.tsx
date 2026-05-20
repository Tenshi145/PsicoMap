import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { NodeMeta } from '../../types'

export default function DeceasedNode({ data, selected }: NodeProps<NodeMeta>) {
  const isCircle = data.nodeType === 'female'
  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        {isCircle
          ? <circle cx="30" cy="30" r="28" className="fill-gray-200 stroke-gray-700 dark:fill-gray-700 dark:stroke-gray-300" strokeWidth="2.5" />
          : <rect x="2" y="2" width="56" height="56" rx="2" className="fill-gray-200 stroke-gray-700 dark:fill-gray-700 dark:stroke-gray-300" strokeWidth="2.5" />
        }
        <line x1="10" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="3" className="text-gray-700 dark:text-gray-300" data-testid="deceased-x" />
        <line x1="50" y1="10" x2="10" y2="50" stroke="currentColor" strokeWidth="3" className="text-gray-700 dark:text-gray-300" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200 text-center px-1 leading-tight opacity-70">
        {data.label}
      </span>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Left} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3" />
    </div>
  )
}
