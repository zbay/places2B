import { ResultsUpdateAction } from './results-update-action';
import { DestinationResult } from '@models/types';
import { ActionType } from '@app/store/latest-search-results/actions/action-type.enum';

export class FullUpdate implements ResultsUpdateAction {
  readonly type = ActionType.FULL_UPDATE;
  constructor(public payload: DestinationResult[]) {}
}
