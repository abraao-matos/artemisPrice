import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength) + "...";
    }
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="product-card md:space-x1-10"
    >
      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="product-title">{truncateText(product.title, 50)}</h3>
      </div>

      <div className="flex justify-between">
        <p className="text-black opacity-50 text-lg capitalize">amazon</p>

        <p className="text-black text-lg font-semibold">
          <span>{formatPrice(product?.currentPrice)}</span>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
