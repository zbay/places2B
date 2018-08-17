import { Action } from '@ngrx/store';
import { ActionType } from '@app/store/latest-search-results/actions/action-type.enum';

export interface ResultsUpdateAction extends Action {
  type: ActionType;
  payload: any;
}
