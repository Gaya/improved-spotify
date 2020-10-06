import createInfoHook from '../../../database/createInfoHook';
import { queryArtistInfo } from '../../../database/queries';

const useArtistInfo = createInfoHook(queryArtistInfo);

export default useArtistInfo;
