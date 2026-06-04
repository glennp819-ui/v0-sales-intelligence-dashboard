'use client'

import { useState } from 'react'
import {
  Target,
  ClipboardList,
  Swords,
  HelpCircle,
  FileText,
} from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { PrioritizationView } from '@/components/views/prioritization'
import { IcpScorecardView } from '@/components/views/icp-scorecard'
import { BattleCardsView } from '@/components/views/battle-cards'
import { DiscoveryBankView } from '@/components/views/discovery-bank'
import { AccountBriefsView } from '@/components/views/account-briefs'
import { AccountDetailPanel } from '@/components/account-detail-panel'
import { mockAccounts, defaultWeights, type Account, type CriteriaWeight } from '@/lib/data'

export type Section = 'prioritization' | 'icp-scorecard' | 'battle-cards' | 'discovery-bank' | 'account-briefs'

export const navItems = [
  { id: 'prioritization' as Section, label: 'Prioritization', icon: Target },
  { id: 'icp-scorecard' as Section, label: 'ICP Scorecard', icon: ClipboardList },
  { id: 'battle-cards' as Section, label: 'Battle Cards', icon: Swords },
  { id: 'discovery-bank' as Section, label: 'Discovery Bank', icon: HelpCircle },
  { id: 'account-briefs' as Section, label: 'Account Briefs', icon: FileText },
]

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('prioritization')
  const [weights, setWeights] = useState<CriteriaWeight[]>(defaultWeights)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedAccount(null), 300)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'prioritization':
        return (
          <PrioritizationView
            accounts={mockAccounts}
            weights={weights}
            onWeightsChange={setWeights}
            onAccountSelect={handleAccountSelect}
          />
        )
      case 'icp-scorecard':
        return <IcpScorecardView />
      case 'battle-cards':
        return <BattleCardsView />
      case 'discovery-bank':
        return <DiscoveryBankView />
      case 'account-briefs':
        return (
          <AccountBriefsView
            accounts={mockAccounts}
            weights={weights}
            onAccountSelect={handleAccountSelect}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar activeSection={activeSection} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      <AccountDetailPanel
        account={selectedAccount}
        weights={weights}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
