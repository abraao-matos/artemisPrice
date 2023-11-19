import Modal from "@/components/Modal";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect("/");

  const similarProducts = await getSimilarProducts(id);

  const formatCurrentPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };

  const formatOriginalPrice = (price: number) => {
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(price / 100);

    return formattedPrice;
  };

  const pricesAreEqual = product?.currentPrice === product?.originalPrice;
  const pricesAreHighest = product?.currentPrice === product?.highestPrice;

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={510}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>

              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visite o Produto
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="coração"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />

                <p className="text-base font-semibold text-[#D46F77">
                  {product.reviewsCount}
                </p>
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="favoritos"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="compartilhar"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {formatCurrentPrice(product?.currentPrice)}
              </p>

              {pricesAreEqual ? null : (
                <p className="text-[21px] text-black opacity-50 line-through">
                  {formatOriginalPrice(product?.originalPrice)}
                </p>
              )}
            </div>

            <div className="flex flex-col  gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="estrela"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || "25"}
                  </p>
                </div>

                <div className="product-reviews">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="comentarios"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount} comentários
                  </p>
                </div>
              </div>

              <p className="text-[0.812rem] text-black opacity-50">
                <span className="text-primary-green font-semibold">
                  {product.message}
                </span>
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Preço Atual"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${formatCurrentPrice(product?.currentPrice)}`}
              />
              <PriceInfoCard
                title="Preço Médio"
                iconSrc="/assets/icons/chart.svg"
                value={`${formatCurrentPrice(product?.averagePrice)}`}
              />
              <PriceInfoCard
                title="Preço Mais Alto"
                iconSrc="/assets/icons/arrow-up.svg"
                value={
                  pricesAreHighest
                    ? `${formatCurrentPrice(product?.highestPrice)}`
                    : `${formatOriginalPrice(product?.highestPrice)}`
                }
              />
              <PriceInfoCard
                title="Menor Preço"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${formatCurrentPrice(product?.lowestPrice)}`}
              />
            </div>
          </div>
          <div className="flex flex-row gap-5 items-center justify-center">
            <button className="btn flex items-center justify-center gap-3 min-w-[200px]">
              <Image
                src="/assets/icons/bag.svg"
                alt="comprar"
                width={22}
                height={22}
              />
              <Link href={product?.url} className="text-base text-white">
                Comprar Agora
              </Link>
            </button>
            <Modal productId={id} />
          </div>
        </div>
      </div>

      {similarProducts && similarProducts?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Produtos relacionados</p>
          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
