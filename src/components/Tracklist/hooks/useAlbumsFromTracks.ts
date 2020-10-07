import {
  useContext, useEffect, useMemo, useState,
} from 'react';

import {
  LoadableValue, SpotifyAlbum, StoredSpotifyAlbum, StoredSpotifyPlaylistTrack,
} from '../../../types';
import DatabaseContext from '../../../database/context';
import { queryTrackInfo, queryAlbumInfo, queryArtistInfo } from '../../../database/queries';

function sortByArtistsAndAlbum(a: SpotifyAlbum, b: SpotifyAlbum): number {
  const aArtists = a.artists.map((artist) => artist.name).join('');
  const bArtists = b.artists.map((artist) => artist.name).join('');

  if (aArtists > bArtists) {
    return 1;
  }

  if (aArtists < bArtists) {
    return -1;
  }

  if (a.name > b.name) {
    return 1;
  }

  if (a.name < b.name) {
    return -1;
  }

  return 0;
}

function useAlbumsFromTracks(
  tracks: StoredSpotifyPlaylistTrack[],
): LoadableValue<SpotifyAlbum[]> {
  const db = useContext(DatabaseContext);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>();

  const sortedAlbums = useMemo(() => {
    if (albums) {
      return [...albums].sort(sortByArtistsAndAlbum);
    }

    return [];
  }, [albums]);

  useEffect(() => {
    if (db) {
      Promise.all(tracks.map((track) => queryTrackInfo(db, track.track)))
        .then((results) => results
          .reduce(
            (
              acc: string[],
              track,
            ) => (track && acc.indexOf(track.album) === -1 ? [...acc, track.album] : acc), [],
          ))
        .then((albumIds) => Promise.all(albumIds.map((album) => queryAlbumInfo(db, album))))
        .then((results) => results
          .reduce((acc: StoredSpotifyAlbum[], album) => (album ? [...acc, album] : acc), []))
        .then((results) => Promise
          .all(results.map((album) => Promise
            .all(album.artists.map((artist) => queryArtistInfo(db, artist)))
            .then((artists): SpotifyAlbum => artists
              .reduce((acc: SpotifyAlbum, artist) => (artist
                ? { ...acc, artists: [...acc.artists, artist] }
                : acc
              ), { ...album, artists: [] })))))
        .then((results) => setAlbums(results));
    }
  }, [db, tracks]);

  if (albums) {
    return {
      state: 'hasValue',
      contents: sortedAlbums,
    };
  }

  return {
    state: 'loading',
  };
}

export default useAlbumsFromTracks;
