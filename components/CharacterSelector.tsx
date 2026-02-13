'use client'

import { Character } from '@/types/combo'

interface CharacterSelectorProps {
  selectedCharacters: Character[]
  onCharacterSelect: (character: Character, index: number) => void
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
}: CharacterSelectorProps) {
  return (
    <div className="w-64 bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">チーム編成</h2>
      
      {[0, 1, 2, 3].map((slotIndex) => (
        <div key={slotIndex} className="mb-4">
          <div className="text-sm text-gray-400 mb-2">スロット {slotIndex + 1}</div>
          <div className="bg-gray-700 p-2 rounded">
            {selectedCharacters[slotIndex] ? (
              <div className="flex items-center justify-between">
                <span>{selectedCharacters[slotIndex].name}</span>
                <button
                  onClick={() => onCharacterSelect(null as any, slotIndex)}
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
