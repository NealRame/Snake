import {dispatch, existy} from 'functional';
import {EventEmitter} from 'events';
import keyboard from 'keyboard';
import Food from 'food';
import Score from 'score';
import Snake from 'snake';

const level_to_speed = dispatch(
	(level) => level === 'easy'   ? 10 : null,
	(level) => level === 'normal' ? 20 : null,
	() => 30
);

const level_to_point = dispatch(
	(level) => level === 'easy'   ?  5 : null,
	(level) => level === 'normal' ? 10 : null,
	() => 20
);

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
			snake.grow();
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
		score = Score(level);
		snake = Snake({width: screen.width/10, height: screen.height/10}, level_to_speed(level));
		food = Food({width: screen.width/10, height: screen.height/10}, level_to_point(level));
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
