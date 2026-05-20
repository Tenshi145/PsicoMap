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
