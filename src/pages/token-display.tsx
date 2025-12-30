import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import TokenDisplay from '@/components/TokenDisplay';

export default function TokenDisplayPage() {
  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Token Display', href: '/token-display' }]}>
      <div className="max-w-7xl mx-auto mt-6">
        <TokenDisplay />
      </div>
    </AppSidebarLayout>
  );
}

