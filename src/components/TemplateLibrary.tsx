'use client'

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
  createdAt: Date
  updatedAt: Date
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: Partial<EscapeRoom>) => void
}

const MARITIME_TEMPLATES = [
  {
    id: 'bridge_navigation',
    title: 'Brug Navigatie Crisis',
    description: 'Een kritieke navigatie situatie waarbij de bemanning snel moet handelen om een aanvaring te voorkomen.',
    difficulty: 'intermediate' as const,
    category: 'navigation' as const,
    estimatedTime: 45,
    scenarios: [
      {
        id: 'bridge_start',
        title: 'Brug - Nacht Wacht',
        description: 'Het is 02:00 uur en je bent wachtofficial op de brug. Plotseling verschijnen er onbekende lichten aan bakboord.',
        backgroundImage: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg',
        objectives: [
          'Identificeer de onbekende lichten',
          'Bepaal het risico op aanvaring',
          'Neem gepaste actie volgens COLREG'
        ],
        hints: [
          'Gebruik de verrekijker om de lichten beter te bekijken',
          'Check de radar voor meer informatie',
          'Denk aan de vaarregels voor kruisende koersen'
        ]
      }
    ],
    puzzles: [
      {
        id: 'light_identification',
        type: 'matching',
        title: 'Navigatielichten Identificatie',
        description: 'Koppel de waargenomen lichten aan het juiste scheepstype',
        solution: {
          pairs: [
            { left: 'Rood-Groen-Wit', right: 'Motorschip' },
            { left: 'Rood-Groen-Rood-Wit-Rood', right: 'Sleepboot met sleep' },
            { left: 'Alleen wit licht', right: 'Ankerend schip' }
          ]
        },
        hints: ['Denk aan de COLREG regels', 'Tel het aantal lichten'],
        points: 20,
        requiredForProgress: true
      }
    ]
  },
  {
    id: 'engine_emergency',
    title: 'Machinekamer Noodstop',
    description: 'Een kritieke storing in de machinekamer vereist snelle en juiste actie om erger te voorkomen.',
    difficulty: 'advanced' as const,
    category: 'emergency' as const,
    estimatedTime: 60,
    scenarios: [
      {
        id: 'engine_alarm',
        title: 'Machinekamer - Alarm',
        description: 'Het hoofdmotor alarm gaat af. Olie druk is kritiek laag en de temperatuur stijgt snel.',
        backgroundImage: 'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg',
        objectives: [
          'Identificeer de oorzaak van het alarm',
          'Voer de juiste noodprocedure uit',
          'Voorkom verdere schade aan de motor'
        ]
      }
    ],
    puzzles: [
      {
        id: 'emergency_sequence',
        type: 'sequence',
        title: 'Noodstop Procedure',
        description: 'Plaats de stappen in de juiste volgorde voor een veilige noodstop',
        solution: {
          steps: [
            'Alarm bevestigen',
            'Motor op slow zetten',
            'Brandstoftoevoer afsluiten',
            'Motor stoppen',
            'Brug informeren'
          ]
        },
        points: 30,
        requiredForProgress: true
      }
    ]
  },
  {
    id: 'cargo_safety',
    title: 'Lading Veiligheid Inspectie',
    description: 'Voor vertrek moet de lading geïnspecteerd worden op veiligheid en stabiliteit.',
    difficulty: 'beginner' as const,
    category: 'cargo' as const,
    estimatedTime: 30,
    scenarios: [
      {
        id: 'cargo_inspection',
        title: 'Laadruim - Pre-departure Check',
        description: 'De lading is geladen en moet gecontroleerd worden voor vertrek. Zoek naar potentiële problemen.',
        backgroundImage: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg',
        objectives: [
          'Controleer de lading sjorring',
          'Verificeer de stabiliteit',
          'Identificeer veiligheidsproblemen'
        ]
      }
    ],
    puzzles: [
      {
        id: 'cargo_defects',
        type: 'inspection',
        title: 'Veiligheids Inspectie',
        description: 'Klik op de gebieden waar je veiligheidsproblemen ziet',
        solution: {
          defects: [
            { x: 25, y: 40, description: 'Losse sjorring' },
            { x: 70, y: 60, description: 'Beschadigde container' }
          ]
        },
        points: 15,
        requiredForProgress: true
      }
    ]
  },
  {
    id: 'port_communication',
    title: 'Haven Communicatie Protocol',
    description: 'Leer de juiste communicatie procedures voor haven operaties en VTS contact.',
    difficulty: 'beginner' as const,
    category: 'communication' as const,
    estimatedTime: 25,
    scenarios: [
      {
        id: 'port_entry',
        title: 'Haven Ingang - VTS Contact',
        description: 'Je nadert de haven van Rotterdam. Tijd om contact te maken met VTS en de juiste procedures te volgen.',
        backgroundImage: 'https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg',
        objectives: [
          'Maak contact met VTS',
          'Rapporteer je positie en intentie',
          'Volg de verkeersaanwijzingen'
        ]
      }
    ],
    puzzles: [
      {
        id: 'radio_protocol',
        type: 'sequence',
        title: 'VTS Radio Protocol',
        description: 'Plaats de radio communicatie in de juiste volgorde',
        solution: {
          steps: [
            'Rotterdam VTS, Rotterdam VTS',
            'This is MV Ocean Star',
            'Position 2 miles south of Hoek van Holland',
            'Requesting permission to enter traffic separation scheme',
            'Over'
          ]
        },
        points: 20,
        requiredForProgress: true
      }
    ]
  },
  {
    id: 'safety_drill',
    title: 'Veiligheids Oefening',
    description: 'Een complete brand- en evacuatie oefening aan boord van een koopvaardijschip.',
    difficulty: 'intermediate' as const,
    category: 'safety' as const,
    estimatedTime: 40,
    scenarios: [
      {
        id: 'fire_alarm',
        title: 'Brand Alarm - Algemeen Alarm',
        description: 'Het algemeen alarm gaat af. Er is brand gemeld in de accommodatie. Alle handen aan dek!',
        objectives: [
          'Reageer op het brandalarm',
          'Volg de evacuatie procedure',
          'Gebruik de juiste brandblus apparatuur'
        ]
      }
    ],
    puzzles: [
      {
        id: 'muster_stations',
        type: 'matching',
        title: 'Verzamelplaatsen',
        description: 'Koppel elke persoon aan de juiste verzamelplaats',
        solution: {
          pairs: [
            { left: 'Dekbemanning', right: 'Verzamelplaats A - Achterdek' },
            { left: 'Machinekamer personeel', right: 'Verzamelplaats B - Middendek' },
            { left: 'Brug bemanning', right: 'Verzamelplaats C - Voordek' }
          ]
        },
        points: 15,
        requiredForProgress: true
      }
    ]
  },
  {
    id: 'maintenance_routine',
    title: 'Dagelijks Onderhoud Routine',
    description: 'Leer de standaard onderhoudsprocedures en veiligheidscontroles voor dagelijks gebruik.',
    difficulty: 'beginner' as const,
    category: 'maintenance' as const,
    estimatedTime: 35,
    scenarios: [
      {
        id: 'daily_checks',
        title: 'Dagelijkse Controles',
        description: 'Begin van de dienst. Tijd voor de dagelijkse veiligheids- en onderhoudscontroles.',
        objectives: [
          'Voer de dagelijkse controles uit',
          'Documenteer bevindingen',
          'Rapporteer afwijkingen'
        ]
      }
    ],
    puzzles: [
      {
        id: 'maintenance_checklist',
        type: 'sequence',
        title: 'Onderhoud Checklist',
        description: 'Volg de juiste volgorde voor dagelijkse controles',
        solution: {
          steps: [
            'Visuele inspectie uitrusting',
            'Olie niveaus controleren',
            'Veiligheids systemen testen',
            'Logboek bijwerken',
            'Afwijkingen rapporteren'
          ]
        },
        points: 10,
        requiredForProgress: false
      }
    ]
  }
]

export default function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Template Bibliotheek</h2>
        <p className="text-gray-600">Kies een voorgebouwd scenario om snel te starten</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MARITIME_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
            <div className={`h-2 bg-${getDifficultyColor(template.difficulty)}-500`}></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{template.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full bg-${getDifficultyColor(template.difficulty)}-100 text-${getDifficultyColor(template.difficulty)}-800`}>
                  {template.difficulty === 'beginner' ? 'Beginner' :
                   template.difficulty === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{template.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>⏱️ {template.estimatedTime} min</span>
                <span>🧩 {template.puzzles.length} puzzels</span>
                <span>📍 {template.scenarios.length} scenes</span>
              </div>
              
              <button
                onClick={() => onSelectTemplate(template)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gebruik Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Template Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="text-center">
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Aangepaste Template Nodig?</h3>
          <p className="text-gray-600 mb-4">
            Heb je een specifiek maritiem scenario in gedachten? Start met een lege template en bouw je eigen unieke escaperoom.
          </p>
          <button
            onClick={() => onSelectTemplate({})}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start met Lege Template
          </button>
        </div>
      </div>
    </div>
  )
}