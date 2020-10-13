import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

import { StoredSpotifyPlaylistTrack } from '../../../types';

import Container from '../../Container/Container';

import AlbumListItem from './AlbumListItem';
import useAlbumsFromTracks from '../hooks/useAlbumsFromTracks';

const useStyles = makeStyles((theme) => ({
  listContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  albumGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 260px)',
    justifyContent: 'space-around',
    columnGap: 24,
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'space-between',
    },
  },
}));

interface AlbumTrackListProps {
  tracks: StoredSpotifyPlaylistTrack[];
  selectedArtist?: string;
}

interface Dimensions {
  height: number;
  width: number;
}

const AlbumList: React.FC<AlbumTrackListProps> = ({ tracks, selectedArtist }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ height: 0, width: 0 });

  useEffect(() => {
    function handleWindowResize(): void {
      if (containerRef.current) {
        // reset in order to calc dimensions
        setDimensions({ height: 0, width: 0 });

        // get current available space
        const boundingBox = containerRef.current.getBoundingClientRect();

        // set new dimensions
        setDimensions({ height: boundingBox.height, width: boundingBox.width });
      }
    }

    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();

    return (): void => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const albums = useAlbumsFromTracks(tracks, selectedArtist);

  const columnMinWidth = 260 + theme.spacing(2);
  const rowHeight = 360;
  const columnCount = Math.floor(dimensions.width / columnMinWidth);
  const columnWidth = columnCount ? dimensions.width / columnCount : 0;
  const rowCount = columnCount ? Math.ceil(albums.length / columnCount) : 0;

  return (
    <Container className={styles.listContainer}>
      <div className={styles.listContainer} ref={containerRef}>
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={dimensions.width}
        >
          {({ columnIndex, rowIndex, style }): React.ReactElement | null => {
            const index = (rowIndex * columnCount) + columnIndex;
            if (albums[index]) {
              return (
                <AlbumListItem
                  key={albums[index].id}
                  album={albums[index]}
                  style={style}
                />
              );
            }

            return null;
          }}
        </Grid>
        {/* <div className={styles.albumGrid}> */}
        {/*  {albums.map((album) => <AlbumListItem key={album.id} album={album} />)} */}
        {/* </div> */}
      </div>
    </Container>
  );
};

export default AlbumList;
