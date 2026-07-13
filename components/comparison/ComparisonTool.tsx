"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UNIVERSITIES } from "@/data/mockData";
import { Check, X, Info } from "lucide-react";

export const ComparisonTool = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([UNIVERSITIES[0].id, UNIVERSITIES[1].id]);

  const toggleUni = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < 3) setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedUnis = UNIVERSITIES.filter(u => selectedIds.includes(u.id));

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6">مقایسه هوشمند دانشگاه‌ها</h2>
          <p className="opacity-60 text-lg">انتخاب بین گزینه‌های برتر دیگر دشوار نیست.</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {UNIVERSITIES.map(u => (
            <button
              key={u.id}
              onClick={() => toggleUni(u.id)}
              className={`px-6 py-2 rounded-full border transition-all text-sm font-bold ${
                selectedIds.includes(u.id) ? "bg-primary border-primary text-white" : "border-white/10 hover:border-white/30"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-white/5 opacity-40 font-medium text-sm">ویژگی</th>
                {selectedUnis.map(u => (
                  <th key={u.id} className="p-6 border-b border-white/5 text-xl font-black">{u.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <Row label="رتبه جهانی" values={selectedUnis.map(u => u.rankingGlobal.toString())} />
              <Row label="شهریه سالانه" values={selectedUnis.map(u => `${u.tuitionRange.min} ${u.tuitionRange.currency}`)} />
              <Row label="نوع دانشگاه" values={selectedUnis.map(u => u.type)} />
              <Row label="خوابگاه" values={selectedUnis.map(u => u.dormitory ? "دارد" : "ندارد")} />
              <Row label="تعداد دانشکده" values={selectedUnis.map(u => u.faculties.length.toString())} />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const Row = ({ label, values }: { label: string, values: string[] }) => (
  <tr className="hover:bg-white/[0.02] transition-colors">
    <td className="p-6 border-b border-white/5 opacity-60 font-medium">{label}</td>
    {values.map((v, i) => (
      <td key={i} className="p-6 border-b border-white/5 font-bold">{v}</td>
    ))}
  </tr>
);
