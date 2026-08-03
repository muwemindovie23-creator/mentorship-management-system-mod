import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import { Inter, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

const SITE_URL = "https://www.mentmw.org";
const SITE_DESCRIPTION =
  "Menty pairs university students with a mentor who's already walked their road — automated matching by department and interests, weekly check-ins, and meeting logs, built for campus mentorship programmes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Menty — Peer Mentorship for University Students",
    template: "%s · Menty",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Menty",
    "mentmw",
    "peer mentorship",
    "student mentorship program",
    "university mentorship platform",
    "campus mentor matching",
    "mentor mentee pairing",
    "MUBAS mentorship",
  ],
  applicationName: "Menty",
  authors: [{ name: "Menty" }],
  category: "education",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Menty",
    title: "Menty — Peer Mentorship for University Students",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Menty" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menty — Peer Mentorship for University Students",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#272754",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
