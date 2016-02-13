import {existy} from 'functional';

function equals({x: x1, y: y1}, {x: x2, y: y2}) {
	return x1 === x2 && y1 === y2;
}

function copy({x, y}) {
	return {x, y};
}

function add({x: x1, y: y1}, {x: x2, y: y2}) {
	return {
		x: x1 + x2,
		y: y1 + y2
	}
}

function orthogonal({x: x1, y: y1}, {x: x2, y: y2}) {
	return x1*x2 + y1*y2 === 0;
}

function update_direction(current_direction, next_direction) {
	return (orthogonal(current_direction, next_direction)
		? next_direction
		: current_direction);
}

export const NORTH = {x:  0, y: -1};
export const EAST  = {x:  1, y:  0};
export const SOUTH = {x:  0, y:  1};
export const WEST  = {x: -1, y:  0};

export default function Snake({width, height}, speed = 40) {
	let d_step = 1/speed;
	let last_ts = 0;
	let grow = 0;
	let current_direction = EAST;
	let next_direction = EAST;
	let segments = [
		{x: width/2 + 1, y: height/2},
		{x: width/2,     y: height/2},
		{x: width/2 - 1, y: height/2}
	];
	return {
		collides() {
			const head = segments[0];
			if (!existy(head)) {
				return false;
			}
			return (
				(head.x < 0 || head.x >= width || head.y < 0 || head.y >= height)
					|| segments.some((segment, index) => index > 0 && equals(segment, head))
			);
		},
		occupies({x, y}) {
			return equals(segments[0], {x, y});
		},
		step(ts) {
			if ((ts - last_ts)/1000 > d_step) {
				let head = segments[0];
				if (existy(head)) {
					if (!equals(next_direction, current_direction)) {
						next_direction =
						current_direction =
						update_direction(current_direction, next_direction);
					}
					head = add(head, current_direction);
					// head.x = (head.x + width)%width;
					// head.y = (head.y + height)%height;
					if (grow === 0) {
						segments.pop();
					} else {
						grow--;
					}
					segments.unshift(head);
				}
				last_ts = ts;
			}
			return this;
		},
		grow(n = 1) {
			grow = n;
		},
		get head() {
			return copy(segments[0]);
		},
		get direction() {
			return current_direction;
		},
		set direction(d) {
			next_direction = d;
		},
		[Symbol.iterator]: function*() {
			for (let segment of segments) {
				yield segment;
			}
		}
	};
}
