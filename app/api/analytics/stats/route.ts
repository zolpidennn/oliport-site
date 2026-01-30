import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const months = parseInt(searchParams.get("months") || "12")

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    // Get page views grouped by month
    const { data: pageViews, error: pvError } = await supabase
      .from("page_views")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (pvError) throw pvError

    // Get click events grouped by event_name and month
    const { data: clickEvents, error: ceError } = await supabase
      .from("click_events")
      .select("event_name, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (ceError) throw ceError

    // Get cookie consents
    const { data: consents, error: consentError } = await supabase
      .from("cookie_consents")
      .select("consent_given, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (consentError) throw consentError

    // Process data by month
    const monthlyData: Record<string, {
      month: string
      page_views: number
      whatsapp_clicks: number
      instagram_clicks: number
      address_clicks: number
      contact_clicks: number
      form_submits: number
    }> = {}

    // Initialize months
    for (let i = 0; i < months; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
      monthlyData[monthKey] = {
        month: monthName,
        page_views: 0,
        whatsapp_clicks: 0,
        instagram_clicks: 0,
        address_clicks: 0,
        contact_clicks: 0,
        form_submits: 0,
      }
    }

    // Count page views per month
    pageViews?.forEach((pv) => {
      const date = new Date(pv.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].page_views++
      }
    })

    // Count click events per month and type
    clickEvents?.forEach((ce) => {
      const date = new Date(ce.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (monthlyData[monthKey]) {
        switch (ce.event_name) {
          case "whatsapp_click":
            monthlyData[monthKey].whatsapp_clicks++
            break
          case "instagram_click":
            monthlyData[monthKey].instagram_clicks++
            break
          case "address_click":
            monthlyData[monthKey].address_clicks++
            break
          case "contact_click":
            monthlyData[monthKey].contact_clicks++
            break
          case "form_submit":
            monthlyData[monthKey].form_submits++
            break
        }
      }
    })

    // Sort by date and convert to array
    const sortedData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => data)

    // Calculate totals
    const totals = {
      page_views: pageViews?.length || 0,
      whatsapp_clicks: clickEvents?.filter((e) => e.event_name === "whatsapp_click").length || 0,
      instagram_clicks: clickEvents?.filter((e) => e.event_name === "instagram_click").length || 0,
      address_clicks: clickEvents?.filter((e) => e.event_name === "address_click").length || 0,
      contact_clicks: clickEvents?.filter((e) => e.event_name === "contact_click").length || 0,
      form_submits: clickEvents?.filter((e) => e.event_name === "form_submit").length || 0,
      consents_accepted: consents?.filter((c) => c.consent_given).length || 0,
      consents_rejected: consents?.filter((c) => !c.consent_given).length || 0,
    }

    return NextResponse.json({
      monthly: sortedData,
      totals,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
