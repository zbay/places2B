import { DestinationType } from '@models/enums';

export interface DestinationResult {
  id: string;
  category: DestinationType;
  image_url: string;
  loc: string;
  name: string;
  price: string;
  phone: string;
  rating: string[];
  reviews: string;

  // UI-only property to facilitate swapping animation
  swapStatus?: string;
}
