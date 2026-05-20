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
