import Screen from 'screen';
import {EventEmitter} from 'events';
import {dispatch, existy} from 'functional';
import {NORTH, EAST, SOUTH, WEST} from 'snake';

const screen = Screen(document.getElementById('screen'));
const score_ui = document.getElementById('score');
const high_score_ui = document.getElementById('high-score');
const event_emitter = new EventEmitter;

const keycode_to_event = dispatch(
	(keycode) => keycode === 37 ? ['direction-changed', WEST]  : null,
	(keycode) => keycode === 38 ? ['direction-changed', NORTH] : null,
	(keycode) => keycode === 39 ? ['direction-changed', EAST]  : null,
	(keycode) => keycode === 40 ? ['direction-changed', SOUTH] : null,
	(keycode) => keycode === 80 ? ['pause'] : null
	// (keycode) => console.log(keycode)
);

document.addEventListener('keydown', (ev) => {
	const event_data = keycode_to_event(ev.keyCode);
	if (existy(event_data)) {
		event_emitter.emit.apply(event_emitter, event_data);
		ev.preventDefault();
		ev.stopPropagation();
	}
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
