'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { CharacterElement, CharcterType } from '@/types/combo'
import type { Operator } from '@/types/combo'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CharacterOption {
  id: string
  operator: Operator
}

interface CharacterSelectDialogProps {
  isOpen: boolean
  options: CharacterOption[]
  onClose: () => void
  onSelect: (operator: Operator) => void
}

const RARITY_OPTIONS = [6, 5, 4]

export default function CharacterSelectDialog({
  isOpen,
  options,
  onClose,
  onSelect,
}: CharacterSelectDialogProps) {
  const t = useTranslations()
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<CharcterType | 'all'>('all')
  const [elementFilter, setElementFilter] = useState<CharacterElement | 'all'>('all')
  const [rarityFilter, setRarityFilter] = useState<number | 'all'>('all')

  const filteredOptions = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return options.filter((option) => {
      if (typeFilter !== 'all' && option.operator.type !== typeFilter) return false
      if (elementFilter !== 'all' && option.operator.element !== elementFilter) return false
      if (rarityFilter !== 'all' && option.operator.rarity !== rarityFilter) return false

      if (!normalizedSearch) return true
      return t(option.operator.name).toLowerCase().includes(normalizedSearch)
    })
  }, [elementFilter, options, rarityFilter, searchText, t, typeFilter])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent data-testid="character-select-dialog" className="bg-gray-800 text-white max-w-2xl w-1/2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('team.selectTitle')}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <label className="md:col-span-2 text-sm text-gray-300">
            <span className="sr-only">{t('team.searchPlaceholder')}</span>
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder={t('team.searchPlaceholder')}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            />
          </label>
          <label className="text-sm text-gray-300">
            <span className="sr-only">{t('team.filterType')}</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as CharcterType | 'all')}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="all">{t('team.filterAll')}</option>
              {Object.values(CharcterType).map((type) => (
                <option key={type} value={type}>
                  {t(`characterType.${type}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-300">
            <span className="sr-only">{t('team.filterElement')}</span>
            <select
              value={elementFilter}
              onChange={(event) => setElementFilter(event.target.value as CharacterElement | 'all')}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="all">{t('team.filterAll')}</option>
              {Object.values(CharacterElement).map((element) => (
                <option key={element} value={element}>
                  {t(`characterElement.${element}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-300">
            <span className="sr-only">{t('team.filterRarity')}</span>
            <select
              value={rarityFilter === 'all' ? 'all' : String(rarityFilter)}
              onChange={(event) => {
                const value = event.target.value
                setRarityFilter(value === 'all' ? 'all' : Number(value))
              }}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="all">{t('team.filterAll')}</option>
              {RARITY_OPTIONS.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {t(`rarity.star${rarity}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredOptions.length === 0 ? (
          <p className="text-gray-400">{t('team.noAvailable')}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.operator)}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="w-full aspect-square rounded-md bg-gray-600 flex items-center justify-center overflow-hidden mb-2 relative">
                  {option.operator.imageUrl ? (
                    <Image
                      src={option.operator.imageUrl}
                      alt={t(option.operator.name)}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-200">{t('team.noImage')}</span>
                  )}
                </div>
                <div className="text-sm font-semibold text-white">{t(option.operator.name)}</div>
              </button>
            ))}
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              {t('actions.close')}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
