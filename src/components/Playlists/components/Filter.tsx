import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import classNames from 'classnames';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { playlistSearchFilter } from '../../../state/atoms';

const useStyles = makeStyles((theme) => ({
  input: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    transition: 'background-color 0.2s ease',
    borderRadius: 4,
  },
  inputFocused: {
    backgroundColor: theme.palette.divider,
  },
}));

const Filter: React.FC = () => {
  const [value, onChange] = useRecoilState(playlistSearchFilter);

  const theme = useTheme();
  const styles = useStyles(theme);

  const [hasFocus, setFocus] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <Input
      disableUnderline
      className={classNames(styles.input, { [styles.inputFocused]: hasFocus })}
      onFocus={(): void => setFocus(true)}
      onBlur={(): void => setFocus(false)}
      placeholder="Filter"
      value={value}
      onChange={handleChange}
      startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
    />
  );
};

export default Filter;
