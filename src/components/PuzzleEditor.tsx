'use client'

import { useState } from 'react'

interface Puzzle {
  id: string
  type: 'code' | 'sequence' | 'matching' | 'navigation' | 'calculation' | 'inspection'
  title: string
  description: string
  solution: any
  hints: string[]
  points: number
  timeLimit?: number
  requiredForProgress: boolean
}

interface PuzzleEditorProps {
  puzzles: Puzzle[]
  onPuzzlesChange: (puzzles: Puzzle[]) => void
}

const PUZZLE_TYPES = [
  { 
    id: 'code', 
    name: 'Code Invoer', 
    icon: '🔢', 
    description: 'Numerieke of alfanumerieke codes',
    example: 'Navigatiecode, veiligheidssleutel'
  },
  { 
    id: 'sequence', 
    name: 'Volgorde', 
    icon: '📋', 
    description: 'Juiste volgorde van acties',
    example: 'Noodprocedure stappen, startup sequence'
  },
  { 
    id: 'matching', 
    name: 'Koppelen', 
    icon: '🔗', 
    description: 'Items aan elkaar koppelen',
    example: 'Signalen aan betekenis, tools aan functie'
  },
  { 
    id: 'navigation', 
    name: 'Navigatie', 
    icon: '🧭', 
    description: 'Kaart en koers puzzels',
    example: 'Route plannen, positie bepalen'
  },
  { 
    id: 'calculation', 
    name: 'Berekening', 
    icon: '🧮', 
    description: 'Maritieme berekeningen',
    example: 'Brandstof, stabiliteit, tijd/afstand'
  },
  { 
    id: 'inspection', 
    name: 'Inspectie', 
    icon: '🔍', 
    description: 'Visuele controle en analyse',
    example: 'Defecten zoeken, veiligheid checken'
  }
]

