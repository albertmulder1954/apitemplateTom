import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AVG Compliance Assistent - AI-powered GDPR hulp',
  description: 'Professionele AI-assistent voor het toepassen van de Algemene Verordening Gegevensbescherming (AVG/GDPR) in de praktijk. Upload documenten, krijg compliance-advies en praktische hulp.',
  keywords: ['AVG', 'GDPR', 'privacy', 'compliance', 'gegevensbescherming', 'AI', 'juridisch advies', 'Nederland'],
  robots: 'index, follow',
  openGraph: {
    title: 'AVG Compliance Assistent',
    description: 'AI-powered hulp bij AVG/GDPR compliance voor Nederlandse organisaties',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-50 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}