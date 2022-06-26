# Tropic Euro - Like Puerto Rico But Different

This is an attempt to model the game of Puerto Rico in code.

## Next Steps

* Build a front-end to present players with the ability to choose roles, actions, and play a game.
* Introduce support for expansion buildings and mechanics.

## Development

Built and developed with Node 16.4.2

```
npm install
npm test
npm run watch-test
```

## Next Steps

* Think about audit log - Each action emits a log explaining what happened
* Work on a react based frontend to display gamestate and take selections
* Maybe something with websockets so we're not constantly polling? What would that look like