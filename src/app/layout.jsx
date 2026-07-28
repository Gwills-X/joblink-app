import "./globals.css";
import { Poppins } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// =========================================================================
// PRODUCTION-READY META REGISTRATION (Optimized for Vercel & Search Engines)
// =========================================================================
export const metadata = {
  title: {
    default: "JobLink — Modern Professional Career & Job Board Platform",
    template: "%s | JobLink",
  },
  description:
    "Connect top talent with world-class opportunities. Build your career profile, track job applications, and bridge the gap to your future.",
  keywords: [
    "Next.js",
    "MySQL",
    "Job Board",
    "Career Portal",
    "Web Development",
    "JobLink Platform",
  ],
  authors: [{ name: "GW-TECK SOLUTIONS" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://joblink.vercel.app",
  ),

  // OpenGraph (Optimizes previews for Facebook, LinkedIn, Discord)
  openGraph: {
    title: "JobLink — Modern Professional Career & Job Board Platform",
    description:
      "Connect top talent with world-class opportunities and build your digital future.",
    url: "/",
    siteName: "JobLink",
    locale: "en_US",
    type: "website",
  },

  // Twitter Cards (Optimizes rich media preview snippets on X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "JobLink — Modern Professional Career & Job Board Platform",
    description:
      "Connect top talent with world-class opportunities and build your digital future.",
    creator: "@joblink",
  },

  // Viewport/Robot indexing gates
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='h-full' suppressHydrationWarning>
      <body
        className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 ${poppins.variable} font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400`}>
        {/* Sticky Header Container */}
        <div className='sticky top-0 z-50'>
          <NavBar />
        </div>

        {/* Main Content Area */}
        <main className='flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {children}
        </main>

        {/* Footer Container */}
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
