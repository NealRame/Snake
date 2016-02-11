import Screen from 'screen';
import keyboard from 'keyboard';

const message_ui = document.getElementById('message-box');
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
	},
	showMessage(text, title = '') {
		message_ui.innerHTML = '';
		if (title) {
			const h1 = document.createElement('h1');
			h1.innerHTML = title;
			message_ui.appendChild(h1);
		}
		if (text) {
			const span = document.createElement('span');
			span.innerHTML = text;
			message_ui.appendChild(span);
		}
		message_ui.dataset.visible = 'yes';
	},
	hideMessage() {
		message_ui.dataset.visible = 'no';
	}
};
