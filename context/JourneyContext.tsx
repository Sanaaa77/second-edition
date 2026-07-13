import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StudentProfile, University, Program } from '@/types/models';
import { DecisionReport } from '@/lib/decision-engine/types';
import { container } from '@/lib/core/di/Container';
import { TOKENS } from '@/lib/core/di/registry';
import { DecisionReportService } from '@/services/decision/decision-report.service';
import { ProfileService } from '@/services/profile/profile.service';

interface JourneyContextValue {
  student: StudentProfile | null;
  decisionReport: DecisionReport | null;
  universities: University[];
  programs: Program[];
  isLoading: boolean;
}

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profileService = useMemo(() => container.resolve<ProfileService>(TOKENS.PROFILE_SERVICE), []);
  const decisionReportService = useMemo(() => container.resolve<DecisionReportService>(TOKENS.DECISION_REPORT_SERVICE), []);

  const { data: student, isLoading: isProfileLoading } = useQuery<StudentProfile | null>({
    queryKey: ['student-profile-legacy'],
    queryFn: async () => {
       const p = await profileService.getOwnProfile();
       return p as any;
    }
  });

  const { data: decisionReport, isLoading: isReportLoading } = useQuery<DecisionReport | null>({
    queryKey: ['decision-report-legacy', student?.id],
    queryFn: () => decisionReportService.getPersonalizedReport(),
    enabled: !!student,
  });

  const value = useMemo(() => ({
    student: student || null,
    decisionReport: decisionReport || null,
    universities: [],
    programs: [],
    isLoading: isProfileLoading || isReportLoading,
  }), [student, decisionReport, isProfileLoading, isReportLoading]);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
};

export const useJourneyLegacy = () => {
  const context = useContext(JourneyContext);
  if (!context) throw new Error('useJourneyLegacy must be used within JourneyProvider');
  return context;
};
