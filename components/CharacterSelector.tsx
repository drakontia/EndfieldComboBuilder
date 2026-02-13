'use client'

import { Character } from '@/types/combo'
import { useState } from 'react'

interface CharacterSelectorProps {
  selectedCharacters: (Character | null)[]
  onCharacterSelect: (character: Character | null, index: number) => void
  onCharacterReorder: (fromIndex: number, toIndex: number) => void
}

// Sample characters - in a real app, these would come from a database
const AVAILABLE_CHARACTERS: Character[] = [
  { id: '1', name: 'オペレーター1' },
  { id: '2', name: 'オペレーター2' },
  { id: '3', name: 'オペレーター3' },
  { id: '4', name: 'オペレーター4' },
  { id: '5', name: 'オペレーター5' },
  { id: '6', name: 'オペレーター6' },
]

export default function CharacterSelector({
  selectedCharacters,
  onCharacterSelect,
  onCharacterReorder,
}: CharacterSelectorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
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

  return (
    <div className="w-64 bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">チーム編成</h2>
      
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
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <span>スロット {slotIndex + 1}</span>
            {slotIndex === 0 && <span className="text-yellow-400 text-xs">(自操作)</span>}
          </div>
          <div className={`bg-gray-700 p-2 rounded ${selectedCharacters[slotIndex] ? 'cursor-move' : ''}`}>
            {selectedCharacters[slotIndex] ? (
              <div className="flex items-center justify-between">
                <span>{selectedCharacters[slotIndex]?.name}</span>
                <button
                  onClick={() => onCharacterSelect(null, slotIndex)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  削除
                </button>
              </div>
            ) : (
              <select
                onChange={(e) => {
                  const char = AVAILABLE_CHARACTERS.find(c => c.id === e.target.value)
                  if (char) onCharacterSelect(char, slotIndex)
                }}
                value=""
                className="w-full bg-gray-600 text-white rounded px-2 py-1"
              >
                <option value="">選択...</option>
                {AVAILABLE_CHARACTERS.filter(
                  c => !selectedCharacters.some(sc => sc?.id === c.id)
                ).map(char => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
