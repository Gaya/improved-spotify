import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { PlaylistView } from '../../../types';

interface ViewPickerProps {
  viewAs: PlaylistView;
  onSelectView: (view: PlaylistView) => void;
}

const ViewPicker: React.FC<ViewPickerProps> = ({ viewAs, onSelectView }) => (
  <ButtonGroup size="small">
    <Button
      variant={viewAs === PlaylistView.ALBUM ? 'contained' : 'outlined'}
      onClick={(): void => onSelectView(PlaylistView.ALBUM)}
    >
      Albums
    </Button>
    <Button
      variant={viewAs === PlaylistView.ARTIST ? 'contained' : 'outlined'}
      onClick={(): void => onSelectView(PlaylistView.ARTIST)}
    >
      Artists
    </Button>
    <Button
      variant={viewAs === PlaylistView.PLAYLIST ? 'contained' : 'outlined'}
      onClick={(): void => onSelectView(PlaylistView.PLAYLIST)}
    >
      Playlist
    </Button>
  </ButtonGroup>
);

export default ViewPicker;
