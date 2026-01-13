import { GetServerSideProps } from 'next';
import { medusaClient } from '@lib/config';
import { ProductCategory } from '@medusajs/client-types';

interface CategoryPageProps {
  categories: ProductCategory[] | null;
  error?: string;
}

export default function CategoryPage({ categories, error }: CategoryPageProps) {
  if (error) {
    return <div className="text-red-500 p-4">Erreur: {error}</div>;
  }

  if (!categories) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Catégories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Récupère les paramètres dynamiques
    const { countryCode, category } = context.params!;
    const categoryPath = Array.isArray(category) ? category.join('/') : category;

    // Appel à l'API Medusa (avec timeout de 5s)
    const { data } = await medusaClient.categories.list(
      { handle: categoryPath },
      { timeout: 5000 }
    );

    return {
      props: {
        categories: data.categories || [],
      },
    };
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return {
      props: {
        categories: null,
        error: err instanceof Error ? err.message : 'Failed to load categories',
      },
    };
  }
};
