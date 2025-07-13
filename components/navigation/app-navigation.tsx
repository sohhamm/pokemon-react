'use client'

import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'

export function AppNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/stats',
      label: 'Stats dashboard',
    },
    {
      href: '/types',
      label: 'Type matrix',
    },
    {
      href: '/evolution',
      label: 'Evolution trees',
    },
    {
      href: '/timeline',
      label: 'Timeline',
    },
  ]

  return (
    <nav className='border-b bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <Image
              src='/pokemon-logo.png'
              alt='Pokémon'
              width={120}
              height={40}
              className='h-8 w-auto'
            />
          </Link>

          {/* Navigation Items */}
          <div className='hidden md:flex items-center space-x-8'>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  pathname === item.href
                    ? 'text-gray-900 border-b-2 border-blue-600 pb-4'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
