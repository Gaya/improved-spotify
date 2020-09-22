import React, {
  useCallback,
  useContext,
  useState,
} from 'react';
import styled from 'styled-components';
import { useRecoilValueLoadable } from 'recoil';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';

import { useHistory } from 'react-router-dom';
import Avatar from './Avatar';

import { userInformationQuery } from '../../state/atoms';
import AuthContext from '../../utils/Auth/context';

const IconButtonNoPadding = styled(IconButton)`
  padding: 0;
`;

const UserMenu: React.FC = () => {
  const { logOut } = useContext(AuthContext);
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useRecoilValueLoadable(userInformationQuery);

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
      <IconButtonNoPadding aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
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
