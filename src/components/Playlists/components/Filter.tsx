import React from 'react';
import { useRecoilState } from 'recoil';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { playlistSearchFilter } from '../../../state/atoms';

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: theme.palette.divider,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const Filter: React.FC = () => {
  const [value, onChange] = useRecoilState(playlistSearchFilter);

  const theme = useTheme();
  const styles = useStyles(theme);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <Input
      className={styles.input}
      placeholder="Filter"
      value={value}
      onChange={handleChange}
      startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
    />
  );
};

export default Filter;
