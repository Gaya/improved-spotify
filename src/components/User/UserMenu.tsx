import {
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import styled from 'styled-components';
import { useRecoilValueLoadable } from 'recoil';
import { useHistory } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';

import Avatar from './Avatar';

import { userInformationQuery } from '../../state/selectors';
import AuthContext from '../Auth/context';

const IconButtonNoPadding = styled(IconButton)`
  padding: 0;
`;

const UserMenu: FC = () => {
  const { logOut } = useContext(AuthContext);
  const history = useHistory();
  const user = useRecoilValueLoadable(userInformationQuery);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const onLogout = useCallback((): void => {
    history.push('/');
    logOut();
  }, [history, logOut]);

  return (
    <>
      <IconButtonNoPadding aria-controls="user-menu" aria-haspopup="true" onClick={handleClick}>
        <Avatar user={user.state === 'hasValue' ? user.contents : undefined} />
      </IconButtonNoPadding>
      {user.state === 'hasValue' && (
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          variant="menu"
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <ListItem>
            Logged in as
            {' '}
            {user.contents.display_name}
          </ListItem>
          <MenuItem onClick={onLogout}>
            Log Out
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default UserMenu;
