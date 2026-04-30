import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string, values?: Record<string, string | number>) => {
		if (!values) return key
		return Object.entries(values).reduce((acc, [name, value]) => {
			return acc.replace(`{${name}}`, String(value))
		}, key)
	},
}))

vi.mock('next/image', () => ({
	default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
		return React.createElement('img', props)
	},
}))
