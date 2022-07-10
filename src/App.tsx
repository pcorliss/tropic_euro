import React from 'react';
import { client } from "./ApolloClient/client";
import { ApolloProvider } from '@apollo/client';
import PlayerNamesPage from './PlayerNamesPage';
import './App.css';


function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <header>Tropic Euro</header>
        <PlayerNamesPage />
      </div>
    </ApolloProvider>
  );
}

export default App;
