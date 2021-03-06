<script lang="ts">
  import TicTacToe, { DEFAULT_COLS, DEFAULT_PLAYERS, DEFAULT_ROWS, TIE, WIN } from './ttt';
  import randomColor from 'randomcolor';

  type Player = {
    name: string,
    color: string
  };

  const SYMBOLS = ['X', 'O', '$', '%', '&', '?', '+', 'C', 'B'];

  let rows = DEFAULT_ROWS;
  let columns = DEFAULT_COLS;
  let playerCount = DEFAULT_PLAYERS;
  
  let game = new TicTacToe(rows, columns, playerCount);

  let players: Player[] = game.players.map((name, i) => ({
    name,
    color: randomColor()
  }));

  $: if (
    rows !== game.rows ||
    columns !== game.columns ||
    playerCount !== game.players.length
  ) {
    console.log('resetting game');
    try {
      game = game.reset(rows, columns, playerCount);
    } catch (error) {
      rows = game.rows;
      columns = game.columns;
      playerCount = game.players.length;

      alert(`${error} Reverting to previous settings.`);
    }
  }

  $: if (players.length !== game.players.length) {
    players = game.players.map((name, i) => players[i]
      ? players[i]
      : {
          name,
          color: randomColor()
        }
    );
  }


  $: board = game.board;
  $: activePlayer = players[game.activePlayer].name;

  function resetGame() {
    game = game.reset(rows, columns, playerCount);
  }

  function markCell(row: number, col: number) {
    let status: string | null = null;

    status = game.markCell(row, col);

    game = game;

    if (!status) return;

    setTimeout(() => {
      if (status === TIE) {
        alert("Board Filled. It's a Tie.");
      } else if (status === WIN) {
        alert(`${players[game.activePlayer].name} wins!`);
      }
      game = game.reset();
    }, 0);
  }


</script>

<div class="App">
  <div class="settings">
    <label>
      Rows:
      <input
        type="number"
        name="rows"
        bind:value={rows}
      >
    </label>
    <label>
      Columns:
      <input
        type="number"
        name="columns"
        bind:value={columns}
      >
    </label>
    <label>
      Players:
      <input
        type="number"
        name="players"
        bind:value={playerCount}
      >
    </label>
    <div class="player-settings">
      {#each players as player}
        <div class="player">
          <label>
            Name:
            <input type="text" bind:value={player.name} />
          </label>
          <label>
            Name:
            <input type="color" bind:value={player.color} />
          </label>
        </div>
      {/each}
    </div>
    <button on:click={resetGame}>Reset</button>
  </div>
  Active Player: {activePlayer}
  <div class="board">
    {#each board as row, iRow}
      <div class="row">
        {#each row as cell, iCol}
          <button
            class="cell"
            style="--cell-color: {cell !== null ? players[cell].color : 'white'}"
            on:click={() => {
              markCell(iRow, iCol);
            }}
          >
            {cell === null ? '' : SYMBOLS[cell] || cell}
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .board {
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 600px;
  }

  .row {
    flex: 1;
    display: flex;
  }

  .cell {
    flex: 1;
    min-height: 10px;
    min-width: 10px;
    background-color: var(--cell-color);
  }
</style>