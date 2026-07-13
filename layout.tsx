import type { Metadata } from "next";
import "./globals.css";
import { JourneyProvider } from "@/hooks/useJourney";
import { AuthProvider } from "@/hooks/useAuth";
import QueryProvider from "@/hooks/useQueryProvider";
import { initializeContainer } from "@/lib/core/di/registry";

// Initialize Dependency Injection Container
initializeContainer();

export const metadata: Metadata = {
  title: "TurkeyHub | اکوسیستم هوشمند تحصیل در ترکیه",
  description: "جامع‌ترین پلتفرم مدیریت فرآیند تحصیل، اسکان و اشتغال دانشجویان ایرانی در ترکیه.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="dark scroll-smooth">
      <body className="antialiased bg-[#030712] text-foreground">
        <QueryProvider>
          <AuthProvider>
            <JourneyProvider>
              <div className="relative z-10">{children}</div>
            </JourneyProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
