import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Maritime Escape Room Builder - Digitale Training voor Koopvaardijvaart',
  description: 'Bouw interactieve digitale escaperooms voor maritieme training en educatie. Professionele tool voor scheepvaart procedures, veiligheid en competentie-ontwikkeling.',
  keywords: ['maritiem', 'koopvaardij', 'training', 'escaperoom', 'scheepvaart', 'educatie', 'simulatie', 'veiligheid'],
  robots: 'index, follow',
  openGraph: {
    title: 'Maritime Escape Room Builder',
    description: 'Digitale escaperooms voor maritieme training en educatie',
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
      <body className="bg-blue-900 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}