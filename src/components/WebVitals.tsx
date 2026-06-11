"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Under local development, print to console.
    // In production, these metrics can be pushed to GCP Cloud Logging or a custom telemetry endpoint.
    if (process.env.NODE_ENV === "development") {
      console.log("[Web Vitals]", metric.name, metric.value);
    } else {
      // Example of production reporting (e.g. sending to Google Analytics / Custom Ingest)
      const body = JSON.stringify({
        id: metric.id,
        name: metric.name,
        value: metric.value.toString(),
        label: metric.rating, // 'good', 'needs-improvement', or 'poor'
      });

      // Use sendBeacon if available, fallback to fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/vitals", body);
      } else {
        fetch("/api/vitals", {
          body,
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
          },
        }).catch(() => {});
      }
    }
  });

  return null;
}
