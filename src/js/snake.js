import {dispatch, existy} from 'functional';

const move = dispatch(
	({x, y}, direction)	=> {
		if (direction === 'north') {
			return {x, y: y - 1};
		}
	},
	({x, y}, direction) => {
		if (direction === 'east') {
			return {x: x + 1, y};
		}
	},
	({x, y}, direction) => {
		if (direction === 'south') {
			return {x, y: y + 1};
		}
	},
	({x, y}, direction) => {
		if (direction === 'west') {
			return {x: x - 1, y};
		}
	},
	() => {
		throw new TypeError(
			'Direction must be one of ["north", "east", "south", "west"]'
		);
	}
);

export default function Snake({width, height}, speed = 40) {
	let d_step = 1/speed;
	let last_ts = 0;
	let direction = 'east';
	let segments = [];
	return {
		reset() {
			direction = 'east';
			segments = [
				{x: width/2 + 1, y: height/2},
				{x: width/2,     y: height/2},
				{x: width/2 - 1, y: height/2}
			];
		},
		collides() {
			const head = segments[0];
			return segments.some((segment, index) =>
				index > 0 && segment.x === head.x && segment.y === head.y
			);
		},
		step(ts) {
			if ((ts - last_ts)/1000 > d_step) {
				let head = segments[0];
				if (existy(head)) {
					head = move(head, direction);
					head.x = (head.x + width)%width;
					head.y = (head.y + height)%height;
					segments.pop();
					segments.unshift(head);
				}
				last_ts = ts;
			}
			return this;
		},
		get head() {
			const head = segments[0];
			return {
				x: head.x,
				y: head.y
			};
		},
		get direction() {
			return direction;
		},
		set direction(d) {
			direction = d;
		},
		[Symbol.iterator]: function*() {
			for (let segment of segments) {
				yield segment;
			}
		}
	};
}
