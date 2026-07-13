"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { FileText, Upload, Trash2, CheckCircle, Loader2, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { cn } from "@/lib/utils";
import { container } from "@/lib/core/di/Container";
import { TOKENS } from "@/lib/core/di/registry";
import { DocumentService } from "@/services/document/document.service";

const DOC_TYPES = [
  { label: "پاسپورت", value: "Passport" },
  { label: "ریزنمرات", value: "Transcript" },
  { label: "دانشنامه", value: "Diploma" },
  { label: "مدرک زبان", value: "Language_Cert" },
];

export const DocumentCenter = () => {
  const queryClient = useQueryClient();
  const [uploadingType, setUploadingType] = React.useState<string | null>(null);

  const documentService = useMemo(() => container.resolve<DocumentService>(TOKENS.DOCUMENT_SERVICE as any), []);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DOCUMENTS],
    queryFn: () => documentService.getMyDocuments(),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, type }: { file: File; type: any }) => documentService.upload(file, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCUMENTS] });
      setUploadingType(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingType(type);
      uploadMutation.mutate({ file, type: type as any });
    }
  };

  return (
    <PremiumCard className="p-8 space-y-6">
      <h3 className="text-xl font-black text-right flex items-center justify-end gap-3 text-foreground">
        مرکز مدارک <FileText className="text-primary w-5 h-5" />
      </h3>
      <div className="space-y-4 text-right">
        {DOC_TYPES.map((type) => {
          const doc = documents.find(d => d.type === type.value);
          return (
            <div key={type.value} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5 group hover:border-primary/30 transition-all">
               <div className="flex items-center gap-3">
                  {doc ? (
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Eye className="w-4 h-4 opacity-40 text-foreground" /></button>
                  ) : (
                    <label className="p-2 hover:bg-primary/20 rounded-lg text-primary cursor-pointer">
                       {uploadingType === type.value ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                       <input type="file" className="hidden" onChange={(e) => handleFileChange(e, type.value)} />
                    </label>
                  )}
               </div>
               <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{type.label}</div>
                  <div className={cn("text-[10px] font-bold uppercase mt-1", doc ? "text-green-500" : "text-muted")}>
                     {doc ? "Uploaded" : "Required"}
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
};
