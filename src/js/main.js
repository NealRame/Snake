import ui from 'ui';
import Game from 'game';

const game = Game(ui);

ui.screen.clear();
ui.showMessage('Press \'space\' to start.');

ui.keyboard
	.on('start', game.start.bind(game))
	.on('pause', game.togglePause.bind(game));

game
	.on('started', () => {
		ui.clearScore();
		ui.hideMessage();
	})
	.on('finished', () => {
		ui.showMessage('Press \'space\' to start.', 'Game Over');
	})
	.on('paused', () => {
		ui.screen.clear();
		ui.showMessage('Press \'P\' to resume.', 'Pause');
	})
	.on('resumed', () => {
		ui.hideMessage();
	})
	.on('score', ui.setScore.bind(ui))
	.on('high-score', ui.setHighScore.bind(ui));
