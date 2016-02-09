function reset(width, height) {
	return {
		x: Math.floor(Math.random()*width),
		y: Math.floor(Math.random()*height)
	};
}

export default function Food({width, height}, points = 5) {
	let position = reset(width, height);
	return {
		get points() {
			return points;
		},
		get position() {
			return position;
		},
		reset() {
			position = reset(width, height);
			return this;
		}
	}
}
