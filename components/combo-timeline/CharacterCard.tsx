'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { TIMELINE_ROW_HEIGHT_PX } from '@/lib/timeline'
import type { Operator } from '@/types/combo'

interface CharacterCardProps {
  character: Operator | null
  index: number
  onOpenSelector: (index: number) => void
}

export default function CharacterCard({
  character,
  index,
  onOpenSelector,
}: CharacterCardProps) {
  const t = useTranslations()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: `slot-${index}`,
    disabled: !character,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.5 : 1,
    height: TIMELINE_ROW_HEIGHT_PX,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch">
      <div className="w-40 shrink-0">
        <div className={`bg-gray-700 p-2 rounded h-40 relative ${character ? 'cursor-pointer' : ''}`}>
          {character ? (
            <button
              type="button"
              className="absolute right-2 top-2 h-6 w-6 rounded bg-transparent hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={t('team.dragHandle')}
              {...attributes}
              {...listeners}
            >
              <span className="sr-only">{t('team.dragHandle')}</span>
            </button>
          ) : null}
          {character ? (
            <button
              type="button"
              onClick={() => {
                if (!isDragging) {
                  onOpenSelector(index)
                }
              }}
              data-testid={`character-slot-${index}`}
              className="w-full h-full"
              aria-label={t('team.selectCharacter')}
            >
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-24 w-24 rounded bg-gray-600 overflow-hidden flex items-center justify-center">
                    {character.imageUrl ? (
                      <Image
                        src={character.imageUrl}
                        alt={character?.name ? t(character.name) : ''}
                        width={96}
                        height={96}
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
              onClick={() => onOpenSelector(index)}
              data-testid={`character-slot-${index}`}
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
  )
}
