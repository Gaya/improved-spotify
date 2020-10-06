import { SrIndexedDB } from './createDatabase';

import {
  PlaylistSnapshots,
  SpotifyArtist,
  SpotifyDataExport,
  StoredSpotifyAlbum,
  StoredSpotifyPlaylistTrack,
  StoredSpotifyTrack,
} from '../types';

export function getSnapshots(db: SrIndexedDB): Promise<PlaylistSnapshots> {
  const keysPromise = db.getAllKeys('snapshots');
  const valuesPromise = db.getAll('snapshots');

  return Promise.all([keysPromise, valuesPromise])
    .then(([keys, values]) => keys.reduce(
      (acc: PlaylistSnapshots, key, index) => ({ ...acc, [key]: values[index] }),
      {},
    ));
}

export function saveSnapshots(db: SrIndexedDB, snapshots: PlaylistSnapshots): Promise<void> {
  return db
    .clear('snapshots')
    .then(() => Promise.all(Object.entries(snapshots).map(
      ([key, value]) => db.put('snapshots', value, key),
    )))
    .then(() => undefined);
}

export function removePlaylistTracksByPlaylist(
  db: SrIndexedDB,
  playlistId: string,
): Promise<void> {
  return queryPlaylistTrackKeys(db, playlistId)
    .then((keys) => Promise.all(keys.map((key: string) => db.delete('playlistTracks', key))))
    .then(() => undefined);
}

export function storeDataExport(db: SrIndexedDB, data: SpotifyDataExport): Promise<void> {
  return Promise.all(data.playlistTracks.map((track) => db.put('playlistTracks', track)))
    .then(() => Promise.all(Object.entries(data.albums).map(([id, album]) => db.put('albums', album))))
    .then(() => Promise.all(Object.entries(data.artists).map(([id, artist]) => db.put('artists', artist))))
    .then(() => Promise.all(Object.entries(data.tracks).map(([id, track]) => db.put('tracks', track))))
    .then(() => undefined);
}

export function queryPlaylistTrackKeys(
  db: SrIndexedDB,
  playlistId: string,
): Promise<string[]> {
  return db.getAllKeysFromIndex('playlistTracks', 'by-playlist', playlistId);
}

export function queryPlaylistTracks(
  db: SrIndexedDB,
  playlistId: string,
): Promise<StoredSpotifyPlaylistTrack[]> {
  return db.getAllFromIndex('playlistTracks', 'by-playlist', playlistId);
}

export function queryTrackInfo(
  db: SrIndexedDB,
  trackId: string,
): Promise<StoredSpotifyTrack | undefined> {
  return db.get('tracks', trackId);
}

export function queryArtistInfo(
  db: SrIndexedDB,
  artistId: string,
): Promise<SpotifyArtist | undefined> {
  return db.get('artists', artistId);
}

export function queryAlbumInfo(
  db: SrIndexedDB,
  albumId: string,
): Promise<StoredSpotifyAlbum | undefined> {
  return db.get('albums', albumId);
}
