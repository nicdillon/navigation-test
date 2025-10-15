'use client'

import Link from 'next/link'

interface HomeLinkProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function HomeLink({ children, style }: HomeLinkProps) {

  return (
    <Link href="/"  style={style}>
      {children}
    </Link>
  )
}
