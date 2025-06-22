import AVGChatBot from '@/components/AVGChatBot'
import PrivacyPolicySection from '@/components/PrivacyPolicySection'
import CopyButton from '@/components/CopyButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            AVG Compliance Assistent
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6 max-w-3xl mx-auto">
            Jouw AI-powered hulp bij het toepassen van de Algemene Verordening Gegevensbescherming (AVG/GDPR) in de praktijk
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 max-w-xs">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-gray-800 mb-1">Analyse & Advies</h3>
              <p className="text-sm text-gray-600">Upload documenten voor AVG-compliance controle</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 max-w-xs">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-800 mb-1">Praktische Tools</h3>
              <p className="text-sm text-gray-600">Checklists, templates en stapsgewijze hulp</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 max-w-xs">
              <div className="text-2xl mb-2">⚖️</div>
              <h3 className="font-semibold text-gray-800 mb-1">Juridische Updates</h3>
              <p className="text-sm text-gray-600">Actuele informatie en jurisprudentie</p>
            </div>
          </div>
        </div>

        {/* Quick Start Cards */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Waar kan ik je mee helpen?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Interactive Privacy Beleid */}
            <PrivacyPolicySection />

            {/* DPIA */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  🔍
                </div>
                <h3 className="text-lg font-semibold text-gray-800">DPIA Ondersteuning</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Stapsgewijze begeleiding bij Data Protection Impact Assessments en risicoanalyses.
              </p>
              <div className="text-xs text-green-600 font-medium">
                ✓ Risico identificatie ✓ Template DPIA ✓ Mitigatie strategieën
              </div>
            </div>

            {/* Data Breach */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  🚨
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Datalek Protocol</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Directe hulp bij datalekken: stappenplan, meldingsplicht en communicatie.
              </p>
              <div className="text-xs text-red-600 font-medium">
                ✓ 72-uur regel ✓ Melding AP ✓ Betrokkenen informeren
              </div>
            </div>

            {/* Contracten */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  📝
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Verwerkersovereenkomsten</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Templates en controle van verwerkersovereenkomsten en joint controller akkoorden.
              </p>
              <div className="text-xs text-purple-600 font-medium">
                ✓ Contracttemplates ✓ Clausule check ✓ Onderaannemers
              </div>
            </div>

            {/* Rechten Betrokkenen */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  👤
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Rechten Betrokkenen</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Procedures voor inzage, rectificatie, vergetelheid en andere rechten van betrokkenen.
              </p>
              <div className="text-xs text-orange-600 font-medium">
                ✓ Verzoek afhandeling ✓ Response templates ✓ Termijn bewaking
              </div>
            </div>

            {/* Awareness Training */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  🎓
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Awareness & Training</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Materiaal en hulp voor AVG-awareness training van medewerkers.
              </p>
              <div className="text-xs text-teal-600 font-medium">
                ✓ Training materiaal ✓ E-learning ✓ Awareness campagnes
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                AVG Compliance Chatbot
              </h2>
              <p className="text-gray-600">
                Stel je vraag over de AVG, upload documenten voor analyse, of vraag om praktische hulp
              </p>
            </div>
            
            <AVGChatBot />
          </div>
        </div>

        {/* Example Questions */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                💡
              </span>
              Voorbeeldvragen om mee te starten
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 italic">"Hoe stel ik een DPIA op voor mijn nieuwe CRM-systeem?"</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 italic">"Welke gegevens mag ik verwerken voor marketing doeleinden?"</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 italic">"Hoe lang mag ik personeelsgegevens bewaren?"</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 italic">"Wat moet ik doen bij een datalek?"</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 italic">"Controleer mijn verwerkersovereenkomst op AVG-compliance"</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 italic">"Hoe ga ik om met een verzoek tot inzage?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-yellow-800">Juridische Disclaimer</h3>
                <p className="text-xs text-yellow-700 mt-1">
                  Dit is een AI-assistent ter ondersteuning bij AVG-compliance. Het vervangt geen juridisch advies van een gekwalificeerde jurist. 
                  Voor complexe juridische vraagstukken raden wij aan altijd professioneel juridisch advies in te winnen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-blue-600">
            <span>🔒</span>
            <span>Veilige AVG-compliance voor iedereen</span>
            <span>🔒</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            AVG Compliance Assistent • Powered by AI • Gemaakt voor Nederlandse organisaties
          </p>
        </div>
      </div>
    </div>
  )
}