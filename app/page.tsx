'use client'

import { useEffect, useState } from 'react'

import { AccountDetailPanel } from '@/components/account-detail-panel'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { AccountBriefsView } from '@/components/views/account-briefs'
import { BattleCardsView } from '@/components/views/battle-cards'
import { DiscoveryBankView } from '@/components/views/discovery-bank'
import { IcpScorecardView } from '@/components/views/icp-scorecard'
import { PrioritizationView } from '@/components/views/prioritization'
import { useTargetAccounts } from '@/hooks/use-target-accounts'
import { defaultWeights, type Account, type CriteriaWeight } from '@/lib/data'
import type { Section } from '@/lib/nav'
import { loadWeights, saveWeights } from '@/lib/weights-storage'

export default function Dashboard() {
  const {
    hydrated,
    targetNames,
    accounts,
    isRefreshing,
    replacingStakeholderKey,
    lastRefreshedAt,
    refreshSource,
    statusMessage,
    error: refreshError,
    updateTargetName,
    swapTargetNames,
    importTargets,
    refreshAccounts,
    replaceStakeholderTarget,
    refreshAccountPov,
    refreshingPovAccountId,
  } = useTargetAccounts()

  const [activeSection, setActiveSection] = useState<Section>('prioritization')
  const [weights, setWeights] = useState<CriteriaWeight[]>(defaultWeights)
  const [weightsLoaded, setWeightsLoaded] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    setWeights(loadWeights())
    setWeightsLoaded(true)
  }, [])

  useEffect(() => {
    if (!weightsLoaded) return
    saveWeights(weights)
  }, [weights, weightsLoaded])

  useEffect(() => {
    setSelectedAccount((prev) => {
      if (!prev) return prev
      return accounts.find((a) => a.id === prev.id) ?? prev
    })
  }, [accounts])

  const handleWeightsChange = (next: CriteriaWeight[]) => {
    setWeights(next)
  }

  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedAccount(null), 300)
  }

  if (!hydrated || !weightsLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading sales intelligence…</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'prioritization':
        return (
          <PrioritizationView
            accounts={accounts}
            weights={weights}
            onWeightsChange={handleWeightsChange}
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
            accounts={accounts}
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
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <TopBar
          activeSection={activeSection}
          targetNames={targetNames}
          isRefreshing={isRefreshing}
          lastRefreshedAt={lastRefreshedAt}
          refreshSource={refreshSource}
          statusMessage={statusMessage}
          refreshError={refreshError}
          onTargetNameChange={updateTargetName}
          onSwapTargetNames={swapTargetNames}
          onRefreshAccounts={refreshAccounts}
          onImportTargets={importTargets}
        />
        <main className="relative flex-1 overflow-auto p-6">
          {renderContent()}
          {isRefreshing && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
              <div className="rounded-lg border border-border bg-card px-6 py-4 text-center shadow-lg">
                <p className="text-sm font-medium text-foreground">Refreshing account intel…</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pulling latest signals for your 5 target accounts
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <AccountDetailPanel
        account={selectedAccount}
        weights={weights}
        isOpen={isDetailOpen}
        replacingStakeholderKey={replacingStakeholderKey}
        refreshingPovAccountId={refreshingPovAccountId}
        onClose={handleCloseDetail}
        onReplaceStakeholder={replaceStakeholderTarget}
        onRefreshPov={refreshAccountPov}
      />
    </div>
  )
}
