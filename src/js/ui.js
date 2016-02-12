import {EventEmitter} from 'events';
import Screen from 'screen';
import keyboard from 'keyboard';

const screen_ui = document.getElementById('screen');

const score_ui = document.getElementById('score');
const high_score_ui = document.getElementById('high-score');

const menu_ui = document.getElementById('menu-box');
const menu_ui_items = menu_ui.lastElementChild.children;

const message_ui = document.getElementById('message-box');

const screen = Screen(screen_ui);

function center(child, parent) {
	const child_box = child.getBoundingClientRect();
	const parent_box = parent.getBoundingClientRect();
	return {
		top: parent_box.top + (parent_box.height - child_box.height)/2 + 'px',
		left: parent_box.left + (parent_box.width - child_box.width)/2 + 'px'
	};
}

function selected_menu_item_index() {
	return Array.prototype.findIndex.call(
		menu_ui_items,
		(item) => item.className === 'active'
	);
}

function selected_menu_item() {
	return menu_ui_items[selected_menu_item_index()];
}

const ui = Object.assign(Object.create(new EventEmitter()), {
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
	showMenu() {
		Object.assign(menu_ui.style, center(menu_ui, screen_ui));
		Object.assign(menu_ui.dataset, {visible: 'yes'});
	},
	hideMenu() {
		menu_ui.dataset.visible = 'no';
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
});

keyboard
	.on('up', () => {
		const index = selected_menu_item_index();
		menu_ui_items[index].className = '';
		menu_ui_items[(index + menu_ui_items.length - 1)%menu_ui_items.length].className = 'active';
	})
	.on('down', () => {
		const index = selected_menu_item_index();
		menu_ui_items[index].className = '';
		menu_ui_items[(index + 1)%menu_ui_items.length].className = 'active';
	})
	.on('start', () => {
		ui.emit('start', selected_menu_item().dataset.level);
	});

export {ui as default};
