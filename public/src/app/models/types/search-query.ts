import { DestinationType } from '@models/enums/destination-type.enum';

export interface SearchQuery {
  city: string;
  destinations: { kind: string }[];
  radius: number;
  price: string;

  // Derived from destinations. Not part of the user-originating query
  queryTypes?: DestinationType[];

  // properties only used for swapping
  category?: DestinationType;
  otherDestIDs?: string[];
}
