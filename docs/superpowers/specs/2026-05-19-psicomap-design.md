# PsicoMap — Diseño de Aplicación

**Fecha:** 2026-05-19  
**Stack:** Vite + React + TypeScript + React Flow + Tailwind CSS + Zustand + Dagre + d3-force

---

## Propósito

Aplicación web para estudiantes de psicopedagogía que permite crear y exportar tres tipos de diagramas clínicos:
- **Genograma:** Árbol familiar multigeneracional con simbología estándar.
- **Familiograma:** Variante del genograma con énfasis en dinámicas familiares.
- **Sociograma:** Representación de relaciones sociales dentro de un grupo (aula).

Los datos se almacenan exclusivamente en LocalStorage (sin backend) para proteger la privacidad de datos clínicos.

---

## Enrutamiento

React Router v6 con cuatro rutas:

| Ruta | Página | Descripción |
|---|---|---|
| `/` | `Home.tsx` | Landing con 3 botones de acceso |
| `/genograma` | `Genograma.tsx` | Módulo de genograma |
| `/familiograma` | `Familiograma.tsx` | Módulo de familiograma |
| `/sociograma` | `Sociograma.tsx` | Módulo de sociograma |

---

## Estructura de Carpetas

```
src/
├── pages/
│   ├── Home.tsx
│   ├── Genograma.tsx
│   ├── Familiograma.tsx
│   └── Sociograma.tsx
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        # Wrapper con sidebar + área de canvas
│   │   ├── Sidebar.tsx         # Toolbox desktop (drag & drop)
│   │   ├── BottomDrawer.tsx    # Toolbox móvil (bottom sheet)
│   │   └── MetaPanel.tsx       # Panel derecho desktop / Modal móvil
│   ├── nodes/
│   │   ├── MaleNode.tsx        # Cuadrado — representa hombre
│   │   ├── FemaleNode.tsx      # Círculo — representa mujer
│   │   ├── PregnancyNode.tsx   # Triángulo — representa embarazo
│   │   ├── DeceasedNode.tsx    # Con X superpuesta — representa fallecido
│   │   └── StudentNode.tsx     # Círculo genérico — representa alumno (sociograma)
│   ├── edges/
│   │   ├── NormalEdge.tsx      # Línea continua — relación normal
│   │   ├── FusedEdge.tsx       # Doble línea — relación fusionada
│   │   ├── ConflictEdge.tsx    # Zigzag — relación conflictiva
│   │   ├── BreakEdge.tsx       # Línea cortada — ruptura
│   │   ├── PositiveEdge.tsx    # Verde continua con flecha — simpatía (sociograma)
│   │   └── NegativeEdge.tsx    # Roja punteada con flecha — rechazo (sociograma)
│   ├── canvas/
│   │   ├── FlowCanvas.tsx      # Wrapper reutilizable de ReactFlow
│   │   └── HouseholdBound.tsx  # Área/recuadro "límite del hogar"
│   ├── sociogram/
│   │   └── RelationMatrix.tsx  # Tabla de entrada de elecciones y rechazos
│   └── ui/
│       ├── NodeMetaForm.tsx    # Formulario nombre/edad/ocupación/notas
│       ├── ExportButton.tsx    # Exportar a PNG o PDF
│       └── ThemeToggle.tsx     # Toggle modo oscuro/claro
├── store/
│   ├── index.ts                # Store Zustand unificado con persist
│   └── slices/
│       ├── appSlice.ts         # tema, isMobile, estados de UI global
│       ├── genogramaSlice.ts
│       ├── familiogramaSlice.ts
│       └── sociogramaSlice.ts
├── utils/
│   ├── layout/
│   │   ├── dagreLayout.ts      # Layout jerárquico para genograma/familiograma
│   │   └── forceLayout.ts      # d3-force para sociograma
│   └── export/
│       ├── exportPng.ts        # html2canvas → PNG
│       └── exportPdf.ts        # html2canvas + jsPDF → PDF
└── router.tsx
```

---

## Modelo de Datos

### Metadatos de Nodo (`node.data`)

```ts
interface NodeMeta {
  label: string;
  age?: number;
  occupation?: string;
  medicalNotes?: string;
  studentName?: string;  // exclusivo de sociograma
}
```

### Estado por módulo de flujo

```ts
interface HouseholdBound {
  id: string;
  nodeIds: string[];   // nodos que engloba
  label?: string;
}

interface FlowModuleState {
  nodes: Node<NodeMeta>[];
  edges: Edge[];
  selectedNodeId: string | null;
  householdBounds: HouseholdBound[];
}
```

### Estado del Sociograma

