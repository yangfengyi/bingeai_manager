import { Button } from '@/components/ui/button';
import { Airplay, CircleUser } from 'lucide-react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Binge ai manager',
  description: 'Binge ai manager for user based on their preferences',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='flex min-h-screen w-full flex-col'>
          <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10'>
            <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
              <Link
                href='#'
                className='flex items-center gap-2 text-lg font-semibold md:text-base'
              >
                <Airplay className='h-6 w-6' />
                <span className='sr-only'>Acme Inc</span>
              </Link>
              <Link
                href='/'
                className='text-foreground transition-colors hover:text-foreground'
              >
                Dashboard
              </Link>
              <Link
                href='/users'
                className='text-foreground transition-colors hover:text-foreground'
              >
                Users
              </Link>
              <Link
                href='/messages'
                className='text-foreground transition-colors hover:text-foreground'
              >
                Messages
              </Link>
            </nav>
            <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 bg-background'>
              <div className='lg:flex-1'></div>
              <Button variant='secondary' size='icon' className='rounded-full'>
                <CircleUser className='h-5 w-5' />
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </div>
          </header>
          <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
