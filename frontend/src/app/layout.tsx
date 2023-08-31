import { ErrorMessage } from '@/components/error-message/error-message'
import { Providers } from '@/components/provider/provider'
import '@/global.css'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ErrorMessage />
          {children}
        </Providers>
      </body>
    </html>
  )
}