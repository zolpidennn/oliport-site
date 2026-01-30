"use client"

import { useEffect, useState } from "react"
import { Eye, MessageCircle, Instagram, MapPin, Phone, FileText, CheckCircle, XCircle } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AnalyticsChart } from "@/components/dashboard/analytics-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MonthlyData {
  month: string
  page_views: number
  whatsapp_clicks: number
  instagram_clicks: number
  address_clicks: number
  contact_clicks: number
  form_submits: number
}

interface Totals {
  page_views: number
  whatsapp_clicks: number
  instagram_clicks: number
  address_clicks: number
  contact_clicks: number
  form_submits: number
  consents_accepted: number
  consents_rejected: number
}

interface StatsData {
  monthly: MonthlyData[]
  totals: Totals
}

export default function DashboardPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [months, setMonths] = useState("12")

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics/stats?months=${months}`)
        if (response.ok) {
          const stats = await response.json()
          setData(stats)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [months])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const totals = data?.totals || {
    page_views: 0,
    whatsapp_clicks: 0,
    instagram_clicks: 0,
    address_clicks: 0,
    contact_clicks: 0,
    form_submits: 0,
    consents_accepted: 0,
    consents_rejected: 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 font-bold text-black">O</div>
            <h1 className="text-xl font-bold">Oliport Analytics</h1>
          </div>
          <Select value={months} onValueChange={setMonths}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Dashboard de Métricas</h2>
          <p className="text-muted-foreground">Visualize as estatísticas do seu site em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Visualizações" value={totals.page_views} icon={Eye} description="Total de visitas ao site" />
          <StatsCard
            title="Cliques WhatsApp"
            value={totals.whatsapp_clicks}
            icon={MessageCircle}
            description="Contatos via WhatsApp"
          />
          <StatsCard
            title="Cliques Instagram"
            value={totals.instagram_clicks}
            icon={Instagram}
            description="Visitas ao perfil"
          />
          <StatsCard
            title="Cliques Endereço"
            value={totals.address_clicks}
            icon={MapPin}
            description="Acessos ao mapa"
          />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Cliques Contato"
            value={totals.contact_clicks}
            icon={Phone}
            description="Interações de contato"
          />
          <StatsCard
            title="Formulários Enviados"
            value={totals.form_submits}
            icon={FileText}
            description="Orçamentos solicitados"
          />
          <StatsCard
            title="Cookies Aceitos"
            value={totals.consents_accepted}
            icon={CheckCircle}
            description="Consentimentos aceitos"
          />
          <StatsCard
            title="Cookies Recusados"
            value={totals.consents_rejected}
            icon={XCircle}
            description="Consentimentos recusados"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4">
          <AnalyticsChart data={data?.monthly || []} />

          {/* Consent Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Consentimentos</CardTitle>
              <CardDescription>Taxa de aceitação de cookies pelos visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totals.consents_accepted}</div>
                    <div className="text-sm text-muted-foreground">Aceitos</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totals.consents_rejected}</div>
                    <div className="text-sm text-muted-foreground">Recusados</div>
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="text-sm text-muted-foreground">Taxa de aceitação</div>
                  <div className="text-3xl font-bold text-green-500">
                    {totals.consents_accepted + totals.consents_rejected > 0
                      ? Math.round(
                          (totals.consents_accepted / (totals.consents_accepted + totals.consents_rejected)) * 100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
