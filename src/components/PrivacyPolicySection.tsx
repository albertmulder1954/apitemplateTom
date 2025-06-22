'use client'

import { useState } from 'react'

export default function PrivacyPolicySection() {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Clickable Header */}
      <div 
        className="p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              📄
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Privacy Beleid</h3>
              <p className="text-gray-600 text-sm">
                Hulp bij het opstellen, controleren en updaten van je privacy beleid volgens AVG-eisen.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-xs text-blue-600 font-medium">
              ✓ Template generatie ✓ Compliance check ✓ Sector-specifiek advies
            </div>
            <svg 
              className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`transition-all duration-500 ease-in-out ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-6 pb-6 bg-blue-50 border-t border-blue-100">
          
          {/* Quick Actions */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
              <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">⚡</span>
              </span>
              Snelle Acties
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left border border-blue-200 hover:border-blue-400">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-medium text-gray-800">Controleer Bestaand Beleid</p>
                    <p className="text-xs text-gray-600">Upload je huidige privacy beleid voor compliance-check</p>
                  </div>
                </div>
              </button>
              
              <button className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left border border-blue-200 hover:border-blue-400">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-medium text-gray-800">Nieuw Beleid Opstellen</p>
                    <p className="text-xs text-gray-600">Genereer een compleet privacy beleid voor jouw sector</p>
                  </div>
                </div>
              </button>
              
              <button className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left border border-blue-200 hover:border-blue-400">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium text-gray-800">Sector-specifiek Advies</p>
                    <p className="text-xs text-gray-600">Krijg advies aangepast aan jouw branche</p>
                  </div>
                </div>
              </button>
              
              <button className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left border border-blue-200 hover:border-blue-400">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <p className="font-medium text-gray-800">Update Bestaand Beleid</p>
                    <p className="text-xs text-gray-600">Breng je beleid up-to-date met nieuwe regelgeving</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Essential Elements */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
              <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">📋</span>
              </span>
              Verplichte Elementen in Privacy Beleid
            </h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Identiteit en contactgegevens verwerkingsverantwoordelijke</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Doeleinden en rechtsgrondslag van de verwerking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Categorieën van persoonsgegevens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Ontvangers van persoonsgegevens</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Bewaartermijnen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Rechten van betrokkenen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Recht van klacht bij toezichthouder</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Geautomatiseerde besluitvorming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Examples */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
              <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">🏢</span>
              </span>
              Sector-specifieke Voorbeelden
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🏥</span>
                  <span className="font-medium text-gray-800 text-sm">Zorgverlening</span>
                </div>
                <p className="text-xs text-gray-600">Bijzondere persoonsgegevens, medisch beroepsgeheim, bewaarplicht</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🛒</span>
                  <span className="font-medium text-gray-800 text-sm">E-commerce</span>
                </div>
                <p className="text-xs text-gray-600">Klantgegevens, betalingen, marketing, cookies, tracking</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🎓</span>
                  <span className="font-medium text-gray-800 text-sm">Onderwijs</span>
                </div>
                <p className="text-xs text-gray-600">Leerlinggegevens, ouders, prestaties, bijzondere zorg</p>
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-red-700 mb-3 flex items-center">
              <span className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">⚠️</span>
              </span>
              Veelgemaakte Fouten
            </h4>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm text-red-800">Vage of onduidelijke doeleinden van gegevensverwerking</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm text-red-800">Ontbrekende of onjuiste rechtsgrondslag</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm text-red-800">Geen duidelijke bewaartermijnen genoemd</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm text-red-800">Onduidelijke uitleg van betrokkenenrechten</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Templates */}
          <div>
            <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
              <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">📄</span>
              </span>
              Template Voorbeelden
            </h4>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-gray-800 mb-1">Basis Privacy Statement</p>
                  <p className="text-xs text-gray-600 italic">
                    "Wij, [Bedrijfsnaam], verwerken uw persoonsgegevens voor [doel] op basis van [rechtsgrondslag]. 
                    Uw gegevens worden bewaard gedurende [termijn] en gedeeld met [ontvangers]..."
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded border-l-4 border-green-500">
                  <p className="text-sm font-medium text-gray-800 mb-1">Betrokkenenrechten Sectie</p>
                  <p className="text-xs text-gray-600 italic">
                    "U heeft het recht om inzage, rectificatie, verwijdering, beperking, overdraagbaarheid en bezwaar 
                    te maken tegen de verwerking van uw persoonsgegevens..."
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}