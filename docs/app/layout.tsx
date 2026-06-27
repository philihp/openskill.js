import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'openskill.js — documentation',
  description:
    'Weng-Lin Bayesian online skill-ranking for JavaScript, with idiomatic examples in every language port.',
  icons: { icon: '/favicon.svg' },
}

const guides = [
  { title: 'Overview', href: '/' },
  { title: 'Getting Started', href: '/getting-started' },
  { title: 'API Reference', href: '/api' },
  { title: 'Models', href: '/models' },
  { title: 'Predictions', href: '/predictions' },
  { title: 'Ranking & Ordinal', href: '/ranking' },
]

const examples = [
  { title: 'JavaScript / TypeScript', href: '/examples/javascript' },
  { title: 'Python', href: '/examples/python' },
  { title: 'Java', href: '/examples/java' },
  { title: 'Kotlin', href: '/examples/kotlin' },
  { title: 'Elixir', href: '/examples/elixir' },
  { title: 'Lua', href: '/examples/lua' },
  { title: 'Google Apps Script', href: '/examples/google-apps-script' },
]

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <aside className="sidebar">
            <Link href="/" className="brand">
              openskill.js
            </Link>

            <h3>Guides</h3>
            <ul>
              {guides.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>

            <h3>Examples by language</h3>
            <ul>
              {examples.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>

            <a
              className="repo"
              href="https://github.com/philihp/openskill.js"
              target="_blank"
              rel="noreferrer"
            >
              GitHub →
            </a>
          </aside>

          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  )
}
