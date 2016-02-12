import ui from 'ui';
import Game from 'game';
import {keyboard, MODE_UI, MODE_GAME} from 'keyboard';

window.addEventListener('load', () => {
	const game = Game(ui.screen);

	keyboard.setMode(MODE_UI);

	ui.screen.clear();
	ui.showMenu();

	ui.on('start', (level) => {
		keyboard.setMode(MODE_GAME);
		ui.hideMenu();
		game.start(level);
	});

	game
		.on('started', (score) => {
			ui.setScore(score.value);
			ui.setHighScore(score.best);
		})
		.on('finished', () => {
			keyboard.setMode(MODE_UI);
			ui.screen.clear();
			ui.showMenu();
		})
		.on('paused', () => {
			ui.screen.clear();
			ui.showMessage('Press \'space\' to resume.', 'Pause');
		})
		.on('resumed', () => {
			ui.hideMessage();
		})
		.on('score', (score) => {
			ui.setScore(score.value);
			ui.setHighScore(score.best);
		});
});
