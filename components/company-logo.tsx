'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

function domainFromWebsite(website: string): string {
  return website.replace(/^https?:\/\//, '').split('/')[0]
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

interface CompanyLogoProps {
  name: string
  website: string
  className?: string
}

export function CompanyLogo({ name, website, className }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false)
  const domain = domainFromWebsite(website)

  if (failed || !domain) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded bg-secondary font-mono text-xs font-medium text-muted-foreground',
          className
        )}
        aria-hidden
      >
        {initialsFromName(name)}
      </div>
    )
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt=""
      className={cn(
        'shrink-0 rounded bg-secondary object-contain p-1 grayscale',
        className
      )}
      onError={() => setFailed(true)}
    />
  )
}
