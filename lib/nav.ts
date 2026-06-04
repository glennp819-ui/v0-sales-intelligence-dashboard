import type { LucideIcon } from 'lucide-react'
import {
  Target,
  ClipboardList,
  Swords,
  HelpCircle,
  FileText,
} from 'lucide-react'

export type Section =
  | 'prioritization'
  | 'icp-scorecard'
  | 'battle-cards'
  | 'discovery-bank'
  | 'account-briefs'

export const navItems: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: 'prioritization', label: 'Prioritization', icon: Target },
  { id: 'icp-scorecard', label: 'ICP Scorecard', icon: ClipboardList },
  { id: 'battle-cards', label: 'Battle Cards', icon: Swords },
  { id: 'discovery-bank', label: 'Discovery Bank', icon: HelpCircle },
  { id: 'account-briefs', label: 'Account Briefs', icon: FileText },
]
