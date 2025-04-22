# Todos

## Game mechanics

- [ ] Generate node graph topology procedurally
  - Bonus points: generate the graph based on a mask, e.g., the map of Europe
- [ ] Game loop
  - Implement tick interval
  - Implement the feature where the user has a certain number of actions they can take during a tick
    - Each node might have a limit of actions that can be taken during a tick, along with the total number of actions the player can take
  - Will something happen passively? (like population change in territorial.io)
- [ ] Define all actions the user can take. Implement stubs for these methods somewhere.
  - Attack
  - Invest or upgrade
  - Move units
  - ...
- [ ] Fog of war: should only part of the map be shown? Reference: https://youtu.be/CpjHhgj_8zc

## UI

- [ ] Create a Phaser.GameObjects.Container class that contains other UI classes (sidebar, indicators, keymaps, score, etc.) https://docs.phaser.io/api-documentation/class/gameobjects-container
  - Bonus points: consider implementing in a way that we can resize the game canvas in the future
- [ ] Main Menu / Lobby scene
- [ ] Settings scene (store in e.g., localstorage for the time being)
  - Username
  - User color selection
- [x] Basic tooltip when hovering over a `Node`.
- [ ] Actions menu when clicking on a Node.
- [ ] Events & notifications (like 'toaster')

## Other

- [ ] Create a centralized input handler that we can use in all scenes.
- [ ] Turn nodes into a Node class that will hold its state, actions and its own update method.
  - Will hold node's state, actions, its own create & update method
  - The state & action information can be used to populate UI elements the user can interact with (e.g., to perform actions)
- [ ] Animate actions on the graph
  - Troop movement
  - Node upgrade increases the node size slightly?
- [ ] Node and Edge relationship
  - Idea 1: `Graph` class has a member `nodes: Node[]` member and `edges: Edge[]` member. `Edge` would have members `source: Node` and `target: Node`.
  - Idea 2: `Graph` class has a member `nodes: Node[]`, and `Node` class has a member `edges: Edge[]`.
  - Consider tradeoffs of different approaches to the `Node` <-> `Edge` relationship.
- [ ] Indicators to mark Nodes under attack
