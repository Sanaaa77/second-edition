"use client";
import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ReadinessCenter } from "@/features/readiness/components/ReadinessCenter";
import { ScenarioSimulator } from "@/features/readiness/components/ScenarioSimulator";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function ReadinessDashboardPage() {
  return (
    <PortalLayout>
      <div className="space-y-16 py-10">
        <div className="text-right space-y-4">
          <h1 className="text-5xl font-black text-foreground tracking-tighter">آمادگی هوشمند</h1>
          <p className="text-muted text-xl max-w-2xl ml-auto">تحلیل عمیق رزومه شما در ۱۳ بعد مختلف با استفاده از موتور تصمیم‌گیری ترکیه هاب.</p>
        </div>

        <ErrorBoundary>
           <ReadinessCenter />
        </ErrorBoundary>

        <div className="pt-20">
           <ErrorBoundary>
              <ScenarioSimulator />
           </ErrorBoundary>
        </div>
      </div>
    </PortalLayout>
  );
}
