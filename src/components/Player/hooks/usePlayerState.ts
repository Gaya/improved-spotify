import { Dispatch, useReducer } from 'react';

interface PlaySongAction {
  type: 'PLAY_SONG';
  song: SpotifyAlbumTrack;
}

interface ResumeSongAction {
  type: 'RESUME_SONG';
  position: number;
}

interface PauseSongAction {
  type: 'PAUSE_SONG';
}

interface SeekSongAction {
  type: 'SEEK_SONG';
  position: number;
}

interface UpdatePositionSongAction {
  type: 'UPDATE_POSITION_SONG';
  position: number;
}

interface StopSongAction {
  type: 'STOP_SONG';
}

type Actions = PlaySongAction | ResumeSongAction | PauseSongAction | SeekSongAction
  | UpdatePositionSongAction | StopSongAction;

function current(
  state: PlayerPlaybackState['current'],
  action: Actions,
): PlayerPlaybackState['current'] {
  switch (action.type) {
    case 'PLAY_SONG':
      return action.song;
    case 'STOP_SONG':
      return undefined;
    default:
      return state;
  }
}

function paused(
  state: PlayerPlaybackState['paused'],
  action: Actions,
): PlayerPlaybackState['paused'] {
  switch (action.type) {
    case 'RESUME_SONG':
    case 'PLAY_SONG':
      return false;
    case 'PAUSE_SONG':
    case 'STOP_SONG':
      return true;
    default:
      return state;
  }
}

function playbackPosition(
  state: PlayerPlaybackState['playbackPosition'],
  action: Actions,
): PlayerPlaybackState['playbackPosition'] {
  switch (action.type) {
    case 'PLAY_SONG':
    case 'STOP_SONG':
      return 0;
    case 'RESUME_SONG':
    case 'SEEK_SONG':
      return action.position;
    default:
      return state;
  }
}

function playbackStarted(
  state: PlayerPlaybackState['playbackStarted'],
  action: Actions,
): PlayerPlaybackState['playbackStarted'] {
  switch (action.type) {
    case 'PLAY_SONG':
    case 'RESUME_SONG':
    case 'SEEK_SONG':
      return +new Date();
    case 'STOP_SONG':
      return 0;
    default:
      return state;
  }
}

function position(
  state: PlayerPlaybackState['position'],
  action: Actions,
): PlayerPlaybackState['position'] {
  switch (action.type) {
    case 'PLAY_SONG':
    case 'STOP_SONG':
      return 0;
    case 'SEEK_SONG':
    case 'UPDATE_POSITION_SONG':
      return action.position;
    default:
      return state;
  }
}

function reducer(state: PlayerPlaybackState, action: Actions): PlayerPlaybackState {
  return {
    current: current(state.current, action),
    paused: paused(state.paused, action),
    playbackPosition: playbackPosition(state.playbackPosition, action),
    playbackStarted: playbackStarted(state.playbackStarted, action),
    position: position(state.position, action),
  };
}

function usePlaybackState(
  defaultState: PlayerPlaybackState,
): [PlayerPlaybackState, Dispatch<Actions>] {
  const [playbackState, dispatch] = useReducer(reducer, defaultState);

  return [playbackState, dispatch];
}

export default usePlaybackState;
