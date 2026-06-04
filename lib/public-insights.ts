export interface PublicInsights {
  headlines: string[]
  wikiSummary: string | null
  fetchedAt: string
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
}

async function fetchGoogleNewsHeadlines(companyName: string): Promise<string[]> {
  const query = `${companyName} (engineering OR technology OR digital OR AI OR software)`
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SalesIntelBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) return []

    const xml = await response.text()
    const titles: string[] = []

    for (const match of xml.matchAll(/<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/gi)) {
      const title = decodeXml(match[1].trim())
      if (title && !title.toLowerCase().includes('google news')) {
        titles.push(title)
      }
    }

    return titles.slice(0, 10)
  } catch {
    return []
  }
}

async function fetchWikipediaSummary(companyName: string): Promise<string | null> {
  const candidates = [
    companyName,
    companyName.replace(/\s+(Group|Inc|Corp|Corporation|LLC|Ltd)\.?$/i, ''),
  ]

  for (const candidate of candidates) {
    const slug = candidate.trim().replace(/ /g, '_')
    if (!slug) continue

    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
        { signal: AbortSignal.timeout(6000) }
      )

      if (!response.ok) continue

      const data = (await response.json()) as { extract?: string; description?: string }
      if (data.extract) {
        return data.extract.slice(0, 1200)
      }
    } catch {
      continue
    }
  }

  return null
}

export async function fetchPublicInsights(companyName: string): Promise<PublicInsights> {
  const [headlines, wikiSummary] = await Promise.all([
    fetchGoogleNewsHeadlines(companyName),
    fetchWikipediaSummary(companyName),
  ])

  return {
    headlines,
    wikiSummary,
    fetchedAt: new Date().toISOString(),
  }
}

export function formatPublicInsightsForPrompt(insights: PublicInsights): string {
  const sections: string[] = []

  if (insights.headlines.length > 0) {
    sections.push(
      'RECENT PUBLIC HEADLINES (Google News):',
      ...insights.headlines.map((h) => `- ${h}`)
    )
  } else {
    sections.push('RECENT PUBLIC HEADLINES: none fetched — rely on known public facts about the company.')
  }

  if (insights.wikiSummary) {
    sections.push('', 'WIKIPEDIA SUMMARY:', insights.wikiSummary)
  }

  sections.push('', `Insights fetched at: ${insights.fetchedAt}`)

  return sections.join('\n')
}
