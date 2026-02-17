'use client'

import { type DragEvent, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import CharacterSelectDialog from '@/components/CharacterSelectDialog'
import { OPERATORS } from '@/lib/data/operators'

import type { Operator } from '@/types/combo'

interface CharacterSelectorProps {
  selectedCharacters: (Operator | null)[]
  onCharacterSelect: (character: Operator | null, index: number) => void
  onCharacterReorder: (fromIndex: number, toIndex: number) => void
}

export default function CharacterSelector({
  selectedCharacters,
  onCharacterSelect,
  onCharacterReorder,
}: CharacterSelectorProps) {
  const t = useTranslations()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [selectingSlotIndex, setSelectingSlotIndex] = useState<number | null>(null)

  const availableCharacters = useMemo(
    () =>
      Object.entries(OPERATORS).map(([id, operator]) => ({
        id,
        operator,
      })),
    []
  )

  const selectableCharacters = useMemo(
    () =>
      availableCharacters.filter(
        (character) => !selectedCharacters.some((selectedCharacter) => selectedCharacter?.name === character.operator.name)
      ),
    [availableCharacters, selectedCharacters]
  )

  const handleDragStart = (e: DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      onCharacterReorder(draggedIndex, index)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleOpenSelector = (slotIndex: number) => {
    setSelectingSlotIndex(slotIndex)
    setIsSelectorOpen(true)
  }

  const handleSelectCharacter = (character: Operator) => {
    if (selectingSlotIndex === null) return
    onCharacterSelect(character, selectingSlotIndex)
    setIsSelectorOpen(false)
    setSelectingSlotIndex(null)
  }

  return (
    <div className="w-64 bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{t('team.title')}</h2>
      
      {[0, 1, 2, 3].map((slotIndex) => (
        <div
          key={slotIndex}
          className={`mb-4 ${dragOverIndex === slotIndex ? 'border-2 border-blue-500' : ''}`}
          draggable={!!selectedCharacters[slotIndex]}
          onDragStart={(e) => handleDragStart(e, slotIndex)}
          onDragOver={(e) => handleDragOver(e, slotIndex)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, slotIndex)}
          onDragEnd={handleDragEnd}
        >
          <div className={`bg-gray-700 p-2 rounded h-40 ${selectedCharacters[slotIndex] ? 'cursor-move' : ''}`}>
            {selectedCharacters[slotIndex] ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded bg-gray-600 overflow-hidden flex items-center justify-center">
                    {selectedCharacters[slotIndex]?.imageUrl ? (
                      <Image
                        src={selectedCharacters[slotIndex].imageUrl}
                        alt={selectedCharacters[slotIndex]?.name ? t(selectedCharacters[slotIndex].name) : ''}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-200">{t('team.noImage')}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-100 text-center">
                    {selectedCharacters[slotIndex]?.name ? t(selectedCharacters[slotIndex].name) : ''}
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenSelector(slotIndex)}
                className="w-full h-full bg-gray-600 hover:bg-gray-500 text-white rounded px-2 py-2"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded bg-gray-500/60 flex items-center justify-center">
                    <span className="text-xs text-gray-200">{t('team.noImage')}</span>
                  </div>
                  <span className="text-sm text-gray-100 text-center">{t('team.selectCharacter')}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      ))}

      <CharacterSelectDialog
        isOpen={isSelectorOpen}
        options={selectableCharacters}
        onClose={() => {
          setIsSelectorOpen(false)
          setSelectingSlotIndex(null)
        }}
        onSelect={handleSelectCharacter}
      />
    </div>
  )
}
