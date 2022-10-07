import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useEffect, useId } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { authUser, authInitializeTracker } from './state/auth';
import { auth } from './utils/firebase';
import { NotificationsProvider } from '@mantine/notifications';
import AnimatedRoutes from './components/AnimatedRoutes';
import { MantineProvider } from '@mantine/styles';
import api from './api';
import { authCompany } from './state/company';
import { UserRoles } from './interfaces';

function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        // Theme is deeply merged with default theme
        colorScheme: 'light',

        shadows: {
          // other shadows (xs, sm, lg) will be merged from default theme
          md: '1px 1px 3px rgba(0,0,0,.25)',
          xl: '5px 5px 3px rgba(0,0,0,.25)',
        },

        headings: {
          fontFamily: 'Roboto, sans-serif',
          sizes: {
            h1: { fontSize: 30 },
          },
        },
      }}>
      <NotificationsProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
