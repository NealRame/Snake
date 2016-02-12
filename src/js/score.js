import {existy} from 'functional';

if (!existy(localStorage.highScore)) {
	localStorage.highScore = JSON.stringify({
		easy: 0,
		normal: 0,
		hard: 0
	});
}

const high_score = JSON.parse(localStorage.highScore);

export default function Score(level) {
	let score = 0;
	return {
		get best() {
			return high_score[level];
		},
		get value() {
			return score;
		},
		add(v) {
			score += v;
			if (score > high_score[level]) {
				high_score[level] = score;
				localStorage.highScore = JSON.stringify(high_score);
			}
		}
	};
}
