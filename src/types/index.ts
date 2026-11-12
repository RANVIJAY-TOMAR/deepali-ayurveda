export interface KeyIngredient {
  name: string;
  source: string;
  amount: string;
  benefit: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  sanskritName?: string;
  subName: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity?: number;
  isActive?: boolean;
  tag: string;
  badgeColor: string;
  volume: string;
  serving?: string;
  shelfLife: string;
  scientificFact?: string;
  shortDescription: string;
  heroBenefit: string;
  symptoms: string[];
  whyYouNeedIt: string[];
  whoShouldTake?: string;
  keyIngredients: KeyIngredient[];
  dosage: string;
  bestTime: string;
  course: string;
  whoShouldNotTake?: string;
  certifications: string[];
  image: string;
  colorScheme?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CategoryDetail {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  image: string;
  badge: string;
  productCount: number;
}

export interface VerifiedTestimonial {
  id: number;
  name: string;
  location: string;
  verifiedPurchase: boolean;
  rating: number;
  productName: string;
  review: string;
  date: string;
}

export interface HeritageTimelineItem {
  year: string;
  milestone: string;
  description: string;
}

export interface CustomerOrderData {
  orderId: string;
  date: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    paymentMethod: string;
    specialNotes?: string;
  };
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  paymentId?: string;
}
