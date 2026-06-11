import type { Metadata } from "next";
import { Inter, DM_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/components/WebVitals";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mac24.in"),
  title: {
    default: "MAC24 Wellness Center — From Meal to Mind",
    template: "%s | MAC24 Wellness Center",
  },
  description:
    "MAC24 is Bangalore's premium 90-day lifestyle and metabolic transformation system. From meal to mind — rebuild your body, energy, and identity.",
  keywords: [
    "MAC24",
    "Metabolic health Bangalore",
    "Lifestyle transformation Bangalore",
    "90-day health transformation",
    "Premium fitness program",
    "Bangalore wellness center",
    "Personal wellness coach",
    "Visceral fat loss",
    "Sleep reconstruction",
    "Habit building",
  ],
  authors: [{ name: "MAC24 Team" }],
  creator: "MAC24",
  alternates: {
    canonical: "https://mac24.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MAC24 Wellness Center — From Meal to Mind",
    description:
      "Bangalore's premium 90-day lifestyle and metabolic transformation system. Rebuild your body, energy, and identity.",
    url: "https://mac24.in",
    siteName: "MAC24 Wellness Center",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 1200,
        alt: "MAC24 Wellness Center — From Meal to Mind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAC24 Wellness Center — From Meal to Mind",
    description:
      "Bangalore's premium 90-day lifestyle and metabolic transformation system. Rebuild your body, energy, and identity.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mac24.in/#organization",
        "name": "MAC24 Wellness Center",
        "url": "https://mac24.in",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://mac24.in/#logo",
          "url": "https://mac24.in/logo.png",
          "caption": "MAC24 Logo"
        },
        "image": {
          "@id": "https://mac24.in/#logo"
        },
        "description": "MAC24 is Bangalore's premium 90-day lifestyle transformation system. Rebuild your metabolic index, energy, and mental focus under expert guidance.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bangalore",
          "addressRegion": "Karnataka",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://mac24.in/#website",
        "url": "https://mac24.in",
        "name": "MAC24 Wellness Center",
        "description": "From Meal to Mind — Bangalore's Premium 90-Day Lifestyle & Metabolic Rebuild System",
        "publisher": {
          "@id": "https://mac24.in/#organization"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
