import type { Metadata } from 'next'
import "./globals.css"

export const metadata: Metadata = {
  title: 'Dev Flow Dashboard',
  description: 'Visual developer dashboard for tracking and improving your development workflow.',
};

export default function RootLayout({children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}