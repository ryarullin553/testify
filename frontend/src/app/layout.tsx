import { ErrorMessage } from '@/components/error-message/error-message'
import { Header } from '@/components/header/header'
import { Providers } from '@/components/provider/provider'
import '@/global.css'

export const metadata = {
  title: 'Testify',
  description: 'Testify - платформа для создания и прохождения тестов',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <ErrorMessage />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
