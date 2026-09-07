import "./globals.css";
import { Poppins, JetBrains_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

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
  openGraph: {
    title: "JobLink — Modern Professional Career & Job Board Platform",
    description:
      "Connect top talent with world-class opportunities and build your digital future.",
    url: "/",
    siteName: "JobLink",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobLink — Modern Professional Career & Job Board Platform",
    description:
      "Connect top talent with world-class opportunities and build your digital future.",
    creator: "@joblink",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${poppins.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning>
      <body className='min-h-screen flex flex-col bg-[var(--color-ink)] text-slate-100 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400'>
        <ThemeProvider>
          <ToastProvider>
            <NavBar />
            <main className='grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
              {children}
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