```ts
interface Student {
  id: string;
  name: string;
}

type RelationType = 'positive' | 'negative';

interface Relation {
  from: string;   // student id
  to: string;     // student id
  type: RelationType;
}

interface SociogramaState extends FlowModuleState {
  students: Student[];
  relations: Relation[];
}
```

### Estado global de la App

```ts
interface AppState {
  theme: 'light' | 'dark';
  isMobile: boolean;
  isBottomDrawerOpen: boolean;
  isMetaPanelOpen: boolean;
}
```

### Store raíz

```ts
interface RootStore {
  app: AppState;
  genograma: FlowModuleState;
  familiograma: FlowModuleState;
  sociograma: SociogramaState;
}
```

**Persistencia:** `zustand/middleware/persist` → `localStorage`, clave `psicomap-v1`.

---

## Tipos de Nodos

| Nodo | Forma | Módulo |
|---|---|---|
| `male` | Cuadrado SVG | Genograma, Familiograma |
| `female` | Círculo SVG | Genograma, Familiograma |
| `pregnancy` | Triángulo SVG | Genograma, Familiograma |
| `deceased` | Forma base + X superpuesta | Genograma, Familiograma |
| `student` | Círculo con inicial | Sociograma |

---

## Tipos de Aristas

| Edge | Estilo | Módulo |
|---|---|---|
| `normal` | Línea continua | Genograma, Familiograma |
| `fused` | Doble línea paralela | Genograma, Familiograma |
| `conflict` | Zigzag SVG path | Genograma, Familiograma |
| `break` | Línea cortada/dash | Genograma, Familiograma |
| `positive` | Verde, continua, flecha | Sociograma |
| `negative` | Roja, punteada, flecha | Sociograma |

---

## Layout Automático

### Dagre (Genograma / Familiograma)
- Dirección: `TB` (top-to-bottom)
- Jerarquía: abuelos arriba → padres medio → hijos abajo
- Se aplica al pulsar "Auto Layout" en la barra de herramientas
- Tras el layout, React Flow hace `fitView`

### d3-force (Sociograma)
- Se recalcula al modificar la `RelationMatrix`
- Nodos con más elecciones positivas → fuerzas de atracción al centro
- Nodos aislados → quedan en la periferia
- Resultado: posiciones `{x, y}` que se aplican al store

---

## Layout Responsivo

### Desktop (≥ md / 768px)
- `Sidebar` fijo a la izquierda (w-64): drag & drop de tipos de nodos
- `FlowCanvas` en el centro: ocupa el espacio restante
- `MetaPanel` deslizable a la derecha (w-80): aparece al seleccionar un nodo
- Barra superior: nombre del módulo, Auto Layout, Export, ThemeToggle

### Mobile (< md)
- Sidebar y MetaPanel ocultos
- `FlowCanvas` ocupa 100% del viewport
- `BottomDrawer` deslizable desde abajo: íconos de tipos de nodos; tap = insertar nodo en el centro del viewport
- Al tocar un nodo: `MetaPanel` se abre como Modal superpuesto
- React Flow: `panOnScroll`, `zoomOnPinch`, targets ≥ 44px

---

## Exportación

- **PNG:** `html2canvas` sobre el elemento DOM del canvas → descarga directa
- **PDF:** `html2canvas` → imagen → `jsPDF` → descarga directa
- Botón `ExportButton` en la barra superior con selector PNG/PDF

---

## Modo Oscuro / Claro

- `tailwind.config`: `darkMode: 'class'`
- `appSlice` controla `theme`; al cambiar, se aplica/quita la clase `dark` en `document.documentElement`
- Colores de nodos y aristas adaptan via clases Tailwind `dark:`

---

## Dependencias Planeadas

```
react-router-dom        # enrutamiento
@xyflow/react           # React Flow v12+
zustand                 # estado global
dagre                   # layout jerárquico
d3-force                # layout sociograma
html2canvas             # captura de canvas a imagen
jspdf                   # generación de PDF
lucide-react            # íconos
tailwindcss             # estilos
@tailwindcss/vite       # plugin Vite para Tailwind v4
```

---

## Fases de Implementación

1. **Fase 1:** Scaffolding del proyecto, dependencias, estructura de carpetas, enrutador básico, navegación entre módulos.
2. **Fase 2:** `FlowCanvas` reutilizable, nodos custom (male, female, pregnancy, deceased, student), aristas custom, store base.
3. **Fase 3:** Módulos Genograma y Familiograma completos: formulario de metadatos, layout Dagre, límite del hogar.
4. **Fase 4:** Módulo Sociograma: `RelationMatrix`, layout d3-force, aristas dirigidas.
5. **Fase 5:** Layout responsivo completo: Sidebar, BottomDrawer, MetaPanel/Modal.
6. **Fase 6:** Exportación PNG/PDF, modo oscuro, pulido final.
