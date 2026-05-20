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
