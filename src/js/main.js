import {dispatch} from 'functional';
import Snake from 'snake';
import ui from 'ui';

const snake = Snake({width: ui.screen.width/10, height: ui.screen.height/10}, 20);

ui.on(
	'direction-changed',
	dispatch(
		(direction) => {
			if (direction === 'north' && snake.direction === 'south'
					|| direction === 'south' && snake.direction === 'north') {
				return true;
			}
		},
		(direction) => {
			if (direction === 'east' && snake.direction === 'west'
					|| direction === 'west' && snake.direction === 'east') {
				return true;
			}
		},
		(direction) => snake.direction = direction
	)
);

function draw_snake() {
	const screen = ui.screen;
	const box = {x: 0, y:0, width: 1, height: 1};
	screen.push();
	screen.scale(10);
	for (let segment of snake) {
		screen.push();
		screen.translate(segment);
		screen.drawRect(box);
		screen.pop();
	}
	screen.pop();
}

snake.reset();

function run(ts = 0) {
	window.requestAnimationFrame(run);
	ui.screen.clear();
	draw_snake();
	snake.step(ts);
	if (snake.collides()) {
		snake.reset();
	}
}

window.requestAnimationFrame(run);
