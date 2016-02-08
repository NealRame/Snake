function move({x, y}, direction) {
	if (direction === 'north') {
		return {x, y: y - 1};
	}
	if (direction === 'east') {
		return {x: x + 1, y};
	}
	if (direction === 'south') {
		return {x, y: y + 1};
	}
	if (direction === 'west') {
		return {x: x - 1, y};
	}
	throw new TypeError('Direction must be one of ["north", "east", "south", "west"]');
}

export default function Snake({width, height}) {
	let direction = 'east';
	const segments = [
		{x: width/2 - 1, y: height/2},
		{x: width/2,     y: height/2},
		{x: width/2 + 1, y: height/2}
	];
	return {
		collides() {
			const head = segments[0];
			return segments.some((segment) =>
				segment !== head && segment.x === head.x && segment.y === head.y
			);
		},
		step() {
			segments.pop();
			segments.unshift(move(segments[0], direction));
			return this;
		},
		get direction() {
			return direction;
		},
		set direction(d) {
			direction = d;
			return this;
		},
		[Symbol.iterator]: function*() {
			for (let segment of segments) {
				yield segment;
			}
		}
	};
}
