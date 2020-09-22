import { selector } from 'recoil';

import { SPOTIFY_ME_URI } from '../consts';

import { get } from '../utils/authRequest';
import { SpotifyUser } from '../types';

export const userInformationQuery = selector({
  key: 'UserInformation',
  get(): Promise<SpotifyUser> {
    return get(SPOTIFY_ME_URI)
      .then((response) => response.json());
  },
});
