import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DelegateDataProvider } from 'contexts/DelegateData';
import { Web3ReactProvider } from '@web3-react/core'
import getLibrary from 'utils/getLibrary'


const Providers: React.FC = ({ children }) => {
  return (
    <DelegateDataProvider>
      {children}
    </DelegateDataProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Providers>
        <App />
      </Providers>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
