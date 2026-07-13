"use client";
import React, { useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { SuccessMoments } from "@/components/ui/PremiumComponents";
import { useJourney } from "@/hooks/useJourney";
import { useQuery } from "@tanstack/react-query";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";
import { container } from "@/lib/core/di/Container";
import { TOKENS } from "@/lib/core/di/registry";
import { ApplicationService } from "@/services/application/application.service";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading: journeyLoading } = useJourney();
  const [showWelcome, setShowWelcome] = React.useState(false);

  const applicationService = useMemo(() => container.resolve<ApplicationService>(TOKENS.APPLICATION_SERVICE), []);

  const { data: apps = [], isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationService.getMyApplications(),
    enabled: !!user,
  });

  React.useEffect(() => {
    if (!journeyLoading) {
      setShowWelcome(true);
    }
  }, [journeyLoading]);

  if (journeyLoading || appsLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#030712]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <PortalLayout>
      <SuccessMoments show={showWelcome} onComplete={() => setShowWelcome(false)} />
      <ExecutiveDashboard apps={apps} />
    </PortalLayout>
  );
}
