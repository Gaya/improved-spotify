import React, {
  useEffect, useReducer, useRef, useState,
} from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

import makeStyles from '@material-ui/core/styles/makeStyles';

import { SpotifyAlbum } from '../../../types';

const useStyles = makeStyles({
  listContainer: {
    display: 'flex',
    flexGrow: 1,
  },
});

interface AlbumTrackListProps {
  albums: SpotifyAlbum[];
}

interface Dimensions {
  width: number;
  height: number;
}

const AlbumList: React.FC<AlbumTrackListProps> = ({ albums }) => {
  const styles = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useReducer(
    (state: Dimensions, action: Dimensions) => action,
    { width: 0, height: 0 },
  );

  useEffect(() => {
    function handleWindowResize(): void {
      if (containerRef.current) {
        const boundingBox = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: boundingBox.width || 0,
          height: boundingBox.height || 0,
        });
      }
    }

    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();

    return (): void => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const columns = dimensions.width ? Math.floor(dimensions.width / 200) : 0;
  const rows = columns ? Math.ceil(albums.length / columns) : 0;

  return (
    <div className={styles.listContainer} ref={containerRef}>
      <Grid
        columnCount={columns}
        rowCount={rows}
        width={dimensions.width}
        height={dimensions.height}
        columnWidth={dimensions.width / columns}
        rowHeight={200}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div style={style}>
            Item
            {' '}
            {rowIndex}
            ,
            {columnIndex}
          </div>
        )}
      </Grid>
    </div>
  );
};

export default AlbumList;
