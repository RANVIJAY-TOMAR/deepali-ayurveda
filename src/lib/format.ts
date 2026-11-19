export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const FREE_SHIPPING_THRESHOLD = 0;
export const STANDARD_SHIPPING_FEE = 0;

export const calculateShipping = (_subtotal: number) => {
  // Free Pan-India Delivery on all orders
  return 0;
};
