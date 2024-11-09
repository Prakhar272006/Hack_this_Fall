import { ReactNode } from 'react';
import { Manrope } from 'next/font/google'
import { Space_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import { Footer } from '@/components/footer';
import ClientSessionProvider from '@/components/clientsession';
import BgNoiseWrapper from '@/components/texture';
import { Toaster } from 'react-hot-toast';

const fontHeading = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: '400',
})


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <ClientSessionProvider>
          <div className="bg-neutral-200">
            {children}
              <Toaster
                position="bottom-right"
                reverseOrder={false}
              />
              {/* <Footer /> */}
          </div>
        </ClientSessionProvider>
      </body>
    </html>
  )
}