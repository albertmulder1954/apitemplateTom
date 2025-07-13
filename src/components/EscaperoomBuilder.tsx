'use client'

import { useState, useRef } from 'react'
import ScenarioBuilder from './ScenarioBuilder'
import PuzzleEditor from './PuzzleEditor'
import RoomPreview from './RoomPreview'
import TemplateLibrary from './TemplateLibrary'

interface EscapeRoom {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'navigation' | 'safety' | 'cargo' | 'emergency' | 'communication' | 'maintenance'
  estimatedTime: number
  scenarios: Scenario[]
  puzzles: Puzzle[]
  settings: RoomSettings
  createdAt: Date
  updatedAt: Date
}

interface Scenario {
  id: string
  title: string
  description: string
  backgroundImage?: string
  audioNarration?: string
  objectives: string[]
  hints: string[]
  requiredItems: string[]
  connections: string[]
}

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

interface RoomSettings {
  allowHints: boolean
  timeLimit?: number
  maxAttempts?: number
  teamMode: boolean
  showProgress: boolean
  backgroundMusic?: string
  theme: 'modern' | 'classic' | 'industrial' | 'bridge'
}

const MARITIME_CATEGORIES = [
  { id: 'navigation', name: 'Navigatie', icon: '🧭', color: 'blue' },
  { id: 'safety', name: 'Veiligheid', icon: '🦺', color: 'red' },
  { id: 'cargo', name: 'Lading', icon: '📦', color: 'orange' },
  { id: 'emergency', name: 'Noodprocedures', icon: '🚨', color: 'red' },
  { id: 'communication', name: 'Communicatie', icon: '📡', color: 'green' },
  { id: 'maintenance', name: 'Onderhoud', icon: '🔧', color: 'gray' }
]

