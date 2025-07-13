import EscaperoomBuilder from '@/components/EscaperoomBuilder'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mb-6 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Maritime Escape Room Builder
          </h1>
          
          <p className="text-xl text-cyan-200 font-medium mb-6 max-w-4xl mx-auto">
            Bouw interactieve digitale escaperooms voor maritieme training en educatie in de koopvaardijvaart
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-xs">
              <div className="text-3xl mb-3">🚢</div>
              <h3 className="font-semibold text-white mb-2">Maritieme Scenarios</h3>
              <p className="text-sm text-cyan-200">Realistische scheepvaart situaties en procedures</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-xs">
              <div className="text-3xl mb-3">🧩</div>
              <h3 className="font-semibold text-white mb-2">Interactieve Puzzels</h3>
              <p className="text-sm text-cyan-200">Drag & drop editor voor complexe uitdagingen</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-xs">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-sm text-cyan-200">Volg voortgang en prestaties van deelnemers</p>
            </div>
          </div>
        </div>

        {/* Main Builder Interface */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <EscaperoomBuilder />
          </div>
        </div>

        {/* Features Overview */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Krachtige Features voor Maritieme Training
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  ⚓
                </div>
                <h3 className="text-lg font-semibold text-white">Scheepvaart Procedures</h3>
              </div>
              <p className="text-cyan-200 text-sm">
                Bouw scenarios rond navigatie, veiligheid, lading en noodprocedures
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  🎯
                </div>
                <h3 className="text-lg font-semibold text-white">Leerdoelen</h3>
              </div>
              <p className="text-cyan-200 text-sm">
                Koppel specifieke maritieme competenties aan elke uitdaging
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  📱
                </div>
                <h3 className="text-lg font-semibold text-white">Multi-Platform</h3>
              </div>
              <p className="text-cyan-200 text-sm">
                Werkt op desktop, tablet en smartphone voor flexibele training
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  🏆
                </div>
                <h3 className="text-lg font-semibold text-white">Gamification</h3>
              </div>
              <p className="text-cyan-200 text-sm">
                Punten, badges en leaderboards voor motiverende training
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  🔒
                </div>
                <h3 className="text-lg font-semibold text-white">Veilige Omgeving</h3>
              </div>
              <p className="text-cyan-200 text-sm">
                Oefen kritieke procedures zonder risico voor schip en bemanning
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  📈
                </div>
                <h3 className="text-lg font-semibold text-white">Analytics</h3>
              </div>
              <p className="text-cyan-200 text-sm">
                Gedetailleerde rapportage over leervoortgang en prestaties
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 text-cyan-300">
            <span>⚓</span>
            <span>Professionele maritieme training voor de moderne koopvaardij</span>
            <span>⚓</span>
          </div>
          <p className="text-blue-300 text-sm mt-2">
            Maritime Escape Room Builder • Powered by AI • Voor de Nederlandse koopvaardijvaart
          </p>
        </div>
      </div>
    </div>
  )
}