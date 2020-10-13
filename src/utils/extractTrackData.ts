import { SpotifyPlaylistTrack, StoredSpotifyPlaylistTrack } from '../types';

function extractTrackData(
  playlistId: string,
  tracks: SpotifyPlaylistTrack[],
  offset = 0,
): StoredSpotifyPlaylistTrack[] {
  return tracks.map((track, index) => ({
    ...track,
    index: index + offset,
    playlistId,
    id: `${playlistId}:${track.track.id}`,
  }));
}

export default extractTrackData;
