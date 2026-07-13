"use client";
import React, { useMemo } from "react";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { CheckCircle2, Circle, Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { cn } from "@/lib/utils";
import { container } from "@/lib/core/di/Container";
import { TOKENS } from "@/lib/core/di/registry";
import { TaskService } from "@/services/task/task.service";

export const TaskManager = () => {
  const queryClient = useQueryClient();
  
  const taskService = useMemo(() => container.resolve<TaskService>(TOKENS.TASK_SERVICE as any), []);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TASKS],
    queryFn: () => taskService.getMyTasks(),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => taskService.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] }),
  });

  return (
    <PremiumCard className="p-8 space-y-6">
      <div className="flex justify-between items-center">
         <Plus className="w-5 h-5 opacity-20 cursor-pointer" />
         <h3 className="text-xl font-black text-foreground">وظایف جاری</h3>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : (
          tasks.slice(0, 5).map(task => (
            <div key={task.id} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5">
               <button onClick={() => task.status !== 'completed' && completeMutation.mutate(task.id)}>
                 {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted hover:text-primary" />}
               </button>
               <div className="text-right">
                  <div className={cn("text-sm font-bold text-foreground", task.status === 'completed' && "line-through opacity-40")}>{task.label}</div>
                  <div className="text-[9px] font-black uppercase text-muted mt-1">{task.category}</div>
               </div>
            </div>
          ))
        )}
      </div>
    </PremiumCard>
  );
};
