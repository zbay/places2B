import { DestinationType } from '@models/enums/destination-type.enum';

export interface SearchQuery {
  city: string;
  destinations: [{ kind: DestinationType }];
  queryTypes: DestinationType[];
  radius: number;

  // optional properties for swapping
  category?: DestinationType;
  otherDests?: string[];
}
