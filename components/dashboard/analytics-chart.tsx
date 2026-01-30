"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MonthlyData {
  month: string
  page_views: number
  whatsapp_clicks: number
  instagram_clicks: number
  address_clicks: number
  contact_clicks: number
  form_submits: number
}

interface AnalyticsChartProps {
  data: MonthlyData[]
}

const chartConfig = {
  page_views: {
    label: "Visualizações",
    color: "#f59e0b",
  },
  whatsapp_clicks: {
    label: "WhatsApp",
    color: "#22c55e",
  },
  instagram_clicks: {
    label: "Instagram",
    color: "#ec4899",
  },
  address_clicks: {
    label: "Endereço",
    color: "#3b82f6",
  },
  contact_clicks: {
    label: "Contato",
    color: "#8b5cf6",
  },
  form_submits: {
    label: "Formulários",
    color: "#06b6d4",
  },
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Métricas por Mês</CardTitle>
        <CardDescription>Acompanhe o desempenho do site ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="interactions">Interações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="page_views"
                    stroke={chartConfig.page_views.color}
                    strokeWidth={2}
                    dot={{ fill: chartConfig.page_views.color }}
                    name="Visualizações"
                  />
                  <Line
                    type="monotone"
                    dataKey="whatsapp_clicks"
                    stroke={chartConfig.whatsapp_clicks.color}
                    strokeWidth={2}
                    dot={{ fill: chartConfig.whatsapp_clicks.color }}
                    name="WhatsApp"
                  />
                  <Line
                    type="monotone"
                    dataKey="instagram_clicks"
                    stroke={chartConfig.instagram_clicks.color}
                    strokeWidth={2}
                    dot={{ fill: chartConfig.instagram_clicks.color }}
                    name="Instagram"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="whatsapp_clicks" fill={chartConfig.whatsapp_clicks.color} name="WhatsApp" radius={4} />
                  <Bar
                    dataKey="instagram_clicks"
                    fill={chartConfig.instagram_clicks.color}
                    name="Instagram"
                    radius={4}
                  />
                  <Bar dataKey="address_clicks" fill={chartConfig.address_clicks.color} name="Endereço" radius={4} />
                  <Bar dataKey="contact_clicks" fill={chartConfig.contact_clicks.color} name="Contato" radius={4} />
                  <Bar dataKey="form_submits" fill={chartConfig.form_submits.color} name="Formulários" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
