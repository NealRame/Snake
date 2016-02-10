import {existy} from 'functional';
import {EventEmitter} from 'events';
import Food from 'food';
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

export default function Game(ui) {
	const event_emitter = new EventEmitter();
	const screen = ui.screen;
	const snake = Snake({width: screen.width/10, height: screen.height/10}, 20);
	const food = Food({width: screen.width/10, height: screen.height/10});

	let animation_id = null;
	let score = 0;
	let high_score = 0;

	function reset() {
		window.cancelAnimationFrame(animation_id);
		snake.reset();
		food.reset();
	}

	function run(ts = 0) {
		animation_id = window.requestAnimationFrame(run);
		screen.clear();
		if (snake.occupies(food.position)) {
			score += food.points;
			high_score = Math.max(score, high_score);
			event_emitter.emit('score', score);
			event_emitter.emit('high-score', high_score);
			food.reset();
			snake.grow();
		}
		draw_snake(screen, snake);
		draw_food(screen, food);
		snake.step(ts);
		if (snake.collides()) {
			window.cancelAnimationFrame(animation_id);
			animation_id = null;
		}
	}

	return Object.assign(Object.create(event_emitter), {
		start()	{
			if (!existy(animation_id)) {
				reset();
				run();
				ui.on('pause', () => this.togglePause());

			}
		},
		togglePause() {
			if (existy(animation_id)) {
				ui.removeAllListeners('direction-changed');
				window.cancelAnimationFrame(animation_id);
				animation_id = null;
			} else {
				ui.on('direction-changed', (direction) => snake.direction = direction);
				run();
			}
		}
	});
}
