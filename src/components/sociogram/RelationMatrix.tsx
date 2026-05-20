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
