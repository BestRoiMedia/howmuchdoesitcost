import { getAllCosts } from '@/lib/costs';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  const costs = getAllCosts();

  return <HomeContent costs={costs} />;
}
