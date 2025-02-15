import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider, createTheme } from '@aws-amplify/ui-react';

const theme = createTheme({
  name: 'portfolio-theme',
  tokens: {
    colors: {
      background: {
        primary: {
          value: '#0A192F'
        },
        secondary: {
          value: '#112240'
        }
      },
      font: {
        interactive: {
          value: '#64FFDA'
        }
      },
      border: {
        primary: {
          value: '#1E2D3D'
        }
      }
    },
    components: {
      button: {
        primary: {
          backgroundColor: '#64FFDA',
          color: '#0A192F',
          _hover: {
            backgroundColor: '#9FFFEB'
          }
        }
      },
      textfield: {
        borderColor: '#1E2D3D',
        _focus: {
          borderColor: '#64FFDA'
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
