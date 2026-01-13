import { Button, Heading } from "@medusajs/ui"
 
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full border-b border-ui-border-base bg-white">
      <div className="content-container py-16 small:py-24">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6">
            <span className="uppercase text-small-regular tracking-wide text-ui-fg-subtle">
              MBWood
            </span>
            <Heading
              level="h1"
              className="text-3xl small:text-4xl leading-tight text-ui-fg-base font-normal"
            >
              Transformez votre jardin en paradis vert
            </Heading>
            <p className="text-base-regular text-ui-fg-subtle max-w-xl">
              Votre expert en chauffage au bois &amp; énergie durable. Livraison rapide en Île-de-France.
            </p>
            <div className="flex items-center gap-3">
              <LocalizedClientLink href="/store">
                <Button variant="primary">Acheter des produits</Button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/store">
                <Button variant="secondary">Découvrir</Button>
              </LocalizedClientLink>
            </div>
          </div>

          <div className="relative">
            <div className="h-64 small:h-[420px] w-full rounded-large border border-ui-border-base overflow-hidden bg-gradient-to-br from-[#2f5d3a] via-[#4a7c59] to-[#d9c7a3]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
