import Screen from 'screen';
import keyboard from 'keyboard';

const score_ui = document.getElementById('score');
const high_score_ui = document.getElementById('high-score');
const screen = Screen(document.getElementById('screen'));

export default {
	keyboard,
	screen,
	clearScore() {
		score_ui.innerHTML = '0';
	},
	setScore(v) {
		score_ui.innerHTML = `${v}`;
		return this;
	},
	setHighScore(v) {
		high_score_ui.innerHTML = `${v}`;
		return this;
	}
};
