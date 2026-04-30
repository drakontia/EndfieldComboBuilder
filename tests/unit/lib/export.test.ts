import { describe, it, expect, vi, beforeEach } from 'vitest'

import { exportAsImage } from '@/lib/export'

const html2canvasMock = vi.hoisted(() =>
  vi.fn(async () => ({
    toDataURL: () => 'data:image/png;base64,AAA',
  }))
)

vi.mock('html2canvas', () => ({
  default: (...args: unknown[]) => html2canvasMock(...args),
}))

describe('exportAsImage', () => {
  beforeEach(() => {
    html2canvasMock.mockClear()
  })

  it('exports an element as an image', async () => {
    const element = document.createElement('div')
    element.id = 'combo-timeline'
    document.body.appendChild(element)

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await exportAsImage('combo-timeline', 'combo.png')

    expect(html2canvasMock).toHaveBeenCalledWith(element, {
      backgroundColor: '#1a1a1a',
      scale: 2,
    })
    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
    document.body.removeChild(element)
  })

  it('throws when the element is missing', async () => {
    await expect(exportAsImage('missing-element')).rejects.toThrow('Element not found')
  })
})
