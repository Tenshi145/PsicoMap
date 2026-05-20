import type { Node, Edge } from '@xyflow/react'

export type NodeType = 'male' | 'female' | 'pregnancy' | 'deceased' | 'student'
export type EdgeStyle = 'normal' | 'fused' | 'conflict' | 'break' | 'positive' | 'negative'
export type ModuleKey = 'genograma' | 'familiograma' | 'sociograma'

export interface NodeMeta {
  label: string
  nodeType: NodeType
  age?: number
  occupation?: string
  medicalNotes?: string
}

export type FlowNode = Node<NodeMeta>
export type FlowEdge = Edge

export interface FlowModuleState {
  nodes: FlowNode[]
  edges: FlowEdge[]
  selectedNodeId: string | null
}

export interface Student {
  id: string
  name: string
}

export type RelationType = 'positive' | 'negative'

export interface Relation {
  from: string
  to: string
  type: RelationType
}

export interface SociogramaModuleState extends FlowModuleState {
  students: Student[]
  relations: Relation[]
}
