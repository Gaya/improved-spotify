import { useReducer } from 'react';

import { PlaylistView } from '../../../types';
import { getStoredPlaylistView, storePlaylistView } from '../utils';

interface PlaylistPageState {
  filter: string;
  viewAs: PlaylistView;
  selectedArtist: string | undefined;
}

interface ActionViewAs {
  type: 'VIEW_AS';
  payload: PlaylistView;
}

interface ActionSelectArtist {
  type: 'SELECT_ARTIST';
  payload: string;
}

interface ActionResetArtist {
  type: 'RESET_ARTIST';
}

interface ActionSetFilter {
  type: 'SET_FILTER';
  payload: string;
}

type PlaylistPageAction = ActionViewAs | ActionSelectArtist | ActionResetArtist | ActionSetFilter;

const defaultState: PlaylistPageState = {
  filter: '',
  viewAs: getStoredPlaylistView(),
  selectedArtist: undefined,
};

function reducer(state = defaultState, action: PlaylistPageAction): PlaylistPageState {
  switch (action.type) {
    case 'VIEW_AS':
      return {
        ...state,
        viewAs: action.payload,
        selectedArtist: undefined,
      };
    case 'SELECT_ARTIST':
      return {
        ...state,
        selectedArtist: action.payload,
      };
    case 'RESET_ARTIST':
      return {
        ...state,
        selectedArtist: undefined,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
}

interface UsePlaylistPage {
  state: PlaylistPageState;
  selectView(view: PlaylistView): void;
  selectArtist(artist: string): void;
  resetArtist(): void;
  setFilter(filter: string): void;
}

function usePlaylistPage(): UsePlaylistPage {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const selectView = (viewType: PlaylistView): void => {
    dispatch({
      type: 'VIEW_AS',
      payload: viewType,
    });

    storePlaylistView(viewType);
  };

  const selectArtist = (artist: string): void => {
    dispatch({
      type: 'SELECT_ARTIST',
      payload: artist,
    });
  };

  const resetArtist = (): void => {
    dispatch({ type: 'RESET_ARTIST' });
  };

  const setFilter = (filter: string): void => {
    dispatch({
      type: 'SET_FILTER',
      payload: filter,
    });
  };

  return {
    state,
    selectView,
    selectArtist,
    resetArtist,
    setFilter,
  };
}

export default usePlaylistPage;
