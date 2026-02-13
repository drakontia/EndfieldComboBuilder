import html2canvas from 'html2canvas'

export const exportAsImage = async (elementId: string, filename: string = 'combo.png'): Promise<void> => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Element not found')
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#1a1a1a',
      scale: 2,
    })

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Failed to export image:', error)
    throw error
  }
}
