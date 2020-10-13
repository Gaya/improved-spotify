import {
  SpotifyArtist,
  StoredSpotifyPlaylistTrack,
} from '../../../types';

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
): SpotifyArtist[] {
  const artists = tracks.reduce((acc: SpotifyArtist[], playlistTrack) => {
    const newArtists = playlistTrack.track.artists
      .filter((artist) => !acc.find((accArtist) => accArtist.id === artist.id));

    return [...acc, ...newArtists];
  }, []);

  return [...artists].sort(sortByName);
}

export default useArtistsFromTracks;
