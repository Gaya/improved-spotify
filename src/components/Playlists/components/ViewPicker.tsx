import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { PlaylistView } from '../../../enums';
import { playlistSelectedArtist, playlistViewAs } from '../../../state/atoms';

import { storePlaylistView } from '../utils';

const ViewPicker: React.FC = () => {
  const [viewAs, onSelectView] = useRecoilState(playlistViewAs);
  const setSelectedArtist = useSetRecoilState(playlistSelectedArtist);

  const onHandleSelect = (view: PlaylistView) => (): void => {
    setSelectedArtist(undefined);
    onSelectView(view);
    storePlaylistView(view);
  };

  return (
    <ButtonGroup size="small">
      <Button
        variant={viewAs === PlaylistView.ALBUM ? 'contained' : 'outlined'}
        onClick={onHandleSelect(PlaylistView.ALBUM)}
      >
        Albums
      </Button>
      <Button
        variant={viewAs === PlaylistView.ARTIST ? 'contained' : 'outlined'}
        onClick={onHandleSelect(PlaylistView.ARTIST)}
      >
        Artists
      </Button>
      <Button
        variant={viewAs === PlaylistView.PLAYLIST ? 'contained' : 'outlined'}
        onClick={onHandleSelect(PlaylistView.PLAYLIST)}
      >
        Playlist
      </Button>
    </ButtonGroup>
  );
};

export default ViewPicker;
