"use client";
import React, { createContext, useContext, useMemo, useEffect } from "react";
import { INITIAL_USER } from "@/data/userJourney";
import { useAuth } from "@/hooks/useAuth";
import { Profile, Task, University, Program } from "@/types/database";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { DecisionReport } from "@/lib/decision-engine/types";
import { initDomainEventHandlers } from "@/services/events/handlers";
import { ProfileService } from "@/services/profile/profile.service";
import { TaskService } from "@/services/task/task.service";
import { DecisionReportService } from "@/services/decision/decision-report.service";
import { UniversityRepository, ProfileRepository, ApplicationRepository, OfferRepository, VisaRepository } from "@/lib/repositories/index";
import { UniversityService } from "@/services/university/university.service";
import { ApplicationService } from "@/services/application/application.service";
import { initializeContainer, container, TOKENS } from "@/lib/core/di/registry";

interface JourneyContextValue {
  user: Profile | typeof INITIAL_USER;
  updateUser: (updates: Partial<Profile>) => Promise<void>;
  currentStep: number;
  progress: number;
  decisionReport: DecisionReport | null;
  isLoading: boolean;
  tasks: Task[];
  universities: University[];
  programs: Program[];
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  completeTask: (taskId: string) => Promise<void>;
  updateProfileMutation: UseMutationResult<void, Error, Partial<Profile>>;
}

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined);

export const JourneyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  // Ensure container is initialized
  useMemo(() => {
    initializeContainer();
  }, []);

  // Instantiate services for the provider using DI container
  const profileService = useMemo(() => container.resolve<ProfileService>(TOKENS.PROFILE_SERVICE), []);
  const taskService = useMemo(() => container.resolve<TaskService>(TOKENS.TASK_SERVICE), []);
  const decisionReportService = useMemo(() => container.resolve<DecisionReportService>(TOKENS.DECISION_REPORT_SERVICE), []);

  useEffect(() => {
    initDomainEventHandlers();
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE, authUser?.id],
    queryFn: () => profileService.getOwnProfile(),
    enabled: !!authUser,
  });

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: [QUERY_KEYS.TASKS, authUser?.id],
    queryFn: () => taskService.getMyTasks(),
    enabled: !!authUser,
  });

  const { data: decisionReport = null } = useQuery({
    queryKey: ['decision-report', profile?.id],
    queryFn: () => decisionReportService.getPersonalizedReport(),
    enabled: !!profile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => profileService.updateProfile(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] }),
  });

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskService.complete(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] }),
  });

  const userData = useMemo(() => profile || INITIAL_USER, [profile]);
  const currentStep = (userData as any).current_step || (userData as any).currentStep || 1;
  
  const progress = useMemo(() => {
    if (!tasks || tasks.length === 0) return 0;
    const completedCount = tasks.filter(t => t.status === "completed").length;
    return (completedCount / tasks.length) * 100;
  }, [tasks]);

  const isLoading = isProfileLoading || isTasksLoading;

  const value = useMemo(() => ({ 
    user: userData, 
    updateUser: async (updates: Partial<Profile>) => { await updateProfileMutation.mutateAsync(updates); }, 
    currentStep, 
    progress, 
    decisionReport,
    isLoading,
    tasks,
    universities: [],
    programs: [],
    bookmarks: [],
    toggleBookmark: (id: string) => Logger.info("Bookmark toggled", { id }),
    completeTask: async (taskId: string) => { await completeTaskMutation.mutateAsync(taskId); },
    updateProfileMutation
  }), [userData, currentStep, progress, tasks, isLoading, decisionReport, updateProfileMutation, completeTaskMutation]);

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  return context;
};
