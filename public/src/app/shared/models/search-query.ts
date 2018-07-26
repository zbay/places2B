import { DestinationType } from '../enums/destination-type.enum';

export interface SearchQuery {
  city: string;
  destinations: [{ kind: DestinationType}];
  queryTypes: DestinationType[];
  radius: number;
}
