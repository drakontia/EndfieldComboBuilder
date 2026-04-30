'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import CharacterSelectDialog from '@/components/CharacterSelectDialog'
import CharacterCard from '@/components/combo-timeline/CharacterCard'
import { OPERATORS } from '@/lib/data/operators'

import type { Operator } from '@/types/combo'

interface CharacterColumnProps {
  characters: (Operator | null)[]
  onCharacterSelect: (character: Operator | null, index: number) => void
  onCharacterReorder: (fromIndex: number, toIndex: number) => void
}

export default function CharacterColumn({
  characters,
  onCharacterSelect,
  onCharacterReorder,
}: CharacterColumnProps) {
  const t = useTranslations()
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [selectingSlotIndex, setSelectingSlotIndex] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        (character) => !characters.some((selectedCharacter) => selectedCharacter?.name === character.operator.name)
      ),
    [availableCharacters, characters]
  )

  const getSlotIndexFromId = (id: unknown) => {
    if (typeof id !== 'string') return null
    if (!id.startsWith('slot-')) return null
    const index = Number(id.replace('slot-', ''))
    return Number.isNaN(index) ? null : index
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = getSlotIndexFromId(active.id)
    const newIndex = getSlotIndexFromId(over.id)

    if (oldIndex === null || newIndex === null) return
    if (oldIndex === newIndex) return

    onCharacterReorder(oldIndex, newIndex)
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
    <>
      {isMounted ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={characters.map((_, i) => `slot-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="w-40 shrink-0 space-y-8">
              {characters.map((character, index) => (
                <CharacterCard
                  key={`slot-${index}`}
                  character={character}
                  index={index}
                  onOpenSelector={handleOpenSelector}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="w-40 shrink-0 space-y-8">
          {characters.map((character, index) => (
            <div key={`slot-${index}`} className="flex items-stretch">
              <div className="w-40 shrink-0">
                <div className={`bg-gray-700 p-2 rounded h-40 ${character ? 'cursor-move' : ''}`}>
                  {character ? (
                    <button
                      type="button"
                      onClick={() => handleOpenSelector(index)}
                      className="w-full h-full"
                      aria-label={t('team.selectCharacter')}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-12 w-12 rounded bg-gray-600 overflow-hidden flex items-center justify-center">
                            {character.imageUrl ? (
                              <Image
                                src={character.imageUrl}
                                alt={character?.name ? t(character.name) : ''}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-200">{t('team.noImage')}</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-100 text-center">
                            {character?.name ? t(character.name) : ''}
                          </span>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenSelector(index)}
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
            </div>
          ))}
        </div>
      )}

      <CharacterSelectDialog
        isOpen={isSelectorOpen}
        options={selectableCharacters}
        onClose={() => {
          setIsSelectorOpen(false)
          setSelectingSlotIndex(null)
        }}
        onSelect={handleSelectCharacter}
      />
    </>
  )
}
