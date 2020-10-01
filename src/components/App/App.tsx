import React, { useMemo } from 'react';
import { RecoilRoot } from 'recoil';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';

import Routes from './Routes';

import { AuthProvider } from '../Auth/context';
import { DatabaseProvider } from '../../database/context';

import './App.css';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () => createMuiTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
        primary: green,
        secondary: pink,
        background: {
          default: '#1d1e20',
          paper: '#2b2c2f',
        },
      },
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
    }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RecoilRoot>
          <DatabaseProvider>
            <div className="App">
              <Routes />
            </div>
          </DatabaseProvider>
        </RecoilRoot>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
