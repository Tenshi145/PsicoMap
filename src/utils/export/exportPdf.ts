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
