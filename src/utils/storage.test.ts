/* eslint-disable @typescript-eslint/camelcase */

import tracksData from './storage.test.mocks';
import { extractTrackData } from './storage';

describe('extractTrackData', () => {
  it('should change tracks to reference ids', () => {
    const { tracks } = extractTrackData(tracksData);

    const expectedTracks = [
      {
        added_at: '2016-07-22T22:49:09Z',
        added_by: {
          external_urls: {
            spotify: 'https://open.spotify.com/user/gaya.kessler',
          },
          href: 'https://api.spotify.com/v1/users/gaya.kessler',
          id: 'gaya.kessler',
          type: 'user',
          uri: 'spotify:user:gaya.kessler',
        },
        is_local: false,
        primary_color: null,
        track: '1VyO9SeIAsiYAqQfcsx9qt',
        video_thumbnail: {
          url: null,
        },
      },
      {
        added_at: '2019-05-05T09:04:44Z',
        added_by: {
          external_urls: {
            spotify: 'https://open.spotify.com/user/gaya.kessler',
          },
          href: 'https://api.spotify.com/v1/users/gaya.kessler',
          id: 'gaya.kessler',
          type: 'user',
          uri: 'spotify:user:gaya.kessler',
        },
        is_local: false,
        primary_color: null,
        track: '5m6v49tXuyUhlaJWa00tyF',
        video_thumbnail: {
          url: null,
        },
      },
      {
        added_at: '2016-07-22T22:49:09Z',
        added_by: {
          external_urls: {
            spotify: 'https://open.spotify.com/user/gaya.kessler',
          },
          href: 'https://api.spotify.com/v1/users/gaya.kessler',
          id: 'gaya.kessler',
          type: 'user',
          uri: 'spotify:user:gaya.kessler',
        },
        is_local: false,
        primary_color: null,
        track: '1vLByYhUN1Nppnwp0KvAbB',
        video_thumbnail: {
          url: null,
        },
      },
    ];

    expect(tracks).toEqual(expectedTracks);
  });

  it('should extract track info into structured object', () => {
    const { trackInfo } = extractTrackData(tracksData);

    const expectedTrackInfo = {
      '1VyO9SeIAsiYAqQfcsx9qt': {
        album: '1Wk98w43t7axsezT1GAgR6',
        artists: ['69a2GzMCkrrTrN9iVmP8Ys'],
        available_markets: [],
        disc_number: 1,
        duration_ms: 89867,
        episode: false,
        explicit: false,
        external_ids: {
          isrc: 'DED831600046',
        },
        external_urls: {
          spotify: 'https://open.spotify.com/track/1VyO9SeIAsiYAqQfcsx9qt',
        },
        href: 'https://api.spotify.com/v1/tracks/1VyO9SeIAsiYAqQfcsx9qt',
        id: '1VyO9SeIAsiYAqQfcsx9qt',
        is_local: false,
        name: 'You Will Never Be One Of Us',
        popularity: 0,
        preview_url: null,
        track: true,
        track_number: 1,
        type: 'track',
        uri: 'spotify:track:1VyO9SeIAsiYAqQfcsx9qt',
      },
      '5m6v49tXuyUhlaJWa00tyF': {
        album: '4xTVgnVf3TVixEp7PgrkjV',
        artists: ['3pDqLo5LnCyCBxhKZygkfK'],
        available_markets: [],
        disc_number: 1,
        duration_ms: 511413,
        episode: false,
        explicit: false,
        external_ids: {
          isrc: 'SEYOK1713523',
        },
        external_urls: {
          spotify: 'https://open.spotify.com/track/5m6v49tXuyUhlaJWa00tyF',
        },
        href: 'https://api.spotify.com/v1/tracks/5m6v49tXuyUhlaJWa00tyF',
        id: '5m6v49tXuyUhlaJWa00tyF',
        is_local: false,
        name: 'Wake',
        popularity: 19,
        preview_url: 'https://p.scdn.co/mp3-preview/e166c7fab3dc6b6478aabb84d20cf69b3581c1fb?cid=1d1f111028c246ef93a8aaf4488342dd',
        track: true,
        track_number: 2,
        type: 'track',
        uri: 'spotify:track:5m6v49tXuyUhlaJWa00tyF',
      },
      '1vLByYhUN1Nppnwp0KvAbB': {
        album: '1Wk98w43t7axsezT1GAgR6',
        artists: ['69a2GzMCkrrTrN9iVmP8Ys'],
        available_markets: [],
        disc_number: 1,
        duration_ms: 55478,
        episode: false,
        explicit: false,
        external_ids: {
          isrc: 'DED831600048',
        },
        external_urls: {
          spotify: 'https://open.spotify.com/track/1vLByYhUN1Nppnwp0KvAbB',
        },
        href: 'https://api.spotify.com/v1/tracks/1vLByYhUN1Nppnwp0KvAbB',
        id: '1vLByYhUN1Nppnwp0KvAbB',
        is_local: false,
        name: 'Made To Make You Fail',
        popularity: 0,
        preview_url: null,
        track: true,
        track_number: 3,
        type: 'track',
        uri: 'spotify:track:1vLByYhUN1Nppnwp0KvAbB',
      },
    };

    expect(trackInfo).toEqual(expectedTrackInfo);
  });

  it('should extract artist info into structured object', () => {
    const { artists } = extractTrackData(tracksData);

    const expectedArtists = {
      '3pDqLo5LnCyCBxhKZygkfK': {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/3pDqLo5LnCyCBxhKZygkfK',
        },
        href: 'https://api.spotify.com/v1/artists/3pDqLo5LnCyCBxhKZygkfK',
        id: '3pDqLo5LnCyCBxhKZygkfK',
        name: 'REZN',
        type: 'artist',
        uri: 'spotify:artist:3pDqLo5LnCyCBxhKZygkfK',
      },
      '69a2GzMCkrrTrN9iVmP8Ys': {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/69a2GzMCkrrTrN9iVmP8Ys',
        },
        href: 'https://api.spotify.com/v1/artists/69a2GzMCkrrTrN9iVmP8Ys',
        id: '69a2GzMCkrrTrN9iVmP8Ys',
        name: 'Nails',
        type: 'artist',
        uri: 'spotify:artist:69a2GzMCkrrTrN9iVmP8Ys',
      },
    };

    expect(artists).toEqual(expectedArtists);
  });

  it('should extract album info into structured object', () => {
    const { albums } = extractTrackData(tracksData);

    const expectedAlbums = {
      '4xTVgnVf3TVixEp7PgrkjV': {
        album_type: 'album',
        artists: ['3pDqLo5LnCyCBxhKZygkfK'],
        available_markets: [],
        external_urls: {
          spotify: 'https://open.spotify.com/album/4xTVgnVf3TVixEp7PgrkjV',
        },
        href: 'https://api.spotify.com/v1/albums/4xTVgnVf3TVixEp7PgrkjV',
        id: '4xTVgnVf3TVixEp7PgrkjV',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b27392673fbe3ddcb336cc8d0762',
            width: 640,
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e0292673fbe3ddcb336cc8d0762',
            width: 300,
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d0000485192673fbe3ddcb336cc8d0762',
            width: 64,
          },
        ],
        name: 'Let It Burn',
        release_date: '2017-02-21',
        release_date_precision: 'day',
        total_tracks: 10,
        type: 'album',
        uri: 'spotify:album:4xTVgnVf3TVixEp7PgrkjV',
      },
      '1Wk98w43t7axsezT1GAgR6': {
        album_type: 'album',
        artists: ['69a2GzMCkrrTrN9iVmP8Ys'],
        available_markets: [],
        external_urls: {
          spotify: 'https://open.spotify.com/album/1Wk98w43t7axsezT1GAgR6',
        },
        href: 'https://api.spotify.com/v1/albums/1Wk98w43t7axsezT1GAgR6',
        id: '1Wk98w43t7axsezT1GAgR6',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b273e5bab6e6ff6360d2f3272136',
            width: 640,
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e02e5bab6e6ff6360d2f3272136',
            width: 300,
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d00004851e5bab6e6ff6360d2f3272136',
            width: 64,
          },
        ],
        name: 'You Will Never Be One of Us',
        release_date: '2016-06-17',
        release_date_precision: 'day',
        total_tracks: 10,
        type: 'album',
        uri: 'spotify:album:1Wk98w43t7axsezT1GAgR6',
      },
    };

    expect(albums).toEqual(expectedAlbums);
  });
});
