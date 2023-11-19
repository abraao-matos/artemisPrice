import HeroCarousel from "@/components/HeroCarousel";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions";
import ProductCard from "@/components/ProductCard";

const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-20 py-10">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              As melhores ofertas ao seu alcance aqui:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow right"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text">
              Economize tempo e dinheiro com
              <span className="text-primary"> ArtemisPrice</span>
            </h1>

            <p className="mt-6">
              Sua ferramenta para caçar as melhores ofertas. Economize dinheiro
              em suas compras com facilidade.
            </p>

            <SearchBar />
          </div>

          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Melhores Ofertas</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;