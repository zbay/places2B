import { ResultsUpdateAction } from './results-update-action';
import { ActionType } from '@app/store/latest-search-results/actions/action-type.enum';

export class ClearUpdate implements ResultsUpdateAction {
  readonly type = ActionType.CLEAR;
  payload: null;
}
