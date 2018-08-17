import { DestinationResult } from '@models/types/destination-result';

export interface NewItemSwapEvent {
  result: DestinationResult;
  index: number;
}
