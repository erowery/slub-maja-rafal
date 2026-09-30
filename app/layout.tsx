import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maja & Rafał — Ślub',
  description: 'Galeria zdjęć, menu, bingo i quiz weselny Mai i Rafała',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${playfair.variable} ${lato.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