export default function PuzzleEditor({ puzzles, onPuzzlesChange }: PuzzleEditorProps) {
  const [selectedPuzzle, setSelectedPuzzle] = useState<string | null>(null)
  const [showTypeSelector, setShowTypeSelector] = useState(false)

  const createNewPuzzle = (type: Puzzle['type']) => {
    const puzzleType = PUZZLE_TYPES.find(t => t.id === type)
    const newPuzzle: Puzzle = {
      id: `puzzle_${Date.now()}`,
      type,
      title: `Nieuwe ${puzzleType?.name || 'Puzzel'}`,
      description: 'Beschrijf de uitdaging...',
      solution: getDefaultSolution(type),
      hints: [],
      points: 10,
      requiredForProgress: false
    }
    
    onPuzzlesChange([...puzzles, newPuzzle])
    setSelectedPuzzle(newPuzzle.id)
    setShowTypeSelector(false)
  }

  const getDefaultSolution = (type: Puzzle['type']) => {
    switch (type) {
      case 'code':
        return { code: '1234', caseSensitive: false }
      case 'sequence':
        return { steps: ['Stap 1', 'Stap 2', 'Stap 3'] }
      case 'matching':
        return { pairs: [{ left: 'Item A', right: 'Match A' }] }
      case 'navigation':
        return { coordinates: { lat: 52.3676, lng: 4.9041 }, tolerance: 0.1 }
      case 'calculation':
        return { formula: 'distance = speed * time', answer: 100, tolerance: 5 }
      case 'inspection':
        return { defects: [{ x: 50, y: 50, description: 'Defect hier' }] }
      default:
        return {}
    }
  }

  const updatePuzzle = (id: string, updates: Partial<Puzzle>) => {
    onPuzzlesChange(puzzles.map(puzzle => 
      puzzle.id === id ? { ...puzzle, ...updates } : puzzle
    ))
  }

  const deletePuzzle = (id: string) => {
    onPuzzlesChange(puzzles.filter(puzzle => puzzle.id !== id))
    if (selectedPuzzle === id) {
      setSelectedPuzzle(null)
    }
  }

  const addHint = (puzzleId: string) => {
    const puzzle = puzzles.find(p => p.id === puzzleId)
    if (puzzle) {
      updatePuzzle(puzzleId, {
        hints: [...puzzle.hints, 'Nieuwe hint...']
      })
    }
  }

  const updateHint = (puzzleId: string, index: number, value: string) => {
    const puzzle = puzzles.find(p => p.id === puzzleId)
    if (puzzle) {
      const newHints = [...puzzle.hints]
      newHints[index] = value
      updatePuzzle(puzzleId, { hints: newHints })
    }
  }

  const removeHint = (puzzleId: string, index: number) => {
    const puzzle = puzzles.find(p => p.id === puzzleId)
    if (puzzle) {
      updatePuzzle(puzzleId, {
        hints: puzzle.hints.filter((_, i) => i !== index)
      })
    }
  }

  const selectedPuzzleData = puzzles.find(p => p.id === selectedPuzzle)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
              🧩
            </span>
            Puzzels & Uitdagingen
          </h3>
          <button
            onClick={() => setShowTypeSelector(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            ➕ Nieuwe Puzzel
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Type Selector Modal */}
        {showTypeSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-800">Kies Puzzel Type</h4>
                <button
                  onClick={() => setShowTypeSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ❌
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PUZZLE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => createNewPuzzle(type.id as Puzzle['type'])}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h5 className="font-semibold text-gray-800 mb-1">{type.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <p className="text-xs text-green-600 italic">{type.example}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {puzzles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🧩</div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">Geen puzzels</h4>
            <p className="text-gray-500 mb-4">Voeg interactieve uitdagingen toe</p>
            <button
              onClick={() => setShowTypeSelector(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Maak eerste puzzel
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Puzzle List */}
            <div className="grid grid-cols-1 gap-3">
              {puzzles.map((puzzle, index) => {
                const puzzleType = PUZZLE_TYPES.find(t => t.id === puzzle.type)
                return (
                  <div
                    key={puzzle.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPuzzle === puzzle.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedPuzzle(puzzle.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{puzzleType?.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-800">{puzzle.title}</h4>
                          <p className="text-sm text-gray-500">{puzzleType?.name} • {puzzle.points} punten</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {puzzle.requiredForProgress && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Verplicht
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePuzzle(puzzle.id)
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Puzzle Editor */}
            {selectedPuzzleData && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Puzzel bewerken</h4>
                
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                      <input
                        type="text"
                        value={selectedPuzzleData.title}
                        onChange={(e) => updatePuzzle(selectedPuzzleData.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Punten</label>
                      <input
                        type="number"
                        value={selectedPuzzleData.points}
                        onChange={(e) => updatePuzzle(selectedPuzzleData.id, { points: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        min="1"
                        max="100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tijdslimiet (sec)</label>
                      <input
                        type="number"
                        value={selectedPuzzleData.timeLimit || ''}
                        onChange={(e) => updatePuzzle(selectedPuzzleData.id, { 
                          timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Geen limiet"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                    <textarea
                      value={selectedPuzzleData.description}
                      onChange={(e) => updatePuzzle(selectedPuzzleData.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={3}
                      placeholder="Beschrijf de uitdaging en wat de speler moet doen..."
                    />
                  </div>

                  {/* Required checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${selectedPuzzleData.id}`}
                      checked={selectedPuzzleData.requiredForProgress}
                      onChange={(e) => updatePuzzle(selectedPuzzleData.id, { requiredForProgress: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`required-${selectedPuzzleData.id}`} className="ml-2 block text-sm text-gray-700">
                      Verplicht voor voortgang
                    </label>
                  </div>

                  {/* Solution Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oplossing</label>
                    <div className="p-3 bg-white border border-gray-300 rounded-lg">
                      {selectedPuzzleData.type === 'code' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={selectedPuzzleData.solution.code || ''}
                            onChange={(e) => updatePuzzle(selectedPuzzleData.id, {
                              solution: { ...selectedPuzzleData.solution, code: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Voer de juiste code in..."
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPuzzleData.solution.caseSensitive || false}
                              onChange={(e) => updatePuzzle(selectedPuzzleData.id, {
                                solution: { ...selectedPuzzleData.solution, caseSensitive: e.target.checked }
                              })}
                              className="mr-2"
                            />
                            Hoofdlettergevoelig
                          </label>
                        </div>
                      )}
                      
                      {selectedPuzzleData.type === 'calculation' && (
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={selectedPuzzleData.solution.answer || ''}
                            onChange={(e) => updatePuzzle(selectedPuzzleData.id, {
                              solution: { ...selectedPuzzleData.solution, answer: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Juiste antwoord..."
                          />
                          <input
                            type="number"
                            value={selectedPuzzleData.solution.tolerance || ''}
                            onChange={(e) => updatePuzzle(selectedPuzzleData.id, {
                              solution: { ...selectedPuzzleData.solution, tolerance: parseFloat(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Tolerantie (bijv. 0.1)"
                          />
                        </div>
                      )}
                      
                      {/* Add more solution types as needed */}
                      {!['code', 'calculation'].includes(selectedPuzzleData.type) && (
                        <p className="text-sm text-gray-500 italic">
                          Oplossing configuratie voor {PUZZLE_TYPES.find(t => t.id === selectedPuzzleData.type)?.name} komt binnenkort...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hints */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Hints</label>
                      <button
                        onClick={() => addHint(selectedPuzzleData.id)}
                        className="text-sm text-green-600 hover:text-green-700"
                      >
                        ➕ Hint toevoegen
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedPuzzleData.hints.map((hint, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                          <input
                            type="text"
                            value={hint}
                            onChange={(e) => updateHint(selectedPuzzleData.id, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Beschrijf de hint..."
                          />
                          <button
                            onClick={() => removeHint(selectedPuzzleData.id, index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}