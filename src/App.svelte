<script lang="ts">
  import TicTacToe, { DEFAULT_COLS, DEFAULT_PLAYERS, DEFAULT_ROWS, TIE, WIN } from './ttt';
  import randomColor from 'randomcolor';
  import { fade, fly } from 'svelte/transition';

  type Player = {
    name: string
    color: string
    bgColor: string
  };

  const SYMBOLS = ['X', 'O', '$', '%', '&', '?', '+', 'C', 'B'];

  let rows = DEFAULT_ROWS;
  let columns = DEFAULT_COLS;
  let playerCount = DEFAULT_PLAYERS;
  let showSettings = false;
  
  let game = new TicTacToe(rows, columns, playerCount);

  const generatePlayer = (name: string): Player => ({
    name,
    color: randomColor({
      luminosity: 'dark'
    }),
    bgColor: randomColor({
      luminosity: 'bright'
    })
  })

  let players: Player[] = game.players.map(name => generatePlayer(name));

  $: if (
    rows !== game.rows ||
    columns !== game.columns ||
    playerCount !== game.players.length
  ) {
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
      : generatePlayer(name)
    );
  }


  $: board = game.board;
  $: activePlayer = players[game.activePlayer].name;

  function resetGame() {
    game = game.reset(rows, columns, playerCount);
  }

  function markCell(row: number, col: number) {
    let status: string | null = null;

    try {
      status = game.markCell(row, col);
    } catch (error) {
      alert(error);
    }

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
  <h1>Welcome to Tic-Tac-Toe!</h1>
  <label>
    Show settings
    <input type="checkbox" bind:checked={showSettings} />
  </label>
  {#if showSettings}
    <div
      class="settings"
      transition:fade={{ duration: 200 }}
    >
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
              Color:
              <input type="color" bind:value={player.color} />
            </label>
            <label>
              Background:
              <input type="color" bind:value={player.bgColor} />
            </label>
          </div>
        {/each}
      </div>
      <button on:click={resetGame}>Reset</button>
    </div>
  {/if}
  <h2 class="active-player">
    It's {activePlayer}'s turn!
  </h2>
  <div class="board">
    {#each board as row, iRow}
      <div class="row">
        {#each row as cell, iCol}
          <button
            class="cell"
            style="--cell-color: {
              cell !== null ? players[cell].color : 'black'
            }; --background-color: {
              cell !== null ? players[cell].bgColor : 'white'
            }"
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
  .App {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .settings {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .settings > label {
    margin-top: 0.5em;
  }
  .settings > label > input {
    width: 40px;
  }
  .player-settings {
    margin: 1em;
  }
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
  .row:first-child .cell {
    border-top: none;
  }
  .row:last-child .cell {
    border-bottom: none;
  }

  .cell {
    flex: 1;
    min-height: 10px;
    min-width: 10px;
    font-size: 3em;
    color: var(--cell-color);
    background-color: var(--background-color);
    box-shadow: none;

    border-top: solid 2px black;
    border-bottom: solid 2px black;
    border-left: solid 2px black;
    border-right: solid 2px black;
  }
  .cell:first-child {
    border-left: none;
  }
  .cell:last-child {
    border-right: none;
  }
</style>