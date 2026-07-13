import { Metadata } from 'next';
import { container, TOKENS } from '@/lib/core/di/registry';
import { KnowledgeService } from '@/services/university/knowledge.service';
import { UniversityDetail } from '@/components/university/UniversityDetail';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const knowledgeService = container.resolve<KnowledgeService>(TOKENS.KNOWLEDGE_SERVICE);
  const university = await knowledgeService.getUniversityDetail(params.slug);

  if (!university) return { title: 'University Not Found' };

  return {
    title: `${university.name} | معرفی کامل و شرایط پذیرش | ترکیه هاب`,
    description: university.description?.substring(0, 160),
    openGraph: {
      title: university.name,
      description: university.description?.substring(0, 160),
      images: [university.hero_image_url || ''],
    },
  };
}

export default async function UniversityPage({ params }: Props) {
  const knowledgeService = container.resolve<KnowledgeService>(TOKENS.KNOWLEDGE_SERVICE);
  const university = await knowledgeService.getUniversityDetail(params.slug);

  if (!university) {
    notFound();
  }

  return <UniversityDetail university={university} />;
}
