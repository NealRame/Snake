import {EventEmitter} from 'events';
import {dispatch, existy} from 'functional';
import {NORTH, EAST, SOUTH, WEST} from 'snake';

const event_emitter = new EventEmitter;

export const MODE_GAME = 0;
export const MODE_UI   = 1;

const game_mode_key_to_event_data = dispatch(
	(key) => key === 32 ? ['pause'] : null,
	(key) => key === 37 ? ['direction-changed', WEST]  : null,
	(key) => key === 38 ? ['direction-changed', NORTH] : null,
	(key) => key === 39 ? ['direction-changed', EAST]  : null,
	(key) => key === 40 ? ['direction-changed', SOUTH] : null
	// (keycode) => console.log(keycode)
);

const ui_mode_key_to_event_data = dispatch(
	(key) => key === 38 ? ['up'] : null,
	(key) => key === 40 ? ['down'] : null,
	(key) => key === 13 ? ['start'] : null
	// (keycode) => console.log(keycode)
);

function game_mode_listener(ev) {
	const event_data = game_mode_key_to_event_data(ev.keyCode);
	if (existy(event_data)) {
		event_emitter.emit.apply(event_emitter, event_data);
		ev.preventDefault();
		ev.stopPropagation();
	}
}

function ui_mode_listener(ev) {
	const event_data = ui_mode_key_to_event_data(ev.keyCode);
	if (existy(event_data)) {
		event_emitter.emit.apply(event_emitter, event_data);
		ev.preventDefault();
		ev.stopPropagation();
	}
}

export const keyboard = Object.assign(Object.create(event_emitter), {
	setMode: dispatch(
		() => {
			document.removeEventListener('keydown', game_mode_listener);
			document.removeEventListener('keydown', ui_mode_listener);
		},
		(mode) => {
			if (mode === MODE_GAME) {
				document.addEventListener('keydown', game_mode_listener);
				return true;
			}
		},
		(mode) => {
			if (mode === MODE_UI) {
				document.addEventListener('keydown', ui_mode_listener);
				return true;
			}
		}
	)
});

export {keyboard as default};
