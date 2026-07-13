export const JOURNEY_STEPS = [
  { id: 1, label: "انتخاب رشته", icon: "GraduationCap", duration: "۱ هفته", cost: "رایگان" },
  { id: 2, label: "انتخاب دانشگاه", icon: "School", duration: "۲ هفته", cost: "رایگان" },
  { id: 3, label: "اخذ پذیرش", icon: "FileCheck", duration: "۴-۸ هفته", cost: "$۱۰۰ - $۵۰۰" },
  { id: 4, label: "ویزای تحصیلی", icon: "Passport", duration: "۲-۴ هفته", cost: "$۱۵۰" },
  { id: 5, label: "رزرو خوابگاه", icon: "Home", duration: "۱ هفته", cost: "$۳۰۰ - $۱۰۰۰" },
  { id: 6, label: "بلیط هواپیما", icon: "Plane", duration: "۱ روز", cost: "$۲۰۰ - $۵۰۰" },
  { id: 7, label: "ورود به ترکیه", icon: "MapPin", duration: "۱ روز", cost: "رایگان" },
  { id: 8, label: "افتتاح حساب بانکی", icon: "CreditCard", duration: "۱-۳ روز", cost: "رایگان" },
  { id: 9, label: "مجوز اقامت (İkamet)", icon: "ShieldCheck", duration: "۴-۱۲ هفته", cost: "$۱۰۰" },
  { id: 10, label: "ثبت‌نام نهایی", icon: "UserCheck", duration: "۱ هفته", cost: "متغیر" },
];

export const INITIAL_USER = {
  name: "سارا",
  major: "معماری",
  budget: 15000,
  gpa: 19.2,
  currentStep: 3,
  tasks: [
    { id: "t1", label: "ترجمه رسمی ریزنمرات", status: "completed", category: "document" },
    { id: "t2", label: "اسکن پاسپورت", status: "completed", category: "document" },
    { id: "t3", label: "پرداخت اپلیکیشن فی", status: "pending", category: "financial" },
    { id: "t4", label: "رزرو وقت سفارت", status: "locked", category: "legal" },
  ]
};
