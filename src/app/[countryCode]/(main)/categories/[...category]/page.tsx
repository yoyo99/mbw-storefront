// src/app/[countryCode]/(main)/categories/[...category]/page.tsx
import { medusaClient } from '@lib/config';
import { ProductCategory } from '@medusajs/client-types';

export default async function CategoryPage({
  params,
}: {
  params: { countryCode: string; category: string[] };
}) {
  // Récupère les catégories côté serveur
  const { category: categoryPath } = params;
  const handle = categoryPath.join('/');

  try {
    const { data } = await medusaClient.categories.list({ handle });
    const categories = data.categories || [];

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
  } catch (error) {
    return <div className="text-red-500 p-4">Erreur: Impossible de charger les catégories</div>;
  }
}
