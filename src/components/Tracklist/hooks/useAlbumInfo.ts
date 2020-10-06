import createInfoHook from '../../../database/createInfoHook';
import { queryAlbumInfo } from '../../../database/queries';

const useAlbumInfo = createInfoHook(queryAlbumInfo);

export default useAlbumInfo;
