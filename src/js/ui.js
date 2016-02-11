import Screen from 'screen';
import keyboard from 'keyboard';

const screen_ui = document.getElementById('screen');
const message_ui = document.getElementById('message-box');
const score_ui = document.getElementById('score');
const high_score_ui = document.getElementById('high-score');

const screen = Screen(screen_ui);

function center(child, parent) {
	const child_box = child.getBoundingClientRect();
	const parent_box = parent.getBoundingClientRect();
	return {
		top: parent_box.top + (parent_box.height - child_box.height)/2 + 'px',
		left: parent_box.left + (parent_box.width - child_box.width)/2 + 'px'
	};
}

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
		Object.assign(message_ui.style, center(message_ui, screen_ui));
		Object.assign(message_ui.dataset, {visible: 'yes'});
	},
	hideMessage() {
		message_ui.dataset.visible = 'no';
	}
};
