import { Metadata } from 'next';
import { KnowledgeCenter } from '@/components/knowledge/KnowledgeCenter';

export const metadata: Metadata = {
  title: 'مرکز دانش ترکیه هاب | راهنمای جامع تحصیل در ترکیه',
  description: 'اطلاعات کامل درباره دانشگاه‌ها، رشته‌ها، ویزا و زندگی دانشجویی در ترکیه. با TurkeyHub هوشمندانه مهاجرت کنید.',
  openGraph: {
    title: 'مرکز دانش ترکیه هاب',
    description: 'کامل‌ترین مرجع تحصیل در ترکیه برای دانشجویان ایرانی.',
    images: ['https://turkeyhub.ir/og-knowledge.jpg'],
  },
};

export default function KnowledgePage() {
  return <KnowledgeCenter />;
}
