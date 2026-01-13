import { Metadata } from "next";
import { listCategories, listRegions } from "@lib/data"; // Remplace par tes imports réels
import { notFound } from "next/navigation";

// Types (à adapter selon tes données)
interface StoreRegion {
  countries: string[];
  // ... autres champs si nécessaire
}

interface Category {
  handle: string;
  // ... autres champs
}

interface Props {
  params: {
    countryCode: string;
    category: string[];
  };
}

// 1. Génération des chemins statiques
export async function generateStaticParams() {
  try {
    const product_categories = await listCategories();
    if (!product_categories || product_categories.length === 0) {
      return []; // Retourne un tableau vide si aucune catégorie
    }

    const regions = await listRegions();
    const countryCodes = regions
      ?.map((region: StoreRegion) => region.countries)
      .flat()
      .filter(Boolean) || [];

    // Génère toutes les combinaisons countryCode + catégorie
    const staticParams = countryCodes.flatMap((countryCode) =>
      product_categories.map((category: Category) => ({
        countryCode,
        category: category.handle,
      }))
    );

    return staticParams;
  } catch (error) {
    console.error("Erreur dans generateStaticParams:", error);
    return [];
  }
}

// 2. Génération des métadonnées dynamiques
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryCode, category } = params;
  const decodedCategory = decodeURIComponent(category.join("/"));

  return {
    title: `${decodedCategory} | JobNexAI - ${countryCode.toUpperCase()}`,
    description: `Découvrez nos ${decodedCategory} en ${countryCode}.`,
    openGraph: {
      title: `${decodedCategory} | ${countryCode.toUpperCase()}`,
      images: [`/api/og?category=${decodedCategory}&country=${countryCode}`],
    },
  };
}

// 3. Composant Page
export default function CategoryPage({ params }: Props) {
  const { countryCode, category } = params;

  // Logs de débogage (à supprimer en prod)
  console.log("Params reçus:", { countryCode, category });

  // Exemple de traitement des catégories imbriquées
  const categoryPath = category.join("/");
  if (!categoryPath) {
    notFound(); // Gère le cas où la catégorie est vide
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {decodeURIComponent(categoryPath)} en {countryCode.toUpperCase()}
      </h1>
      {/* Contenu dynamique ici */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Exemple: Liste des produits de la catégorie */}
        <p>Produits pour {categoryPath}...</p>
      </div>
    </main>
  );
}
