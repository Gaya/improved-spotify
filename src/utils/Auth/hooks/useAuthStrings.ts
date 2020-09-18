import { useEffect, useReducer } from 'react';

import { createAuthStrings } from '../utils';

import { Loadable } from '../../../types';

interface LoadableAuthString extends Loadable {
  codeChallenge: string;
  state: string;
}

const useAuthStrings = (): Omit<LoadableAuthString, 'isResolving'> => {
  const [authStringState, dispatch] = useReducer(
    (
      state: LoadableAuthString,
      newState: Partial<LoadableAuthString>,
    ) => ({ ...state, ...newState }),
    {
      codeChallenge: '',
      state: '',
      isLoading: true,
      isResolving: false,
    },
  );

  const {
    codeChallenge,
    state,
    isLoading,
    isResolving,
  } = authStringState;

  useEffect(() => {
    if (isLoading && !isResolving) {
      dispatch({
        isResolving: true,
      });

      createAuthStrings()
        .then((result) => {
          dispatch({
            codeChallenge: result.codeChallenge,
            state: result.state,
            isLoading: false,
            isResolving: false,
          });
        });
    }
  }, [isResolving, isLoading, authStringState]);

  return {
    codeChallenge,
    state,
    isLoading,
  };
};

export default useAuthStrings;
