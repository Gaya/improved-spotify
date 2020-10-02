import { openDB, DBSchema, IDBPDatabase } from 'idb';

import {
  SpotifyArtist,
  StoredSpotifyAlbum,
  StoredSpotifyPlaylistTrack,
  StoredSpotifyTrack,
} from '../types';
import { error } from '../utils/logging';

const version = 1;

interface IsDb extends DBSchema {
  snapshots: {
    key: string;
    value: string;
  };
  playlistTracks: {
    key: string;
    value: StoredSpotifyPlaylistTrack;
    indexes: {
      'by-date': string;
      'by-playlist': string;
    };
  };
  artists: {
    key: string;
    value: SpotifyArtist;
    indexes: {
      'by-name': string;
    };
  };
  albums: {
    key: string;
    value: StoredSpotifyAlbum;
    indexes: {
      'by-name': string;
      'by-release-date': string;
      'by-artist': string;
    };
  };
  tracks: {
    key: string;
    value: StoredSpotifyTrack;
    indexes: {
      'by-name': string;
      'by-track-number': number;
      'by-artist': string;
      'by-album': string;
    };
  };
}

export type IndexedDBIsDb = IDBPDatabase<IsDb>;

function createDatabase(): Promise<IndexedDBIsDb> {
  return openDB<IsDb>('ISDB', version, {
    upgrade(db) {
      // SNAPSHOTS
      db.createObjectStore('snapshots');

      // PLAYLIST TRACKS
      const playlistTracks = db.createObjectStore('playlistTracks', {
        keyPath: 'id',
      });
      playlistTracks.createIndex('by-date', 'added_at');
      playlistTracks.createIndex('by-playlist', 'playlistId');

      // ARTISTS
      const artists = db.createObjectStore('artists', {
        keyPath: 'id',
      });
      artists.createIndex('by-name', 'name');

      // ALBUMS
      const albums = db.createObjectStore('albums', {
        keyPath: 'id',
      });
      albums.createIndex('by-name', 'name');
      albums.createIndex('by-release-date', 'release_date');
      albums.createIndex('by-artist', 'artists');

      // TRACKS
      const tracks = db.createObjectStore('tracks', {
        keyPath: 'id',
      });
      tracks.createIndex('by-name', 'name');
      tracks.createIndex('by-artist', 'artists');
      tracks.createIndex('by-album', 'album');
      tracks.createIndex('by-track-number', 'track_number');
    },
  }).catch((err) => {
    error(err);
    throw err;
  });
}

export default createDatabase;
