import { SmartRecommendation } from "@/types/decision";

export const MOCK_RECOMMENDATIONS: SmartRecommendation[] = [
  {
    category: "Overall",
    universityId: "koc",
    reasoning: "بر اساس معدل ۱۹.۲ شما، دانشگاه کوچ بهترین ترکیب رنکینگ علمی و شانس بورسیه را ارائه می‌دهد.",
    confidenceScore: 94,
    risks: [
      { label: "رقابت پذیرش", level: "high", description: "ظرفیت محدود برای رشته معماری در این ترم." }
    ],
    pros: ["اعتبار جهانی بالا", "خوابگاه مدرن", "ارتباط قوی با بازار کار"],
    cons: ["هزینه زندگی بالاتر در محله زکریاکوی"]
  },
  {
    category: "Budget",
    universityId: "bahcesehir",
    reasoning: "باهچه‌شهیر با ارائه پکیج‌های بورسیه ۵۰٪، اقتصادی‌ترین گزینه با حفظ کیفیت آموزشی در استانبول است.",
    confidenceScore: 88,
    risks: [
      { label: "نوسان شهریه", level: "medium", description: "احتمال افزایش ۵٪ شهریه در سال دوم." }
    ],
    pros: ["لوکیشن مرکزی", "شهریه بهینه", "برنامه‌های تبادل دانشجو"],
    cons: ["کلاس‌های شلوغ در برخی دانشکده‌ها"]
  }
];

export const CITY_LIFESTYLE_MATCH = [
  { city: "Istanbul", tags: ["پرمتحرک", "فرصت شغلی زیاد", "بین‌المللی"], bestFor: "افراد برون‌گرا و جویای کار" },
  { city: "Ankara", tags: ["آرام", "آکادمیک", "ارزان‌تر"], bestFor: "محققان و تمرکز بر مطالعه" },
  { city: "Izmir", tags: ["ساحلی", "آزاد", "خوش آب و هوا"], bestFor: "تعادل بین درس و تفریح" }
];
