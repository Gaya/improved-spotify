/* eslint-disable @typescript-eslint/camelcase */

import tracksData from './extractTrackData.test.mocks';
import extractTrackData from './extractTrackData';

describe('extractTrackData', () => {
  it('should change tracks to reference ids', () => {
    const playlistTracks = extractTrackData('1234', tracksData);

    const expectedTracks = tracksData.map((track, index) => ({
      ...track,
      index,
      id: `1234:${track.track.id}`,
      playlistId: '1234',
    }));

    expect(playlistTracks).toEqual(expectedTracks);
  });

  it('should add offset to indexes', () => {
    const playlistTracks = extractTrackData('1234', tracksData, 100);

    const expectedTracks = tracksData.map((track, index) => ({
      ...track,
      index: index + 100,
      id: `1234:${track.track.id}`,
      playlistId: '1234',
    }));

    expect(playlistTracks).toEqual(expectedTracks);
  });
});
