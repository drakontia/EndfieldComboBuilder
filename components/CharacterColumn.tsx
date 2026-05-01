'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import CharacterSelectDialog from '@/components/CharacterSelectDialog'
import { Button } from '@/components/ui/button'
import { OPERATORS } from '@/lib/data/operators'

import type { Operator } from '@/types/combo'

interface CharacterColumnProps {
  characters: (Operator | null)[]
  onCharacterSelect: (character: Operator | null, index: number) => void
  onCharacterReorder: (fromIndex: number, toIndex: number) => void
  deleteMode: boolean
  onToggleDeleteMode: () => void
  deleteModeLabel: string
}

function CharacterSlotItem({
  character,
  index,
  onOpenSelector,
  deleteMode,
  onRemoveCharacter,
}: {
  character: Operator | null
  index: number
  onOpenSelector: (index: number) => void
  deleteMode: boolean
  onRemoveCharacter: (index: number) => void
}) {
  const t = useTranslations()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id: `slot-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2 bg-gray-700 rounded h-10 ${deleteMode ? '' : 'hover:bg-gray-600'} ${isDragging ? 'z-50' : ''}`}
      data-testid={`character-slot-${index}`}
    >
      <div className="flex-1 min-w-0 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <p className="text-sm font-medium text-gray-100 truncate">
          {character?.name ? t(character.name) : t('team.selectCharacter')}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 pointer-events-auto">
        {!deleteMode && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenSelector(index)}
              className="h-8 px-2 text-xs"
            >
              {t('actions.change')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveCharacter(index)}
              className="h-8 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950"
            >
              {t('actions.delete')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default function CharacterColumn({
  characters,
  onCharacterSelect,
  onCharacterReorder,
  deleteMode,
  onToggleDeleteMode,
  deleteModeLabel,
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

  const handleRemoveCharacter = (index: number) => {
    onCharacterSelect(null, index)
  }

  return (
    <>
      {isMounted ? (
        <div className="w-56 shrink-0 space-y-2">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={characters.map((_, i) => `slot-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant={deleteMode ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={onToggleDeleteMode}
                  className="w-full"
                >
                  {deleteModeLabel}
                </Button>
                {characters.map((character, index) => (
                  <CharacterSlotItem
                    key={`slot-${index}`}
                    character={character}
                    index={index}
                    onOpenSelector={handleOpenSelector}
                    deleteMode={deleteMode}
                    onRemoveCharacter={handleRemoveCharacter}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="w-56 shrink-0 space-y-2">
          <Button
            type="button"
            variant={deleteMode ? 'destructive' : 'outline'}
            size="sm"
            onClick={onToggleDeleteMode}
            className="w-full"
          >
            {deleteModeLabel}
          </Button>
          <div className="space-y-2">
            {characters.map((character, index) => (
              <div key={`slot-${index}`} className="px-3 py-2 bg-gray-700 rounded">
                <p className="text-sm font-medium text-gray-100 truncate">
                  {character?.name ? t(character.name) : t('team.selectCharacter')}
                </p>
              </div>
            ))}
          </div>
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
