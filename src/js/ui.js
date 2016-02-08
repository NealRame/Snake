import Screen from 'screen';
import {EventEmitter} from 'events';

const screen = Screen(document.getElementById('screen'));
const score_ui = document.getElementById('score');
const high_score_ui = document.getElementById('high-score');
const event_emitter = new EventEmitter;

document.addEventListener('keydown', (ev) => {
    event_emitter.emit('keydown', ev.keyCode);
    ev.preventDefault();
    ev.stopPropagation();
});

export default Object.assign(Object.create(event_emitter), {
	screen,
	setScore(v) {
		score_ui.innerHTML = `${v}`;
		return this;
	},
	setHighScore(v) {
		high_score_ui.innerHTML = `${v}`;
		return this;
	}
});
