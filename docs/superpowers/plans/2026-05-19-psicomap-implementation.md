# PsicoMap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build PsicoMap — app web para estudiantes de psicopedagogía con tres módulos: Genograma, Familiograma y Sociograma usando React Flow, Zustand y Tailwind CSS.

**Architecture:** SPA con React Router v6, tres rutas planas (`/genograma`, `/familiograma`, `/sociograma`). Store Zustand unificado con estado anidado por módulo persistido en LocalStorage vía `zustand/middleware/persist`. Un componente `FlowCanvas` reutilizable envuelve React Flow para los tres módulos.

**Tech Stack:** Vite 6, React 19, TypeScript 5, @xyflow/react 12, Zustand 5 + immer + persist, Tailwind CSS 3, @dagrejs/dagre, d3-force, html2canvas, jspdf, lucide-react, react-router-dom 6, Vitest + @testing-library/react + jsdom

---

## File Map

| File | Responsibility |
|---|---|
| `src/types.ts` | Todos los tipos TypeScript compartidos |
| `src/router.tsx` | Definición de rutas |
| `src/pages/Home.tsx` | Landing con selector de módulo |
| `src/pages/Genograma.tsx` | Página del módulo genograma |
| `src/pages/Familiograma.tsx` | Página del módulo familiograma |
| `src/pages/Sociograma.tsx` | Página del módulo sociograma |
| `src/store/index.ts` | Store Zustand unificado con persist |
| `src/components/canvas/FlowCanvas.tsx` | Wrapper reutilizable de ReactFlow |
| `src/components/nodes/MaleNode.tsx` | Nodo cuadrado |
| `src/components/nodes/FemaleNode.tsx` | Nodo círculo |
| `src/components/nodes/PregnancyNode.tsx` | Nodo triángulo |
| `src/components/nodes/DeceasedNode.tsx` | Nodo con X superpuesta |
| `src/components/nodes/StudentNode.tsx` | Nodo círculo con inicial |
| `src/components/edges/NormalEdge.tsx` | Línea continua |
| `src/components/edges/FusedEdge.tsx` | Doble línea |
| `src/components/edges/ConflictEdge.tsx` | Zigzag SVG |
| `src/components/edges/BreakEdge.tsx` | Línea punteada |
| `src/components/edges/PositiveEdge.tsx` | Flecha verde |
| `src/components/edges/NegativeEdge.tsx` | Flecha roja punteada |
| `src/components/layout/AppShell.tsx` | Layout: sidebar + canvas + metapanel |
| `src/components/layout/Sidebar.tsx` | Toolbox desktop (drag & drop) |
| `src/components/layout/BottomDrawer.tsx` | Toolbox móvil |
| `src/components/layout/MetaPanel.tsx` | Panel/modal de metadatos |
| `src/components/ui/NodeMetaForm.tsx` | Formulario de metadatos del nodo |
| `src/components/ui/ExportButton.tsx` | Botón exportar PNG/PDF |
| `src/components/ui/ThemeToggle.tsx` | Toggle oscuro/claro |
| `src/components/sociogram/RelationMatrix.tsx` | Tabla de elecciones/rechazos |
| `src/utils/layout/dagreLayout.ts` | Layout jerárquico automático |
| `src/utils/layout/forceLayout.ts` | Layout d3-force para sociograma |
| `src/utils/export/exportPng.ts` | html2canvas → PNG |
| `src/utils/export/exportPdf.ts` | html2canvas + jsPDF → PDF |

---

### Task 1: Project Scaffolding

**Files:** `package.json`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `vite.config.ts`, `src/setupTests.ts`

- [ ] **Step 1: Initialize Vite project**

```bash
cd /home/tenshi145/PsicoMap
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install @xyflow/react zustand immer react-router-dom lucide-react @dagrejs/dagre d3-force html2canvas jspdf
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D tailwindcss@3 postcss autoprefixer @types/d3-force vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Initialize Tailwind**

```bash
npx tailwindcss init -p
```

- [ ] **Step 5: Configure `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 6: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 h-screen overflow-hidden;
  }
}
```

- [ ] **Step 7: Update `vite.config.ts` to add Vitest**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
})
```

- [ ] **Step 8: Create `src/setupTests.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Create folder structure**

```bash
mkdir -p src/pages src/components/layout src/components/nodes src/components/edges src/components/canvas src/components/sociogram src/components/ui src/store src/utils/layout src/utils/export
```

- [ ] **Step 10: Verify dev server starts**

```bash
npm run dev
```
Expected: servidor corriendo en http://localhost:5173

- [ ] **Step 11: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind + Vitest"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `src/types.ts`
- Create: `src/types.test.ts`

- [ ] **Step 1: Write type tests**

```ts
// src/types.test.ts
import { describe, it, expectTypeOf } from 'vitest'
import type { NodeMeta, FlowModuleState, Relation } from './types'

