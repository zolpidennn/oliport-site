import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, event_data } = body

    const supabase = await createClient()

    // Get visitor info from headers
    const userAgent = request.headers.get("user-agent") || undefined
    const referer = request.headers.get("referer") || undefined
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               request.headers.get("x-real-ip") || 
               undefined

    if (event_type === "page_view") {
      const { error } = await supabase.from("page_views").insert({
        page_path: event_data.page_path || "/",
        user_agent: userAgent,
        referrer: referer,
        ip_address: ip,
      })

      if (error) {
        console.error("Error tracking page view:", error)
        return NextResponse.json({ error: "Failed to track page view" }, { status: 500 })
      }
    } else if (event_type === "click") {
      const { error } = await supabase.from("click_events").insert({
        event_name: event_data.event_name,
        element_id: event_data.element_id,
        element_class: event_data.element_class,
        page_path: event_data.page_path || "/",
        user_agent: userAgent,
        ip_address: ip,
      })

      if (error) {
        console.error("Error tracking click:", error)
        return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
      }
    } else if (event_type === "cookie_consent") {
      const { error } = await supabase.from("cookie_consents").insert({
        consent_given: event_data.consent_given,
        ip_address: ip,
        user_agent: userAgent,
      })

      if (error) {
        console.error("Error tracking consent:", error)
        return NextResponse.json({ error: "Failed to track consent" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
