import { CharacteristicProduct } from '../models/charactertistics-product/characteristic-product.model';

export const calculatePrice = (
  count: number,
  product: CharacteristicProduct,
) => {
  const price =
    count > 200_000
      ? product.price
      : count > 50_000
      ? product.secondPrice
      : count > 10_000
      ? product.thirdPrice
      : product.fourthPrice;

  return count * price;
};
