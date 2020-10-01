import {
  SpotifyDataExport,
  SpotifyPlaylistTrack,
} from '../types';

function extractTrackData(
  playlistId: string,
  tracks: SpotifyPlaylistTrack[],
): SpotifyDataExport {
  const extractedData = tracks.reduce((acc: Omit<SpotifyDataExport, 'playlistTracks'>, { track }) => ({
    tracks: {
      ...acc.tracks,
      [track.id]: {
        ...track,
        album: track.album.id,
        artists: track.artists.map((artist) => artist.id),
      },
    },
    artists: track.artists.reduce((accArtists, artist) => ({
      ...accArtists,
      [artist.id]: artist,
    }), acc.artists),
    albums: {
      ...acc.albums,
      [track.album.id]: {
        ...track.album,
        artists: track.artists.map((artist) => artist.id),
      },
    },
  }), { tracks: {}, artists: {}, albums: {} });

  return {
    ...extractedData,
    playlistTracks: tracks.map((track) => ({
      ...track,
      playlistId,
      track: track.track.id,
      id: `${playlistId}:${track.track.id}`,
    })),
  };
}

export default extractTrackData;
