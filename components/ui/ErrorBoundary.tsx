"use client";

import React from "react";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { AlertCircle, RefreshCcw } from "lucide-react";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 text-right">
      <PremiumCard className="max-w-md w-full text-center space-y-6 border-red-500/20">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">خطایی رخ داده است</h2>
          <p className="text-sm text-muted font-bold">{(error as Error)?.message || "مشکلی در بارگذاری این بخش به وجود آمده است."}</p>
        </div>
        <MagneticButton 
          onClick={resetErrorBoundary}
          className="w-full py-4 font-black flex items-center justify-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>تلاش مجدد</span>
        </MagneticButton>
      </PremiumCard>
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};
