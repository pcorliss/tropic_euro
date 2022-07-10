import React from "react";
import { useQuery, gql } from "@apollo/client";

const PLAYER_NAMES_QUERY = gql`
  query playerNames {
    gameState(id: "aaa") {
      players {
        name
      }
    }
  }
`;

function PlayerNamesPage() {
  const { data, loading, error } = useQuery(PLAYER_NAMES_QUERY);

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>{error.name} - {error.message}</div>;
  }

  return data.gameState.players.map((p: any) => (
    <div key={p.name}>
      <p>
        {p.name}
      </p>
    </div>
  ));
}

export default PlayerNamesPage;