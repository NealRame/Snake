# Snake

http://snake.nealrame.com

## Setup

```bash
> git clone https://github.com/NealRame/Snake.git
> cd Snake
> npm install
> gulp
```

Then configure your HTTP server with `Snake/public` as root directory.

## Configure

You can customize the snake game by editing the file `src/js/config.js`.

```js
{
	game: {
		borders: true, // true to collides on borders
		scale: 1/10    // determine grid size
	},
	food: {
		points: {      // How Many Points the snake earns when eating foo according the level
			easy: 5,
			normal: 10,
			hard: 20
		}
	},
	snake: {
		grow: 1,       // How many cells the snake grows when it eats food
		speed: {       // Snake speed according the level
			easy: 10,
			normal: 20,
			hard: 30
		}
	},
	screen: {          // screen size
		height: 500,
		width: 500
	}
}
```
