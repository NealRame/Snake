import {dispatch} from 'functional';
import Food from 'food';
import Snake from 'snake';
import ui from 'ui';

const snake = Snake({width: ui.screen.width/10, height: ui.screen.height/10}, 20);
const food = Food({width: ui.screen.width/10, height: ui.screen.height/10});

let pause = false;
let score = 0;
let high_score = 0;

ui
	.on('direction-changed', (direction) => snake.direction = direction)
	.on('pause', () => pause = !pause);

function draw_snake(screen, snake) {
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

function draw_food(screen, food) {
	const box = {x: 0, y: 0, width: 1, height: 1};
	screen.push();
	screen.scale(10);
	screen.translate(food.position);
	screen.drawRect(box);
	screen.pop();
}

snake.reset();
food.reset();

function run(ts = 0) {
	window.requestAnimationFrame(run);
	ui.screen.clear();
	if (snake.occupies(food.position)) {
		score += food.points;
		high_score = Math.max(score, high_score);
		ui.setScore(score);
		ui.setHighScore(high_score);
		food.reset();
		snake.grow();
	}
	draw_snake(ui.screen, snake);
	draw_food(ui.screen, food);
	if (!pause) {
		snake.step(ts);
	}
	if (snake.collides()) {
		ui.setScore(score = 0);
		snake.reset();
	}
}

window.requestAnimationFrame(run);
