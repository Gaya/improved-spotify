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
  // use this cache to prevent using slower .find
  const addedArtists: { [key: string]: boolean } = {};

  const artists = tracks.reduce((acc: SpotifyArtist[], playlistTrack) => {
    const newArtists = playlistTrack.track.album.artists
      .filter((artist) => !addedArtists[artist.id]);

    newArtists.forEach((artist) => {
      addedArtists[artist.id] = true;
    });

    return [...acc, ...newArtists];
  }, []);

  return [...artists].sort(sortByName);
}

export default useArtistsFromTracks;