describe('types', () => {
  it('NodeMeta has required fields', () => {
    expectTypeOf<NodeMeta>().toHaveProperty('label')
    expectTypeOf<NodeMeta>().toHaveProperty('nodeType')
  })
  it('Relation type union', () => {
    expectTypeOf<Relation['type']>().toEqualTypeOf<'positive' | 'negative'>()
  })
  it('FlowModuleState shape', () => {
    expectTypeOf<FlowModuleState>().toHaveProperty('nodes')
    expectTypeOf<FlowModuleState>().toHaveProperty('edges')
    expectTypeOf<FlowModuleState>().toHaveProperty('selectedNodeId')
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run src/types.test.ts
```

- [ ] **Step 3: Create `src/types.ts`**

```ts
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
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx vitest run src/types.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/types.test.ts
git commit -m "feat: add shared TypeScript types"
```

---

### Task 3: Zustand Store

**Files:**
- Create: `src/store/index.ts`
- Create: `src/store/index.test.ts`

- [ ] **Step 1: Write store tests**

```ts
// src/store/index.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useStore, initialState } from './index'

beforeEach(() => {
  useStore.setState(initialState)
})

describe('app state', () => {
  it('toggleTheme switches light → dark', () => {
    useStore.getState().toggleTheme()
    expect(useStore.getState().theme).toBe('dark')
  })

  it('toggleTheme switches dark → light', () => {
    useStore.setState({ theme: 'dark' })
    useStore.getState().toggleTheme()
    expect(useStore.getState().theme).toBe('light')
  })
})

describe('addNode', () => {
  it('adds node to genograma', () => {
    const node = { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Juan', nodeType: 'male' as const } }
    useStore.getState().addNode('genograma', node)
    expect(useStore.getState().genograma.nodes).toHaveLength(1)
  })

  it('adds node to familiograma independently', () => {
    const node = { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Ana', nodeType: 'female' as const } }
    useStore.getState().addNode('familiograma', node)
    expect(useStore.getState().familiograma.nodes).toHaveLength(1)
    expect(useStore.getState().genograma.nodes).toHaveLength(0)
  })
})

describe('removeNode', () => {
  it('removes node and its connected edges', () => {
    useStore.setState({
      genograma: {
        nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: { label: 'A', nodeType: 'male' as const } }],
        edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
        selectedNodeId: null,
      },
    })
    useStore.getState().removeNode('genograma', 'n1')
    expect(useStore.getState().genograma.nodes).toHaveLength(0)
    expect(useStore.getState().genograma.edges).toHaveLength(0)
  })
})

describe('updateNodeMeta', () => {
  it('merges partial meta into node data', () => {
    useStore.setState({
      genograma: {
        nodes: [{ id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Juan', nodeType: 'male' as const } }],
        edges: [],
        selectedNodeId: null,
      },
    })
    useStore.getState().updateNodeMeta('genograma', 'n1', { age: 42 })
    expect(useStore.getState().genograma.nodes[0].data.age).toBe(42)
  })
})

describe('sociograma', () => {
  it('addStudent appends student', () => {
    useStore.getState().addStudent({ id: 's1', name: 'Lucía' })
    expect(useStore.getState().sociograma.students).toHaveLength(1)
  })

  it('addRelation appends relation', () => {
    useStore.getState().addRelation({ from: 's1', to: 's2', type: 'positive' })
    expect(useStore.getState().sociograma.relations).toHaveLength(1)
  })

  it('removeRelation removes matching pair', () => {
    useStore.setState({
      sociograma: {
        ...initialState.sociograma,
        relations: [{ from: 's1', to: 's2', type: 'positive' as const }],
      },
    })
    useStore.getState().removeRelation('s1', 's2')
    expect(useStore.getState().sociograma.relations).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run src/store/index.test.ts
```

- [ ] **Step 3: Create `src/store/index.ts`**

```ts
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
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx vitest run src/store/index.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/store/index.ts src/store/index.test.ts
git commit -m "feat: add Zustand store with persist and immer"
```

---

### Task 4: Router + Home Page

**Files:**
- Create: `src/router.tsx`
- Create: `src/pages/Home.tsx`
- Create: `src/pages/Genograma.tsx` (stub)
- Create: `src/pages/Familiograma.tsx` (stub)
- Create: `src/pages/Sociograma.tsx` (stub)
- Modify: `src/main.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Create page stubs**

```tsx
// src/pages/Genograma.tsx
export default function Genograma() {
  return <div className="flex h-full items-center justify-center text-2xl">Genograma — próximamente</div>
}

// src/pages/Familiograma.tsx
export default function Familiograma() {
  return <div className="flex h-full items-center justify-center text-2xl">Familiograma — próximamente</div>
}

// src/pages/Sociograma.tsx
export default function Sociograma() {
  return <div className="flex h-full items-center justify-center text-2xl">Sociograma — próximamente</div>
}
```

- [ ] **Step 2: Create `src/router.tsx`**

```tsx
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Genograma from './pages/Genograma'
import Familiograma from './pages/Familiograma'
import Sociograma from './pages/Sociograma'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/genograma', element: <Genograma /> },
  { path: '/familiograma', element: <Familiograma /> },
  { path: '/sociograma', element: <Sociograma /> },
])
```

- [ ] **Step 3: Create `src/pages/Home.tsx`**

```tsx
import { useNavigate } from 'react-router-dom'
import { Users, GitBranch, Network } from 'lucide-react'

const modules = [
  {
    path: '/genograma',
    title: 'Genograma',
    description: 'Árbol familiar multigeneracional con simbología clínica estándar.',
    icon: GitBranch,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800 dark:hover:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    path: '/familiograma',
    title: 'Familiograma',
    description: 'Representación de dinámicas y relaciones dentro del núcleo familiar.',
    icon: Users,
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:border-emerald-800 dark:hover:bg-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    path: '/sociograma',
    title: 'Sociograma',
    description: 'Mapa de relaciones sociales en un grupo: simpatías y rechazos.',
    icon: Network,
    color: 'bg-violet-50 border-violet-200 hover:bg-violet-100 dark:bg-violet-950 dark:border-violet-800 dark:hover:bg-violet-900',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">PsicoMap</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
          Herramientas de mapeo psicopedagógico
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {modules.map(({ path, title, description, icon: Icon, color, iconColor }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col gap-3 p-6 rounded-2xl border-2 text-left transition-all ${color}`}
          >
            <Icon className={`w-8 h-8 ${iconColor}`} />
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Update `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 5: Delete `src/App.tsx` and `src/App.css` if they exist**

```bash
rm -f src/App.tsx src/App.css
```

- [ ] **Step 6: Verify in browser — navigate to `/`, click each módulo card**

```bash
npm run dev
```
Expected: Home con 3 cards, cada una navega a su ruta.

- [ ] **Step 7: Commit**

```bash
git add src/
git commit -m "feat: add router and Home page with module selector"
```

---

### Task 5: Custom Nodes

**Files:**
- Create: `src/components/nodes/MaleNode.tsx`
- Create: `src/components/nodes/FemaleNode.tsx`
- Create: `src/components/nodes/PregnancyNode.tsx`
- Create: `src/components/nodes/DeceasedNode.tsx`
- Create: `src/components/nodes/StudentNode.tsx`
- Create: `src/components/nodes/index.ts`
- Create: `src/components/nodes/nodes.test.tsx`

- [ ] **Step 1: Write node render tests**

```tsx
// src/components/nodes/nodes.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import MaleNode from './MaleNode'
import FemaleNode from './FemaleNode'
import PregnancyNode from './PregnancyNode'
import DeceasedNode from './DeceasedNode'
import StudentNode from './StudentNode'

const baseProps = {
  id: 'n1',
  selected: false,
  isConnectable: true,
  zIndex: 0,
  xPos: 0,
  yPos: 0,
  dragging: false,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
  type: 'male',
}

const makeProps = (overrides = {}) => ({
  ...baseProps,
  data: { label: 'Test', nodeType: 'male' as const, ...overrides },
})

describe('MaleNode', () => {
  it('renders a rect element', () => {
    const { container } = render(<MaleNode {...makeProps()} />)
    expect(container.querySelector('rect')).toBeTruthy()
  })
  it('displays the label', () => {
    const { getByText } = render(<MaleNode {...makeProps()} />)
    expect(getByText('Test')).toBeTruthy()
  })
})

describe('FemaleNode', () => {
  it('renders a circle element', () => {
    const { container } = render(<FemaleNode {...makeProps({ nodeType: 'female' as const })} />)
    expect(container.querySelector('circle')).toBeTruthy()
  })
})

describe('PregnancyNode', () => {
  it('renders a polygon element', () => {
    const { container } = render(<PregnancyNode {...makeProps({ nodeType: 'pregnancy' as const })} />)
    expect(container.querySelector('polygon')).toBeTruthy()
  })
})

describe('DeceasedNode', () => {
  it('renders an X overlay', () => {
    const { getByTestId } = render(<DeceasedNode {...makeProps({ nodeType: 'deceased' as const })} />)
    expect(getByTestId('deceased-x')).toBeTruthy()
  })
})

describe('StudentNode', () => {
  it('renders initial letter', () => {
    const { getByText } = render(<StudentNode {...makeProps({ label: 'Lucía', nodeType: 'student' as const })} />)
    expect(getByText('L')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run src/components/nodes/nodes.test.tsx
```

- [ ] **Step 3: Create `src/components/nodes/MaleNode.tsx`**

```tsx
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { NodeMeta } from '../../types'

export default function MaleNode({ data, selected }: NodeProps<NodeMeta>) {
  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500 rounded-sm' : ''}`}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <rect x="2" y="2" width="56" height="56" rx="2"
          className="fill-blue-100 stroke-blue-800 dark:fill-blue-900 dark:stroke-blue-300"
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
```

- [ ] **Step 4: Create `src/components/nodes/FemaleNode.tsx`**

```tsx
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { NodeMeta } from '../../types'

export default function FemaleNode({ data, selected }: NodeProps<NodeMeta>) {
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
```

- [ ] **Step 5: Create `src/components/nodes/PregnancyNode.tsx`**

```tsx
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
```

- [ ] **Step 6: Create `src/components/nodes/DeceasedNode.tsx`**

```tsx
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
```

- [ ] **Step 7: Create `src/components/nodes/StudentNode.tsx`**

```tsx
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
```

- [ ] **Step 8: Create `src/components/nodes/index.ts`**

```ts
import MaleNode from './MaleNode'
import FemaleNode from './FemaleNode'
import PregnancyNode from './PregnancyNode'
import DeceasedNode from './DeceasedNode'
import StudentNode from './StudentNode'

export const nodeTypes = {
  male: MaleNode,
  female: FemaleNode,
  pregnancy: PregnancyNode,
  deceased: DeceasedNode,
  student: StudentNode,
}
```

- [ ] **Step 9: Run — expect PASS**

```bash
npx vitest run src/components/nodes/nodes.test.tsx
```

- [ ] **Step 10: Commit**

```bash
git add src/components/nodes/
git commit -m "feat: add custom nodes (male, female, pregnancy, deceased, student)"
```

---

### Task 6: Custom Edges

**Files:**
- Create: `src/components/edges/NormalEdge.tsx`
- Create: `src/components/edges/FusedEdge.tsx`
- Create: `src/components/edges/ConflictEdge.tsx`
- Create: `src/components/edges/BreakEdge.tsx`
- Create: `src/components/edges/PositiveEdge.tsx`
- Create: `src/components/edges/NegativeEdge.tsx`
- Create: `src/components/edges/index.ts`

No hay lógica algorítmica a unit-testear aquí (son wrappers de SVG). Proceder directo a implementación.

- [ ] **Step 1: Create `src/components/edges/NormalEdge.tsx`**

```tsx
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function NormalEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#374151', strokeWidth: 2 }} />
}
```

- [ ] **Step 2: Create `src/components/edges/FusedEdge.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `src/components/edges/ConflictEdge.tsx`**

```tsx
import { type EdgeProps } from '@xyflow/react'

export default function ConflictEdge({ sourceX, sourceY, targetX, targetY }: EdgeProps) {
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const len = Math.sqrt(dx * dx + dy * dy)
  const zigzags = 6
  const amplitude = 8
  const points: string[] = []

  for (let i = 0; i <= zigzags * 2; i++) {
    const t = i / (zigzags * 2)
    const x = sourceX + dx * t
    const y = sourceY + dy * t
    const perp = (i % 2 === 0 ? amplitude : -amplitude) * (len > 0 ? 1 : 0)
    const nx = -dy / len
    const ny = dx / len
    points.push(`${x + nx * perp},${y + ny * perp}`)
  }

  return (
    <polyline
      points={points.join(' ')}
      fill="none"
      stroke="#ef4444"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  )
}
```

- [ ] **Step 4: Create `src/components/edges/BreakEdge.tsx`**

```tsx
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function BreakEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  return <BaseEdge path={edgePath} style={{ stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '8 5' }} />
}
```

- [ ] **Step 5: Create `src/components/edges/PositiveEdge.tsx`**

```tsx
import { BaseEdge, getBezierPath, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react'

export default function PositiveEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{ stroke: '#16a34a', strokeWidth: 2.5 }}
    />
  )
}
```

- [ ] **Step 6: Create `src/components/edges/NegativeEdge.tsx`**

```tsx
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
```

- [ ] **Step 7: Create `src/components/edges/index.ts`**

```ts
import NormalEdge from './NormalEdge'
import FusedEdge from './FusedEdge'
import ConflictEdge from './ConflictEdge'
import BreakEdge from './BreakEdge'
import PositiveEdge from './PositiveEdge'
import NegativeEdge from './NegativeEdge'

export const edgeTypes = {
  normal: NormalEdge,
  fused: FusedEdge,
  conflict: ConflictEdge,
  break: BreakEdge,
  positive: PositiveEdge,
  negative: NegativeEdge,
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/edges/
git commit -m "feat: add custom edge types (normal, fused, conflict, break, positive, negative)"
```

---

### Task 7: FlowCanvas Component

**Files:**
- Create: `src/components/canvas/FlowCanvas.tsx`

- [ ] **Step 1: Create `src/components/canvas/FlowCanvas.tsx`**

```tsx
import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  type OnConnect,
  type Connection,
  type NodeMouseHandler,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nodeTypes } from '../nodes'
import { edgeTypes } from '../edges'
import { useStore } from '../../store'
import type { ModuleKey, FlowEdge } from '../../types'

interface FlowCanvasProps {
  module: ModuleKey
  defaultEdgeType?: string
  onNodeClick?: NodeMouseHandler
}

export default function FlowCanvas({ module, defaultEdgeType = 'normal', onNodeClick }: FlowCanvasProps) {
  const nodes = useStore((s) => s[module].nodes)
  const edges = useStore((s) => s[module].edges)
  const setNodes = useStore((s) => s.setNodes)
  const setEdges = useStore((s) => s.setEdges)
  const addEdgeToStore = useStore((s) => s.addEdge)
  const setSelectedNode = useStore((s) => s.setSelectedNode)

  const onConnect = useCallback<OnConnect>(
    (params: Connection) => {
      const newEdge: FlowEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: defaultEdgeType,
      }
      addEdgeToStore(module, newEdge)
    },
    [module, defaultEdgeType, addEdgeToStore],
  )

  const handleNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      setSelectedNode(module, node.id)
      onNodeClick?.(event, node)
    },
    [module, setSelectedNode, onNodeClick],
  )

  const handlePaneClick = useCallback(() => {
    setSelectedNode(module, null)
  }, [module, setSelectedNode])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={(changes) => {
        // Apply position changes from drag
        const updated = nodes.map((n) => {
          const change = changes.find((c) => c.type === 'position' && c.id === n.id)
          if (change && change.type === 'position' && change.position) {
            return { ...n, position: change.position }
          }
          return n
        })
        setNodes(module, updated as any)
      }}
      onEdgesChange={(changes) => {
        const removed = changes.filter((c) => c.type === 'remove').map((c) => c.id)
        if (removed.length) {
          setEdges(module, edges.filter((e) => !removed.includes(e.id)) as any)
        }
      }}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      fitView
      panOnScroll
      zoomOnPinch
      minZoom={0.2}
      maxZoom={3}
      defaultEdgeOptions={{ type: defaultEdgeType }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="dark:bg-gray-950" />
      <Controls className="dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      <MiniMap className="dark:bg-gray-800" nodeStrokeWidth={3} />
    </ReactFlow>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/FlowCanvas.tsx
git commit -m "feat: add reusable FlowCanvas component"
```

---

### Task 8: Dagre Layout Utility

**Files:**
- Create: `src/utils/layout/dagreLayout.ts`
- Create: `src/utils/layout/dagreLayout.test.ts`

- [ ] **Step 1: Write tests**

```ts
// src/utils/layout/dagreLayout.test.ts
import { describe, it, expect } from 'vitest'
import { applyDagreLayout } from './dagreLayout'
import type { FlowNode, FlowEdge } from '../../types'

const nodes: FlowNode[] = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A', nodeType: 'male' } },
  { id: 'b', position: { x: 0, y: 0 }, data: { label: 'B', nodeType: 'female' } },
  { id: 'c', position: { x: 0, y: 0 }, data: { label: 'C', nodeType: 'male' } },
]

const edges: FlowEdge[] = [
  { id: 'e1', source: 'a', target: 'b' },
  { id: 'e2', source: 'b', target: 'c' },
]

describe('applyDagreLayout', () => {
  it('returns same number of nodes', () => {
    const result = applyDagreLayout(nodes, edges)
    expect(result).toHaveLength(3)
  })

  it('assigns different y positions to nodes in different levels', () => {
    const result = applyDagreLayout(nodes, edges)
    const ys = result.map((n) => n.position.y)
    expect(new Set(ys).size).toBeGreaterThan(1)
  })

  it('node a is above node c (a → b → c)', () => {
    const result = applyDagreLayout(nodes, edges)
    const aY = result.find((n) => n.id === 'a')!.position.y
    const cY = result.find((n) => n.id === 'c')!.position.y
    expect(aY).toBeLessThan(cY)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run src/utils/layout/dagreLayout.test.ts
```

- [ ] **Step 3: Create `src/utils/layout/dagreLayout.ts`**

```ts
import dagre from '@dagrejs/dagre'
import type { FlowNode, FlowEdge } from '../../types'

const NODE_WIDTH = 80
const NODE_HEIGHT = 80

export function applyDagreLayout(nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80 })

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))
  edges.forEach((e) => g.setEdge(e.source, e.target))

  dagre.layout(g)

  return nodes.map((n) => {
    const nodeWithPos = g.node(n.id)
    return {
      ...n,
      position: {
        x: nodeWithPos.x - NODE_WIDTH / 2,
        y: nodeWithPos.y - NODE_HEIGHT / 2,
      },
    }
  })
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx vitest run src/utils/layout/dagreLayout.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/utils/layout/dagreLayout.ts src/utils/layout/dagreLayout.test.ts
git commit -m "feat: add Dagre hierarchical layout utility"
```

---

### Task 9: d3-force Layout Utility

**Files:**
- Create: `src/utils/layout/forceLayout.ts`
- Create: `src/utils/layout/forceLayout.test.ts`

- [ ] **Step 1: Write tests**

```ts
// src/utils/layout/forceLayout.test.ts
import { describe, it, expect } from 'vitest'
import { applyForceLayout } from './forceLayout'
import type { FlowNode, Relation } from '../../types'

const nodes: FlowNode[] = [
  { id: 's1', position: { x: 0, y: 0 }, data: { label: 'A', nodeType: 'student' } },
  { id: 's2', position: { x: 0, y: 0 }, data: { label: 'B', nodeType: 'student' } },
  { id: 's3', position: { x: 0, y: 0 }, data: { label: 'C', nodeType: 'student' } },
]

const relations: Relation[] = [
  { from: 's1', to: 's2', type: 'positive' },
  { from: 's3', to: 's2', type: 'positive' },
]

describe('applyForceLayout', () => {
  it('returns same number of nodes', () => {
    const result = applyForceLayout(nodes, relations)
    expect(result).toHaveLength(3)
  })

  it('all nodes receive numeric positions', () => {
    const result = applyForceLayout(nodes, relations)
    result.forEach((n) => {
      expect(typeof n.position.x).toBe('number')
      expect(typeof n.position.y).toBe('number')
      expect(isNaN(n.position.x)).toBe(false)
    })
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx vitest run src/utils/layout/forceLayout.test.ts
```

- [ ] **Step 3: Create `src/utils/layout/forceLayout.ts`**

```ts
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from 'd3-force'
import type { FlowNode, Relation } from '../../types'

export function applyForceLayout(nodes: FlowNode[], relations: Relation[]): FlowNode[] {
  const width = 800
  const height = 600

  const simNodes = nodes.map((n) => ({
    id: n.id,
    x: width / 2 + (Math.random() - 0.5) * 200,
    y: height / 2 + (Math.random() - 0.5) * 200,
  }))

  const links = relations.map((r) => ({ source: r.from, target: r.to }))

  const simulation = forceSimulation(simNodes as any)
    .force('link', forceLink(links).id((d: any) => d.id).distance(120).strength(0.5))
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide(50))
    .stop()

  // Run synchronously
  simulation.tick(300)

  const posMap = new Map(simNodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]))

  return nodes.map((n) => ({
    ...n,
    position: posMap.get(n.id) ?? { x: 0, y: 0 },
  }))
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npx vitest run src/utils/layout/forceLayout.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/utils/layout/forceLayout.ts src/utils/layout/forceLayout.test.ts
git commit -m "feat: add d3-force layout utility for sociogram"
```

---

### Task 10: Export Utilities

**Files:**
- Create: `src/utils/export/exportPng.ts`
- Create: `src/utils/export/exportPdf.ts`

- [ ] **Step 1: Create `src/utils/export/exportPng.ts`**

```ts
import html2canvas from 'html2canvas'

export async function exportToPng(elementId: string, filename = 'psicomap.png') {
  const el = document.getElementById(elementId)
  if (!el) throw new Error(`Element #${elementId} not found`)
  const canvas = await html2canvas(el, { useCORS: true, backgroundColor: '#ffffff' })
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
```

- [ ] **Step 2: Create `src/utils/export/exportPdf.ts`**

```ts
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPdf(elementId: string, filename = 'psicomap.pdf') {
  const el = document.getElementById(elementId)
  if (!el) throw new Error(`Element #${elementId} not found`)
  const canvas = await html2canvas(el, { useCORS: true, backgroundColor: '#ffffff' })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  })
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save(filename)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/export/
git commit -m "feat: add PNG and PDF export utilities"
```

---

### Task 11: Layout Components (AppShell, Sidebar, BottomDrawer, MetaPanel)

**Files:**
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/BottomDrawer.tsx`
- Create: `src/components/layout/MetaPanel.tsx`
- Create: `src/components/ui/ThemeToggle.tsx`
- Create: `src/components/ui/ExportButton.tsx`

- [ ] **Step 1: Create `src/components/ui/ThemeToggle.tsx`**

```tsx
import { Sun, Moon } from 'lucide-react'
import { useStore } from '../../store'
import { useEffect } from 'react'

export default function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
```

- [ ] **Step 2: Create `src/components/ui/ExportButton.tsx`**

```tsx
import { Download } from 'lucide-react'
import { useState } from 'react'
import { exportToPng } from '../../utils/export/exportPng'
import { exportToPdf } from '../../utils/export/exportPdf'

interface ExportButtonProps {
  canvasElementId: string
  filename?: string
}

export default function ExportButton({ canvasElementId, filename = 'psicomap' }: ExportButtonProps) {
  const [open, setOpen] = useState(false)

  const handle = async (type: 'png' | 'pdf') => {
    setOpen(false)
    if (type === 'png') await exportToPng(canvasElementId, `${filename}.png`)
    else await exportToPdf(canvasElementId, `${filename}.pdf`)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        Exportar
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <button onClick={() => handle('png')} className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700">PNG</button>
          <button onClick={() => handle('pdf')} className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700">PDF</button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/layout/Sidebar.tsx`**

```tsx
import { Square, Circle, Triangle, X as XIcon, GraduationCap } from 'lucide-react'
import type { NodeType, ModuleKey } from '../../types'

interface NodeTool {
  type: NodeType
  label: string
  icon: React.ReactNode
  color: string
}

const genoTools: NodeTool[] = [
  { type: 'male', label: 'Hombre', icon: <Square className="w-5 h-5" />, color: 'bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-500' },
  { type: 'female', label: 'Mujer', icon: <Circle className="w-5 h-5" />, color: 'bg-pink-100 border-pink-400 dark:bg-pink-900 dark:border-pink-500' },
  { type: 'pregnancy', label: 'Embarazo', icon: <Triangle className="w-5 h-5" />, color: 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900 dark:border-yellow-500' },
  { type: 'deceased', label: 'Fallecido', icon: <XIcon className="w-5 h-5" />, color: 'bg-gray-100 border-gray-400 dark:bg-gray-700 dark:border-gray-500' },
]

const socioTools: NodeTool[] = [
  { type: 'student', label: 'Alumno', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-violet-100 border-violet-400 dark:bg-violet-900 dark:border-violet-500' },
]

interface SidebarProps {
  module: ModuleKey
  onAddNode: (type: NodeType) => void
}

export default function Sidebar({ module, onAddNode }: SidebarProps) {
  const tools = module === 'sociograma' ? socioTools : genoTools

  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('application/psicomap-node', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 gap-2 shrink-0">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 mb-1">
        Nodos
      </p>
      {tools.map((tool) => (
        <div
          key={tool.type}
          draggable
          onDragStart={(e) => onDragStart(e, tool.type)}
          onClick={() => onAddNode(tool.type)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing select-none transition-opacity hover:opacity-80 ${tool.color}`}
        >
          {tool.icon}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tool.label}</span>
        </div>
      ))}
    </aside>
  )
}
```

- [ ] **Step 4: Create `src/components/layout/BottomDrawer.tsx`**

```tsx
import { Square, Circle, Triangle, X as XIcon, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../../store'
import type { NodeType, ModuleKey } from '../../types'

const genoTools = [
  { type: 'male' as NodeType, label: 'Hombre', icon: <Square className="w-6 h-6" />, color: 'text-blue-600' },
  { type: 'female' as NodeType, label: 'Mujer', icon: <Circle className="w-6 h-6" />, color: 'text-pink-600' },
  { type: 'pregnancy' as NodeType, label: 'Embarazo', icon: <Triangle className="w-6 h-6" />, color: 'text-yellow-600' },
  { type: 'deceased' as NodeType, label: 'Fallecido', icon: <XIcon className="w-6 h-6" />, color: 'text-gray-600' },
]

const socioTools = [
  { type: 'student' as NodeType, label: 'Alumno', icon: <GraduationCap className="w-6 h-6" />, color: 'text-violet-600' },
]

interface BottomDrawerProps {
  module: ModuleKey
  onAddNode: (type: NodeType) => void
}

export default function BottomDrawer({ module, onAddNode }: BottomDrawerProps) {
  const isOpen = useStore((s) => s.isBottomDrawerOpen)
  const setOpen = useStore((s) => s.setBottomDrawerOpen)
  const tools = module === 'sociograma' ? socioTools : genoTools

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className={`bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
        <button
          onClick={() => setOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 h-14 font-medium text-gray-700 dark:text-gray-200"
        >
          <span>Añadir nodo</span>
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
        <div className="flex justify-around items-center px-4 pb-6 pt-2 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => { onAddNode(tool.type); setOpen(false) }}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 active:scale-95 transition-transform min-w-[64px]"
            >
              <span className={tool.color}>{tool.icon}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/ui/NodeMetaForm.tsx`**

```tsx
import { useStore } from '../../store'
import type { ModuleKey } from '../../types'

interface NodeMetaFormProps {
  module: ModuleKey
  nodeId: string
}

export default function NodeMetaForm({ module, nodeId }: NodeMetaFormProps) {
  const node = useStore((s) => s[module].nodes.find((n) => n.id === nodeId))
  const updateNodeMeta = useStore((s) => s.updateNodeMeta)

  if (!node) return null
  const data = node.data

  const update = (field: string, value: string | number) =>
    updateNodeMeta(module, nodeId, { [field]: value })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre</label>
        <input
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.label}
          onChange={(e) => update('label', e.target.value)}
          placeholder="Nombre completo"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Edad</label>
        <input
          type="number"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.age ?? ''}
          onChange={(e) => update('age', Number(e.target.value))}
          placeholder="Años"
          min={0}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ocupación</label>
        <input
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.occupation ?? ''}
          onChange={(e) => update('occupation', e.target.value)}
          placeholder="Profesión u ocupación"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notas clínicas</label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={data.medicalNotes ?? ''}
          onChange={(e) => update('medicalNotes', e.target.value)}
          placeholder="Diagnósticos, observaciones, etc."
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `src/components/layout/MetaPanel.tsx`**

```tsx
import { X } from 'lucide-react'
import { useStore } from '../../store'
import NodeMetaForm from '../ui/NodeMetaForm'
import type { ModuleKey } from '../../types'

interface MetaPanelProps {
  module: ModuleKey
}

export default function MetaPanel({ module }: MetaPanelProps) {
  const selectedNodeId = useStore((s) => s[module].selectedNodeId)
  const setSelectedNode = useStore((s) => s.setSelectedNode)
  const isMobile = useStore((s) => s.isMobile)

  if (!selectedNodeId) return null

  const close = () => setSelectedNode(module, null)

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:hidden" onClick={close}>
        <div
          className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Editar nodo</h2>
            <button onClick={close} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <NodeMetaForm module={module} nodeId={selectedNodeId} />
        </div>
      </div>
    )
  }

  return (
    <aside className="hidden md:flex flex-col w-72 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 gap-4 shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">Editar nodo</h2>
        <button onClick={close} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      <NodeMetaForm module={module} nodeId={selectedNodeId} />
    </aside>
  )
}
```

- [ ] **Step 7: Create `src/components/layout/AppShell.tsx`**

```tsx
import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../../store'
import Sidebar from './Sidebar'
import BottomDrawer from './BottomDrawer'
import MetaPanel from './MetaPanel'
import ThemeToggle from '../ui/ThemeToggle'
import ExportButton from '../ui/ExportButton'
import FlowCanvas from '../canvas/FlowCanvas'
import type { ModuleKey, NodeType } from '../../types'
import { useReactFlow } from '@xyflow/react'

interface AppShellProps {
  module: ModuleKey
  title: string
  defaultEdgeType?: string
  topBarExtra?: React.ReactNode
}

function CanvasArea({ module, defaultEdgeType }: { module: ModuleKey; defaultEdgeType?: string }) {
  const addNode = useStore((s) => s.addNode)
  const isMobile = useStore((s) => s.isMobile)

  // Wrap FlowCanvas and give it an id for export
  return (
    <div id="psicomap-canvas" className="flex-1 h-full">
      <FlowCanvas module={module} defaultEdgeType={defaultEdgeType} />
    </div>
  )
}

export default function AppShell({ module, title, defaultEdgeType, topBarExtra }: AppShellProps) {
  const navigate = useNavigate()
  const setIsMobile = useStore((s) => s.setIsMobile)
  const addNode = useStore((s) => s.addNode)
  const isMobile = useStore((s) => s.isMobile)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [setIsMobile])

  const handleAddNode = useCallback((type: NodeType) => {
    const id = `${type}-${Date.now()}`
    addNode(module, {
      id,
      type,
      position: { x: 300 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1), nodeType: type },
    })
  }, [module, addNode])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900 z-10">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-gray-900 dark:text-white flex-1">{title}</h1>
        {topBarExtra}
        <ExportButton canvasElementId="psicomap-canvas" filename={module} />
        <ThemeToggle />
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar module={module} onAddNode={handleAddNode} />
        <CanvasArea module={module} defaultEdgeType={defaultEdgeType} />
        <MetaPanel module={module} />
      </div>

      {/* Mobile bottom drawer */}
      <BottomDrawer module={module} onAddNode={handleAddNode} />
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/ src/components/ui/
git commit -m "feat: add AppShell, Sidebar, BottomDrawer, MetaPanel, ThemeToggle, ExportButton"
```

---

### Task 12: Genograma + Familiograma Pages

**Files:**
- Modify: `src/pages/Genograma.tsx`
- Modify: `src/pages/Familiograma.tsx`

- [ ] **Step 1: Update `src/pages/Genograma.tsx`**

```tsx
import { ReactFlowProvider } from '@xyflow/react'
import AppShell from '../components/layout/AppShell'
import { useStore } from '../store'
import { applyDagreLayout } from '../utils/layout/dagreLayout'
import { LayoutGrid } from 'lucide-react'

function GenogramaContent() {
  const nodes = useStore((s) => s.genograma.nodes)
  const edges = useStore((s) => s.genograma.edges)
  const setNodes = useStore((s) => s.setNodes)

  const applyLayout = () => {
    const laid = applyDagreLayout(nodes, edges)
    setNodes('genograma', laid)
  }

  const layoutBtn = (
    <button
      onClick={applyLayout}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium"
    >
      <LayoutGrid className="w-4 h-4" />
      Auto Layout
    </button>
  )

  return <AppShell module="genograma" title="Genograma" topBarExtra={layoutBtn} />
}

export default function Genograma() {
  return (
    <ReactFlowProvider>
      <GenogramaContent />
    </ReactFlowProvider>
  )
}
```

- [ ] **Step 2: Update `src/pages/Familiograma.tsx`**

```tsx
import { ReactFlowProvider } from '@xyflow/react'
import AppShell from '../components/layout/AppShell'
import { useStore } from '../store'
import { applyDagreLayout } from '../utils/layout/dagreLayout'
import { LayoutGrid } from 'lucide-react'

function FamiliogramaContent() {
  const nodes = useStore((s) => s.familiograma.nodes)
  const edges = useStore((s) => s.familiograma.edges)
  const setNodes = useStore((s) => s.setNodes)

  const applyLayout = () => {
    const laid = applyDagreLayout(nodes, edges)
    setNodes('familiograma', laid)
  }

  const layoutBtn = (
    <button
      onClick={applyLayout}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium"
    >
      <LayoutGrid className="w-4 h-4" />
      Auto Layout
    </button>
  )

  return <AppShell module="familiograma" title="Familiograma" topBarExtra={layoutBtn} />
}

export default function Familiograma() {
  return (
    <ReactFlowProvider>
      <FamiliogramaContent />
    </ReactFlowProvider>
  )
}
```

- [ ] **Step 3: Verify in browser — drag nodes onto canvas, connect them, click Auto Layout**

```bash
npm run dev
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Genograma.tsx src/pages/Familiograma.tsx
git commit -m "feat: complete Genograma and Familiograma pages with Dagre layout"
```

---

### Task 13: RelationMatrix + Sociograma Page

**Files:**
- Create: `src/components/sociogram/RelationMatrix.tsx`
- Modify: `src/pages/Sociograma.tsx`

- [ ] **Step 1: Create `src/components/sociogram/RelationMatrix.tsx`**

```tsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../../store'
import type { RelationType } from '../../types'

export default function RelationMatrix() {
  const students = useStore((s) => s.sociograma.students)
  const relations = useStore((s) => s.sociograma.relations)
  const addStudent = useStore((s) => s.addStudent)
  const removeStudent = useStore((s) => s.removeStudent)
  const addRelation = useStore((s) => s.addRelation)
  const removeRelation = useStore((s) => s.removeRelation)
  const updateStudentName = useStore((s) => s.updateStudentName)

  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    const name = newName.trim()
    if (!name) return
    addStudent({ id: `s-${Date.now()}`, name })
    setNewName('')
  }

  const getRelation = (from: string, to: string) =>
    relations.find((r) => r.from === from && r.to === to)?.type ?? null

  const cycleRelation = (from: string, to: string) => {
    if (from === to) return
    const current = getRelation(from, to)
    if (!current) {
      addRelation({ from, to, type: 'positive' })
    } else if (current === 'positive') {
      removeRelation(from, to)
      addRelation({ from, to, type: 'negative' })
    } else {
      removeRelation(from, to)
    }
  }

  const cellColor = (type: RelationType | null) => {
    if (type === 'positive') return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    if (type === 'negative') return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    return 'bg-gray-50 dark:bg-gray-800 text-gray-400'
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-auto">
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nombre del alumno"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-gray-500 dark:text-gray-400 font-medium">De ↓ / A →</th>
                {students.map((s) => (
                  <th key={s.id} className="p-2 text-center text-gray-700 dark:text-gray-200 font-medium max-w-[80px] truncate">
                    {s.name}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {students.map((from) => (
                <tr key={from.id}>
                  <td className="p-2 font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                    <input
                      className="bg-transparent border-none focus:outline-none w-24 text-xs"
                      value={from.name}
                      onChange={(e) => updateStudentName(from.id, e.target.value)}
                    />
                  </td>
                  {students.map((to) => (
                    <td key={to.id} className="p-1">
                      {from.id === to.id ? (
                        <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700" />
                      ) : (
                        <button
                          onClick={() => cycleRelation(from.id, to.id)}
                          className={`w-8 h-8 rounded font-bold transition-colors ${cellColor(getRelation(from.id, to.id))}`}
                          title={`${from.name} → ${to.name}`}
                        >
                          {getRelation(from.id, to.id) === 'positive' ? '+' : getRelation(from.id, to.id) === 'negative' ? '−' : '·'}
                        </button>
                      )}
                    </td>
                  ))}
                  <td className="p-1">
                    <button
                      onClick={() => removeStudent(from.id)}
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-gray-400">Clic en celda: · → + (simpatía) → − (rechazo) → ·</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Update `src/pages/Sociograma.tsx`**

```tsx
import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import AppShell from '../components/layout/AppShell'
import RelationMatrix from '../components/sociogram/RelationMatrix'
import { useStore } from '../store'
import { applyForceLayout } from '../utils/layout/forceLayout'
import { Network, TableProperties } from 'lucide-react'

function SociogramaContent() {
  const [showMatrix, setShowMatrix] = useState(false)
  const students = useStore((s) => s.sociograma.students)
  const relations = useStore((s) => s.sociograma.relations)
  const nodes = useStore((s) => s.sociograma.nodes)
  const setNodes = useStore((s) => s.setNodes)
  const addNode = useStore((s) => s.addNode)

  const applyLayout = () => {
    // Sync students → nodes
    const existingIds = new Set(nodes.map((n) => n.id))
    students.forEach((st) => {
      if (!existingIds.has(st.id)) {
        addNode('sociograma', {
          id: st.id,
          type: 'student',
          position: { x: 0, y: 0 },
          data: { label: st.name, nodeType: 'student' },
        })
      }
    })
    const currentNodes = useStore.getState().sociograma.nodes
    const laid = applyForceLayout(currentNodes, relations)
    setNodes('sociograma', laid)
  }

  const topBarExtra = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowMatrix((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium"
      >
        <TableProperties className="w-4 h-4" />
        Matriz
      </button>
      <button
        onClick={applyLayout}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-100 hover:bg-violet-200 dark:bg-violet-900 dark:hover:bg-violet-800 text-sm font-medium text-violet-800 dark:text-violet-200"
      >
        <Network className="w-4 h-4" />
        Generar
      </button>
    </div>
  )

  return (
    <div className="flex flex-col h-screen">
      <AppShell module="sociograma" title="Sociograma" defaultEdgeType="positive" topBarExtra={topBarExtra} />
      {showMatrix && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowMatrix(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
              Matriz de relaciones
            </div>
            <RelationMatrix />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Sociograma() {
  return (
    <ReactFlowProvider>
      <SociogramaContent />
    </ReactFlowProvider>
  )
}
```

- [ ] **Step 3: Verify in browser**

Ir a `/sociograma`. Abrir Matriz, añadir alumnos, marcar relaciones, pulsar Generar → nodos deben aparecer en el canvas con layout de fuerzas.

- [ ] **Step 4: Commit**

```bash
git add src/components/sociogram/ src/pages/Sociograma.tsx
git commit -m "feat: complete Sociograma page with RelationMatrix and force layout"
```

---

### Task 14: Run Full Test Suite + Final Verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```
Expected: todos los tests PASS. Corregir cualquier fallo antes de continuar.

- [ ] **Step 2: Build production bundle**

```bash
npm run build
```
Expected: sin errores de TypeScript ni de build.

- [ ] **Step 3: Verify dark mode**

En el navegador: alternar ThemeToggle en cada módulo. Verificar que nodos, canvas y paneles cambian de tema.

- [ ] **Step 4: Verify mobile layout**

Abrir DevTools → modo responsive 375px. Verificar: sidebar oculto, BottomDrawer visible, tap en nodo abre modal.

- [ ] **Step 5: Verify export**

Añadir varios nodos, pulsar Exportar → PNG. Verificar que se descarga el archivo.

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: PsicoMap v1.0 — Genograma, Familiograma, Sociograma completos"
```
