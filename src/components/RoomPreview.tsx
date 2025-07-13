'use client'

import { useState } from 'react'

interface EscapeRoom {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'navigation' | 'safety' | 'cargo' | 'emergency' | 'communication' | 'maintenance'
  estimatedTime: number
  scenarios: any[]
  puzzles: any[]
  settings: any
}

interface RoomPreviewProps {
  room: EscapeRoom
}

export default function RoomPreview({ room }: RoomPreviewProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerProgress, setPlayerProgress] = useState({
    completedPuzzles: 0,
    totalPoints: 0,
    hintsUsed: 0,
    timeElapsed: 0
  })

  const startPreview = () => {
    setIsPlaying(true)
    setCurrentScenario(0)
    setCurrentPuzzle(0)
    setPlayerProgress({
      completedPuzzles: 0,
      totalPoints: 0,
      hintsUsed: 0,
      timeElapsed: 0
    })
  }

  const stopPreview = () => {
    setIsPlaying(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green'
      case 'intermediate': return 'yellow'
      case 'advanced': return 'red'
      default: return 'gray'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return '🧭'
      case 'safety': return '🦺'
      case 'cargo': return '📦'
      case 'emergency': return '🚨'
      case 'communication': return '📡'
      case 'maintenance': return '🔧'
      default: return '🚢'
    }
  }

  if (!isPlaying) {
    return (
      <div className="space-y-6">
        {/* Room Overview */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className={`h-3 bg-${getDifficultyColor(room.difficulty)}-500`}></div>
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{getCategoryIcon(room.category)}</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{room.title}</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">{room.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="font-semibold text-gray-800">{room.estimatedTime} min</div>
                <div className="text-sm text-gray-500">Geschatte tijd</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🧩</div>
                <div className="font-semibold text-gray-800">{room.puzzles.length}</div>
                <div className="text-sm text-gray-500">Puzzels</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📍</div>
                <div className="font-semibold text-gray-800">{room.scenarios.length}</div>
                <div className="text-sm text-gray-500">Scenario's</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <div className={`font-semibold text-${getDifficultyColor(room.difficulty)}-600`}>
                  {room.difficulty === 'beginner' ? 'Beginner' :
                   room.difficulty === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
                </div>
                <div className="text-sm text-gray-500">Niveau</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startPreview}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                🎮 Start Preview
              </button>
            </div>
          </div>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenarios */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                🎬
              </span>
              Scenario's
            </h3>
            
            {room.scenarios.length === 0 ? (
              <p className="text-gray-500 italic">Nog geen scenario's toegevoegd</p>
            ) : (
              <div className="space-y-3">
                {room.scenarios.map((scenario, index) => (
                  <div key={scenario.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-gray-800">{scenario.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{scenario.description}</p>
                    {scenario.objectives && scenario.objectives.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">{scenario.objectives.length} leerdoelen</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Puzzles */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
                🧩
              </span>
              Puzzels
            </h3>
            
            {room.puzzles.length === 0 ? (
              <p className="text-gray-500 italic">Nog geen puzzels toegevoegd</p>
            ) : (
              <div className="space-y-3">
                {room.puzzles.map((puzzle, index) => (
                  <div key={puzzle.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {puzzle.type === 'code' ? '🔢' :
                           puzzle.type === 'sequence' ? '📋' :
                           puzzle.type === 'matching' ? '🔗' :
                           puzzle.type === 'navigation' ? '🧭' :
                           puzzle.type === 'calculation' ? '🧮' :
                           puzzle.type === 'inspection' ? '🔍' : '🧩'}
                        </span>
                        <h4 className="font-medium text-gray-800">{puzzle.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600 font-medium">{puzzle.points}pt</span>
                        {puzzle.requiredForProgress && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Verplicht
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{puzzle.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Playing mode - simplified preview
  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{room.title}</h2>
            <p className="text-gray-600">Preview Mode - Scenario {currentScenario + 1} van {room.scenarios.length}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{playerProgress.totalPoints}</div>
              <div className="text-xs text-gray-500">Punten</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{playerProgress.completedPuzzles}/{room.puzzles.length}</div>
              <div className="text-xs text-gray-500">Puzzels</div>
            </div>
            <button
              onClick={stopPreview}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Preview
            </button>
          </div>
        </div>
      </div>

      {/* Current Scenario */}
      {room.scenarios[currentScenario] && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {room.scenarios[currentScenario].backgroundImage && (
            <div className="h-64 bg-cover bg-center relative" style={{
              backgroundImage: `url(${room.scenarios[currentScenario].backgroundImage})`
            }}>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{room.scenarios[currentScenario].title}</h3>
                  <p className="text-lg">{room.scenarios[currentScenario].description}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {!room.scenarios[currentScenario].backgroundImage && (
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{room.scenarios[currentScenario].title}</h3>
                <p className="text-gray-600">{room.scenarios[currentScenario].description}</p>
              </div>
            )}

            {room.scenarios[currentScenario].objectives && room.scenarios[currentScenario].objectives.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Doelstellingen:</h4>
                <ul className="space-y-1">
                  {room.scenarios[currentScenario].objectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Puzzle */}
      {room.puzzles[currentPuzzle] && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="text-2xl mr-2">
                {room.puzzles[currentPuzzle].type === 'code' ? '🔢' :
                 room.puzzles[currentPuzzle].type === 'sequence' ? '📋' :
                 room.puzzles[currentPuzzle].type === 'matching' ? '🔗' :
                 room.puzzles[currentPuzzle].type === 'navigation' ? '🧭' :
                 room.puzzles[currentPuzzle].type === 'calculation' ? '🧮' :
                 room.puzzles[currentPuzzle].type === 'inspection' ? '🔍' : '🧩'}
              </span>
              {room.puzzles[currentPuzzle].title}
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {room.puzzles[currentPuzzle].points} punten
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{room.puzzles[currentPuzzle].description}</p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-center text-gray-500 italic">
              [Preview Mode - Puzzel interactie wordt hier getoond]
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setPlayerProgress(prev => ({
                    ...prev,
                    completedPuzzles: prev.completedPuzzles + 1,
                    totalPoints: prev.totalPoints + room.puzzles[currentPuzzle].points
                  }))
                  if (currentPuzzle < room.puzzles.length - 1) {
                    setCurrentPuzzle(currentPuzzle + 1)
                  }
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Puzzel Oplossen (Preview)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setCurrentScenario(Math.max(0, currentScenario - 1))}
          disabled={currentScenario === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Vorige Scene
        </button>
        
        <button
          onClick={() => setCurrentScenario(Math.min(room.scenarios.length - 1, currentScenario + 1))}
          disabled={currentScenario >= room.scenarios.length - 1}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volgende Scene →
        </button>
      </div>
    </div>
  )
}