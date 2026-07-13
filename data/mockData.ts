import { University, City, Scholarship } from "@/types";

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "s1",
    name: "بورسیه استعدادهای درخشان کوچ",
    coverage: 100,
    type: "Merit",
    description: "پوشش کامل شهریه و هزینه اسکان برای معدل‌های بالای ۱۹.",
    requirements: ["معدل بالای ۱۹", "آیلتس ۷.۵"],
    deadline: "۲۰۲۶-۰۸-۱۵"
  },
  {
    id: "s2",
    name: "تخفیف خانوادگی باهچه‌شهیر",
    coverage: 25,
    type: "Institutional",
    description: "تخفیف ویژه برای خواهر و برادرهای دانشجویان فعلی.",
    requirements: ["اثبات رابطه خانوادگی"],
    deadline: "۲۰۲۶-۰۹-۰۱"
  }
];

export const CITIES: City[] = [
  {
    id: "istanbul",
    name: "استانبول",
    rent: "۱۲,۰۰۰ - ۲۵,۰۰۰",
    dorm: "۵,۰۰۰ - ۱۲,۰۰۰",
    transport: "۵۰۰ - ۸۰۰",
    food: "۴,۰۰۰ - ۷,۰۰۰",
    safety: "متوسط رو به بالا",
    weather: "معتدل مدیترانه‌ای",
    internet: "۱۰۰ Mbps +",
    jobs: "بالا (گردشگری، آی‌تی)",
    coords: { x: "20%", y: "25%" },
    livingCost: "High",
    population: "15M",
    studentLifeRating: 9.5,
    transportation: "Excellent"
  },
  {
    id: "ankara",
    name: "آنکارا",
    rent: "۸,۰۰۰ - ۱۵,۰۰۰",
    dorm: "۳,۵۰۰ - ۸,۰۰۰",
    transport: "۴۰۰ - ۶۰۰",
    food: "۳,۵۰۰ - ۶,۰۰۰",
    safety: "بسیار بالا",
    weather: "قاره‌ای (سرد)",
    internet: "۵۰-۱۰۰ Mbps",
    jobs: "متوسط (دولتی، آکادمیک)",
    coords: { x: "45%", y: "40%" },
    livingCost: "Medium",
    population: "5M",
    studentLifeRating: 8.5,
    transportation: "Good"
  }
];

export const UNIVERSITIES: University[] = [
  {
    id: "koc",
    name: "دانشگاه کوچ",
    slug: "koc-university",
    type: "Private",
    city: "Istanbul",
    rankingGlobal: 451,
    rankingLocal: 1,
    logo: "/logos/koc.png",
    heroImage: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200",
    gallery: [],
    description: "دانشگاه کوچ یکی از پیشروترین موسسات آموزشی در ترکیه است...",
    tuitionRange: { min: 15000, max: 25000, currency: "USD" },
    scholarships: [SCHOLARSHIPS[0]],
    dormitory: true,
    campusPhotos: [],
    faculties: ["مهندسی", "علوم پایه", "اقتصاد"],
    programs: [
      { id: "p1", name: "مهندسی کامپیوتر", faculty: "مهندسی", degree: "Bachelor", language: "English", duration: 4, tuition: 20000, currency: "USD", requirements: ["SAT 1450"] }
    ],
    deadlines: [{ term: "Fall 2026", date: "2026-07-30" }],
    faq: [{ q: "آیا خوابگاه تضمینی است؟", a: "بله، برای سال اول تمام دانشجویان بین‌المللی." }],
    verified: true
  },
  {
    id: "bahcesehir",
    name: "دانشگاه باهچه‌شهیر",
    slug: "bahcesehir-university",
    type: "Private",
    city: "Istanbul",
    rankingGlobal: 801,
    rankingLocal: 5,
    logo: "/logos/bau.png",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200",
    gallery: [],
    description: "باهچه‌شهیر در قلب استانبول واقع شده و ارتباطات بین‌المللی قوی دارد.",
    tuitionRange: { min: 8000, max: 12000, currency: "USD" },
    scholarships: [SCHOLARSHIPS[1]],
    dormitory: true,
    campusPhotos: [],
    faculties: ["پزشکی", "دندانپزشکی", "معماری"],
    programs: [],
    deadlines: [],
    faq: [],
    verified: true
  }
];

export const TESTIMONIALS = [
  {
    name: "امیرحسین رضایی",
    uni: "دانشگاه فنی استانبول (ITU)",
    story: "از استرس ریجکتی ویزا تا شروع ترم اول در قلب استانبول. ترکیه هاب مسیر من رو کاملا شفاف کرد.",
    timeline: "۴ ماه",
    visa: "تایید شده",
    housing: "خوابگاه دولتی",
    image: "https://i.pravatar.cc/150?u=amir"
  },
  {
    name: "سارا کریمی",
    uni: "دانشگاه کوچ",
    story: "پیدا کردن بورسیه ۷۵٪ بدون ترکیه هاب غیرممکن بود. سیستم ارزیابی اون‌ها دقیقا گفت کجا شانس دارم.",
    timeline: "۶ ماه",
    visa: "تایید شده",
    housing: "آپارتمان شخصی",
    image: "https://i.pravatar.cc/150?u=sara"
  }
];
