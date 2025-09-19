import { TechCard } from '@/features/card-pool';

export interface ShopState {
  cards: TechCard[];
  isRerolling?: boolean;
}

export interface PurchaseResult {
  success: boolean;
  purchasedCard?: TechCard;
  error?: string;
}

export interface RerollResult {
  success: boolean;
  newCards?: TechCard[];
  error?: string;
}