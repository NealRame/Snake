import {existy} from 'functional';
import {EventEmitter} from 'events';
import config from 'config';
import keyboard from 'keyboard';
import Food from 'food';
import Score from 'score';
import Snake from 'snake';

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

export default function Game(screen) {
	const event_emitter = new EventEmitter();

	let snake, food;
	let animation_id = null;
	let score = null;

	function run(ts = 0) {
		animation_id = window.requestAnimationFrame(run);
		screen.clear();
		if (snake.occupies(food.position)) {
			score.add(food.points);
			event_emitter.emit('score', score);
			food.reset();
			snake.grow(config.snake.grow);
		}
		draw_snake(screen, snake);
		draw_food(screen, food);
		snake.step(ts);
		if (snake.collides()) {
			stop_game();
			event_emitter.emit('finished');
		}
	}

	function reset(level) {
		const rect = {
			height: screen.height*config.game.scale,
			width: screen.width*config.game.scale
		};
		food = Food(rect, config.food.points[level]);
		snake = Snake(rect, config.snake.speed[level], config.game.borders);
		score = Score(level);
		keyboard.removeAllListeners('direction-changed');
		keyboard.on('direction-changed', (direction) => snake.direction = direction);
	}

	function stop_game() {
		window.cancelAnimationFrame(animation_id);
		animation_id = null;
	}

	function start_game() {
		animation_id = window.requestAnimationFrame(run);
	}

	function toggle_pause() {
		if (existy(animation_id)) {
			stop_game();
			event_emitter.emit('paused');
		} else {
			start_game();
			event_emitter.emit('resumed');
		}
		return this;
	}

	keyboard.on('pause', toggle_pause);

	return Object.assign(Object.create(event_emitter), {
		start(level) {
			if (!existy(animation_id)) {
				reset(level);
				start_game();
				event_emitter.emit('started', score);
			}
			return this;
		}
	});
}
