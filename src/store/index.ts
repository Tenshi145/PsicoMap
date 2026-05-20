import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
  FlowNode, FlowEdge, NodeMeta, ModuleKey,
  FlowModuleState, SociogramaModuleState, Student, Relation,
} from '../types'

interface StoreState {
  theme: 'light' | 'dark'
  isMobile: boolean
  isBottomDrawerOpen: boolean
  isMetaPanelOpen: boolean
  genograma: FlowModuleState
  familiograma: FlowModuleState
  sociograma: SociogramaModuleState
}

interface StoreActions {
  toggleTheme: () => void
  setTheme: (t: 'light' | 'dark') => void
  setIsMobile: (v: boolean) => void
  setBottomDrawerOpen: (v: boolean) => void
  setMetaPanelOpen: (v: boolean) => void
  addNode: (module: ModuleKey, node: FlowNode) => void
  removeNode: (module: ModuleKey, id: string) => void
  setNodes: (module: ModuleKey, nodes: FlowNode[]) => void
  setEdges: (module: ModuleKey, edges: FlowEdge[]) => void
  addEdge: (module: ModuleKey, edge: FlowEdge) => void
  setSelectedNode: (module: ModuleKey, id: string | null) => void
  updateNodeMeta: (module: ModuleKey, id: string, meta: Partial<NodeMeta>) => void
  clearModule: (module: ModuleKey) => void
  addStudent: (student: Student) => void
  removeStudent: (id: string) => void
  addRelation: (relation: Relation) => void
  removeRelation: (from: string, to: string) => void
  updateStudentName: (id: string, name: string) => void
}

export type RootStore = StoreState & StoreActions

const emptyModule = (): FlowModuleState => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
})

export const initialState: StoreState = {
  theme: 'light',
  isMobile: false,
  isBottomDrawerOpen: false,
  isMetaPanelOpen: false,
  genograma: emptyModule(),
  familiograma: emptyModule(),
  sociograma: { ...emptyModule(), students: [], relations: [] },
}

export const useStore = create<RootStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      toggleTheme: () =>
        set((s) => { s.theme = s.theme === 'light' ? 'dark' : 'light' }),
      setTheme: (t) => set((s) => { s.theme = t }),
      setIsMobile: (v) => set((s) => { s.isMobile = v }),
      setBottomDrawerOpen: (v) => set((s) => { s.isBottomDrawerOpen = v }),
      setMetaPanelOpen: (v) => set((s) => { s.isMetaPanelOpen = v }),

      addNode: (module, node) =>
        set((s) => { s[module].nodes.push(node as any) }),
      removeNode: (module, id) =>
        set((s) => {
          s[module].nodes = s[module].nodes.filter((n) => n.id !== id) as any
          s[module].edges = s[module].edges.filter(
            (e) => e.source !== id && e.target !== id,
          ) as any
        }),
      setNodes: (module, nodes) =>
        set((s) => { s[module].nodes = nodes as any }),
      setEdges: (module, edges) =>
        set((s) => { s[module].edges = edges as any }),
      addEdge: (module, edge) =>
        set((s) => { s[module].edges.push(edge as any) }),
      setSelectedNode: (module, id) =>
        set((s) => { s[module].selectedNodeId = id }),
      updateNodeMeta: (module, id, meta) =>
        set((s) => {
          const node = s[module].nodes.find((n) => n.id === id)
          if (node) Object.assign(node.data, meta)
        }),
      clearModule: (module) =>
        set((s) => {
          s[module].nodes = []
          s[module].edges = []
          s[module].selectedNodeId = null
        }),

      addStudent: (student) =>
        set((s) => { s.sociograma.students.push(student) }),
      removeStudent: (id) =>
        set((s) => {
          s.sociograma.students = s.sociograma.students.filter((st) => st.id !== id)
          s.sociograma.relations = s.sociograma.relations.filter(
            (r) => r.from !== id && r.to !== id,
          )
        }),
      addRelation: (relation) =>
        set((s) => { s.sociograma.relations.push(relation) }),
      removeRelation: (from, to) =>
        set((s) => {
          s.sociograma.relations = s.sociograma.relations.filter(
            (r) => !(r.from === from && r.to === to),
          )
        }),
      updateStudentName: (id, name) =>
        set((s) => {
          const st = s.sociograma.students.find((s) => s.id === id)
          if (st) st.name = name
        }),
    })),
    {
      name: 'psicomap-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
