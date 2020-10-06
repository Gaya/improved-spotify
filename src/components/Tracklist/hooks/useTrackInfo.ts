import createInfoHook from '../../../database/createInfoHook';
import { queryTrackInfo } from '../../../database/queries';

const useTrackInfo = createInfoHook(queryTrackInfo);

export default useTrackInfo;
