'use client'

import { useState } from 'react'

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

interface ScenarioBuilderProps {
  scenarios: Scenario[]
  onScenariosChange: (scenarios: Scenario[]) => void
}

const MARITIME_BACKGROUNDS = [
  { id: 'bridge', name: 'Scheepsbrug', url: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg' },
  { id: 'engine_room', name: 'Machinekamer', url: 'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg' },
  { id: 'deck', name: 'Dek', url: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg' },
  { id: 'cargo_hold', name: 'Laadruim', url: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg' },
  { id: 'port', name: 'Haven', url: 'https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg' },
  { id: 'navigation', name: 'Navigatieruimte', url: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg' }
]

export default function ScenarioBuilder({ scenarios, onScenariosChange }: ScenarioBuilderProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const createNewScenario = () => {
    const newScenario: Scenario = {
      id: `scenario_${Date.now()}`,
      title: 'Nieuwe Scene',
      description: 'Beschrijf wat er gebeurt in deze scene...',
      objectives: [],
      hints: [],
      requiredItems: [],
      connections: []
    }
    
    onScenariosChange([...scenarios, newScenario])
    setSelectedScenario(newScenario.id)
    setIsCreating(true)
  }

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    onScenariosChange(scenarios.map(scenario => 
      scenario.id === id ? { ...scenario, ...updates } : scenario
    ))
  }

  const deleteScenario = (id: string) => {
    onScenariosChange(scenarios.filter(scenario => scenario.id !== id))
    if (selectedScenario === id) {
      setSelectedScenario(null)
    }
  }

  const addObjective = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (scenario) {
      updateScenario(scenarioId, {
        objectives: [...scenario.objectives, 'Nieuw leerdoel...']
      })
    }
  }

  const updateObjective = (scenarioId: string, index: number, value: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (scenario) {
      const newObjectives = [...scenario.objectives]
      newObjectives[index] = value
      updateScenario(scenarioId, { objectives: newObjectives })
    }
  }

  const removeObjective = (scenarioId: string, index: number) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (scenario) {
      updateScenario(scenarioId, {
        objectives: scenario.objectives.filter((_, i) => i !== index)
      })
    }
  }

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              🎬
            </span>
            Scenario's & Scenes
          </h3>
          <button
            onClick={createNewScenario}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            ➕ Nieuwe Scene
          </button>
        </div>
      </div>

      <div className="p-6">
        {scenarios.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎬</div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">Geen scenario's</h4>
            <p className="text-gray-500 mb-4">Begin met het maken van je eerste scene</p>
            <button
              onClick={createNewScenario}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Maak eerste scene
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scenario List */}
            <div className="grid grid-cols-1 gap-3">
              {scenarios.map((scenario, index) => (
                <div
                  key={scenario.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedScenario === scenario.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-800">{scenario.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{scenario.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        {scenario.objectives.length} doelen
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteScenario(scenario.id)
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scenario Editor */}
            {selectedScenarioData && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Scene bewerken</h4>
                
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                      <input
                        type="text"
                        value={selectedScenarioData.title}
                        onChange={(e) => updateScenario(selectedScenarioData.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achtergrond</label>
                      <select
                        value={selectedScenarioData.backgroundImage || ''}
                        onChange={(e) => updateScenario(selectedScenarioData.id, { backgroundImage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Geen achtergrond</option>
                        {MARITIME_BACKGROUNDS.map(bg => (
                          <option key={bg.id} value={bg.url}>{bg.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                    <textarea
                      value={selectedScenarioData.description}
                      onChange={(e) => updateScenario(selectedScenarioData.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Beschrijf wat er gebeurt in deze scene..."
                    />
                  </div>

                  {/* Objectives */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Leerdoelen</label>
                      <button
                        onClick={() => addObjective(selectedScenarioData.id)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        ➕ Doel toevoegen
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedScenarioData.objectives.map((objective, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={objective}
                            onChange={(e) => updateObjective(selectedScenarioData.id, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Beschrijf het leerdoel..."
                          />
                          <button
                            onClick={() => removeObjective(selectedScenarioData.id, index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Background Preview */}
                  {selectedScenarioData.backgroundImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Achtergrond preview</label>
                      <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                        <img
                          src={selectedScenarioData.backgroundImage}
                          alt="Scene achtergrond"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}