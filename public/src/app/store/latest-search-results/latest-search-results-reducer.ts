import { DestinationResult, NewItemSwapEvent, ReorderSwapEvent } from '../../models/types/index';
import { ResultsUpdateAction } from './actions/results-update-action';
import { ActionType } from '@app/store/latest-search-results/actions/action-type.enum';

export function latestSearchResultsReducer(state: DestinationResult[] = [], action: ResultsUpdateAction) {
  switch (action.type) {
    case ActionType.FULL_UPDATE:
      return action.payload;
    case ActionType.REORDER_SWAP:
      return immutableReorderSwap(state, action.payload);
    case ActionType.NEW_ITEM_SWAP:
      return immutableNewItemSwap(state, action.payload);
    case ActionType.CLEAR:
      return [];
    default:
      return state;
  }
}

function immutableNewItemSwap(state: DestinationResult[], swapEvent: NewItemSwapEvent) {
  const stateCopy = [...state];
  const index = swapEvent.index;
  return stateCopy.slice(0, index)
    .concat(swapEvent.result)
    .concat((index < state.length - 1) ? stateCopy.slice(index + 1) : []);
}

function immutableReorderSwap(state: DestinationResult[], swapEvent: ReorderSwapEvent): DestinationResult[] {
  const index1 = swapEvent.index1;
  const index2 = swapEvent.index2;
  if (index1 >= index2 || index1 >= state.length || index2 >= state.length) {
    return state;
  }
  const stateCopy = [...state];
  return stateCopy.slice(0, index1)
    .concat(state[index2])
    .concat(stateCopy.slice(index1 + 1, index2))
    .concat(state[index1])
    .concat(index2 < state.length - 1 ? stateCopy.slice(index2) : []);
}
