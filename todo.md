# Todos

## Game mechanics

- [ ] Generate node graph topology procedurally
  - Bonus points: generate the graph based on a mask, e.g., the map of Europe
- [ ] Fog of war: should only part of the map be shown? Reference: https://youtu.be/CpjHhgj_8zc

## UI

- [ ] Create a Phaser.GameObjects.Container class that contains other UI classes (sidebar, indicators, keymaps, score, etc.) https://docs.phaser.io/api-documentation/class/gameobjects-container
  - Bonus points: consider implementing in a way that we can resize the game canvas in the future
- [ ] Main Menu / Lobby scene
- [ ] Settings scene (store in e.g., localstorage for the time being)
  - Username
  - User color selection
- [ ] Actions menu when clicking on a Node.
- [ ] Events & notifications (like 'toaster')

## Other

- [ ] Animate actions on the graph
  - Troop movement
  - Node upgrade increases the node size slightly?
- [ ] Node and Edge relationship
  - Idea 1: `Graph` class has a member `nodes: Node[]` member and `edges: Edge[]` member. `Edge` would have members `source: Node` and `target: Node`.
  - Idea 2: `Graph` class has a member `nodes: Node[]`, and `Node` class has a member `edges: Edge[]`.
  - Consider tradeoffs of different approaches to the `Node` <-> `Edge` relationship.
- [ ] Indicators to mark Nodes under attack
