import { ResultsUpdateAction } from './results-update-action';
import { ReorderSwapEvent } from '@models/types';
import { ActionType } from '@app/store/latest-search-results/actions/action-type.enum';

export class ReorderSwap implements ResultsUpdateAction {
  readonly type = ActionType.NEW_ITEM_SWAP;
  constructor(public payload: ReorderSwapEvent) {}
}
