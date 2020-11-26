import { Dispatch, useReducer } from 'react';

interface PlaySongAction {
  type: 'PLAY_SONG';
  song: SpotifyAlbumTrack;
}

interface ResumeSongAction {
  type: 'RESUME_SONG';
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

type Actions = PlaySongAction | ResumeSongAction | PauseSongAction | SeekSongAction | UpdatePositionSongAction;

function reducer(state: PlayerPlaybackState, action: Actions): PlayerPlaybackState {
  switch (action.type) {
    case 'PLAY_SONG':
      return {
        paused: false,
        position: 0,
        playbackPosition: 0,
        playbackStarted: +new Date(),
        current: action.song,
      };
    case 'RESUME_SONG':
      return {
        ...state,
        paused: false,
        playbackPosition: state.position,
        playbackStarted: +new Date(),
      };
    case 'PAUSE_SONG':
      return {
        ...state,
        paused: true,
      };
    case 'SEEK_SONG':
      return {
        ...state,
        position: action.position,
        playbackPosition: action.position,
        playbackStarted: +new Date(),
      };
    case 'UPDATE_POSITION_SONG':
      return {
        ...state,
        position: action.position,
      };
    default:
      return state;
  }
}

function usePlaybackState(
  defaultState: PlayerPlaybackState,
): [PlayerPlaybackState, Dispatch<Actions>] {
  const [playbackState, dispatch] = useReducer(reducer, defaultState);

  return [playbackState, dispatch];
}

export default usePlaybackState;
