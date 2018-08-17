import { ResultsUpdateAction } from './results-update-action';
import { NewItemSwapEvent } from '@models/types';
import { ActionType } from '@app/store/latest-search-results/actions/action-type.enum';

export class NewItemSwap implements ResultsUpdateAction {
  readonly type = ActionType.NEW_ITEM_SWAP;
  constructor(public payload: NewItemSwapEvent) {}
}
