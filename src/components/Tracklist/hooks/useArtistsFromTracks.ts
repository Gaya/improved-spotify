import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  LoadableValue,
  SpotifyArtist,
  StoredSpotifyPlaylistTrack,
} from '../../../types';
import DatabaseContext from '../../../database/context';
import { queryTrackInfo, queryArtistInfo } from '../../../database/queries';

function sortByName(a: SpotifyArtist, b: SpotifyArtist): number {
  if (a.name > b.name) {
    return 1;
  }

  if (a.name < b.name) {
    return -1;
  }

  return 0;
}

function useArtistsFromTracks(
  tracks: StoredSpotifyPlaylistTrack[],
): LoadableValue<SpotifyArtist[]> {
  const db = useContext(DatabaseContext);
  const [artists, setArtists] = useState<SpotifyArtist[]>();

  const sortedArtists = useMemo(() => {
    if (artists) {
      return [...artists].sort(sortByName);
    }

    return [];
  }, [artists]);

  useEffect(() => {
    if (db && tracks.length > 0) {
      Promise.all(tracks.map((track) => queryTrackInfo(db, track.track)))
        .then((results) => results
          .reduce(
            (
              acc: string[],
              track,
            ) => (track ? [...acc, ...track.artists] : acc), [],
          ).reduce((
            acc: string[],
            artistId,
          ) => (acc.indexOf(artistId) === -1 ? [...acc, artistId] : acc), []))
        .then((artistIds) => Promise.all(artistIds.map((artist) => queryArtistInfo(db, artist))))
        .then((results) => setArtists(results
          .reduce((acc: SpotifyArtist[], artist) => (artist ? [...acc, artist] : acc), [])));
    }
  }, [db, tracks]);

  if (sortedArtists) {
    return {
      state: 'hasValue',
      contents: sortedArtists,
    };
  }

  return {
    state: 'loading',
  };
}

export default useArtistsFromTracks;