export default function EscaperoomBuilder() {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'builder' | 'preview'>('overview')
  const [currentRoom, setCurrentRoom] = useState<EscapeRoom | null>(null)
  const [savedRooms, setSavedRooms] = useState<EscapeRoom[]>([])
  const [isBuilding, setIsBuilding] = useState(false)

  const createNewRoom = (template?: Partial<EscapeRoom>) => {
    const newRoom: EscapeRoom = {
      id: `room_${Date.now()}`,
      title: template?.title || 'Nieuwe Escaperoom',
      description: template?.description || 'Beschrijving van je maritieme escaperoom...',
      difficulty: template?.difficulty || 'beginner',
      category: template?.category || 'navigation',
      estimatedTime: template?.estimatedTime || 30,
      scenarios: template?.scenarios || [],
      puzzles: template?.puzzles || [],
      settings: template?.settings || {
        allowHints: true,
        teamMode: false,
        showProgress: true,
        theme: 'modern'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setCurrentRoom(newRoom)
    setActiveTab('builder')
    setIsBuilding(true)
  }

  const saveRoom = () => {
    if (!currentRoom) return
    
    const updatedRoom = {
      ...currentRoom,
      updatedAt: new Date()
    }
    
    setSavedRooms(prev => {
      const existing = prev.findIndex(room => room.id === updatedRoom.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = updatedRoom
        return updated
      } else {
        return [...prev, updatedRoom]
      }
    })
    
    setCurrentRoom(updatedRoom)
  }

  const loadRoom = (room: EscapeRoom) => {
    setCurrentRoom(room)
    setActiveTab('builder')
    setIsBuilding(true)
  }

  const deleteRoom = (roomId: string) => {
    setSavedRooms(prev => prev.filter(room => room.id !== roomId))
    if (currentRoom?.id === roomId) {
      setCurrentRoom(null)
      setActiveTab('overview')
      setIsBuilding(false)
    }
  }

  const exportRoom = (room: EscapeRoom) => {
    const dataStr = JSON.stringify(room, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${room.title.replace(/\s+/g, '_')}_escaperoom.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const roomData = JSON.parse(e.target?.result as string)
        const importedRoom: EscapeRoom = {
          ...roomData,
          id: `room_${Date.now()}`, // New ID to avoid conflicts
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setSavedRooms(prev => [...prev, importedRoom])
      } catch (error) {
        alert('Fout bij het importeren van het bestand. Controleer of het een geldig escaperoom bestand is.')
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-white hover:shadow-sm'
          }`}
        >
          📊 Overzicht
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-white hover:shadow-sm'
          }`}
        >
          📚 Templates
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          disabled={!currentRoom}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'builder'
              ? 'bg-blue-600 text-white shadow-md'
              : currentRoom 
                ? 'text-gray-600 hover:bg-white hover:shadow-sm'
                : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          🔧 Builder
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          disabled={!currentRoom}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white shadow-md'
              : currentRoom 
                ? 'text-gray-600 hover:bg-white hover:shadow-sm'
                : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          👁️ Preview
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => createNewRoom()}
              className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-2">➕</div>
              <h3 className="font-semibold mb-1">Nieuwe Escaperoom</h3>
              <p className="text-sm text-blue-100">Start vanaf nul</p>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold mb-1">Gebruik Template</h3>
              <p className="text-sm text-green-100">Voorgebouwde scenarios</p>
            </button>

            <label className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl cursor-pointer">
              <div className="text-3xl mb-2">📥</div>
              <h3 className="font-semibold mb-1">Importeer Room</h3>
              <p className="text-sm text-purple-100">Upload JSON bestand</p>
              <input
                type="file"
                accept=".json"
                onChange={importRoom}
                className="hidden"
              />
            </label>
          </div>

          {/* Saved Rooms */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Mijn Escaperooms ({savedRooms.length})
            </h2>
            
            {savedRooms.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">🚢</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nog geen escaperooms</h3>
                <p className="text-gray-500 mb-4">Begin met het maken van je eerste maritieme escaperoom!</p>
                <button
                  onClick={() => createNewRoom()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Maak je eerste room
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRooms.map((room) => {
                  const category = MARITIME_CATEGORIES.find(cat => cat.id === room.category)
                  return (
                    <div key={room.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                      <div className={`h-2 bg-${category?.color || 'blue'}-500`}></div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{category?.icon || '🚢'}</span>
                            <div>
                              <h3 className="font-semibold text-gray-800 line-clamp-1">{room.title}</h3>
                              <p className="text-sm text-gray-500">{category?.name}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            room.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            room.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {room.difficulty === 'beginner' ? 'Beginner' :
                             room.difficulty === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>⏱️ {room.estimatedTime} min</span>
                          <span>🧩 {room.puzzles.length} puzzels</span>
                          <span>📍 {room.scenarios.length} scenes</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => loadRoom(room)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => exportRoom(room)}
                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            title="Exporteren"
                          >
                            📤
                          </button>
                          <button
                            onClick={() => deleteRoom(room.id)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                            title="Verwijderen"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <TemplateLibrary onSelectTemplate={createNewRoom} />
      )}

      {activeTab === 'builder' && currentRoom && (
        <div className="space-y-6">
          {/* Room Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                🔧 {currentRoom.title}
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={saveRoom}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  💾 Opslaan
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  👁️ Preview
                </button>
              </div>
            </div>
            
            {/* Basic Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input
                  type="text"
                  value={currentRoom.title}
                  onChange={(e) => setCurrentRoom(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                <select
                  value={currentRoom.category}
                  onChange={(e) => setCurrentRoom(prev => prev ? {...prev, category: e.target.value as any} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {MARITIME_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moeilijkheid</label>
                <select
                  value={currentRoom.difficulty}
                  onChange={(e) => setCurrentRoom(prev => prev ? {...prev, difficulty: e.target.value as any} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Gemiddeld</option>
                  <option value="advanced">🔴 Gevorderd</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geschatte tijd (min)</label>
                <input
                  type="number"
                  value={currentRoom.estimatedTime}
                  onChange={(e) => setCurrentRoom(prev => prev ? {...prev, estimatedTime: parseInt(e.target.value)} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="5"
                  max="180"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
              <textarea
                value={currentRoom.description}
                onChange={(e) => setCurrentRoom(prev => prev ? {...prev, description: e.target.value} : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Beschrijf het scenario en de leerdoelen van deze escaperoom..."
              />
            </div>
          </div>

          {/* Builder Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScenarioBuilder 
              scenarios={currentRoom.scenarios}
              onScenariosChange={(scenarios) => setCurrentRoom(prev => prev ? {...prev, scenarios} : null)}
            />
            <PuzzleEditor 
              puzzles={currentRoom.puzzles}
              onPuzzlesChange={(puzzles) => setCurrentRoom(prev => prev ? {...prev, puzzles} : null)}
            />
          </div>
        </div>
      )}

      {activeTab === 'preview' && currentRoom && (
        <RoomPreview room={currentRoom} />
      )}
    </div>
  )
}