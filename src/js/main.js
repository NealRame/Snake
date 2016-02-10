import ui from 'ui';
import Game from 'game';

const game = Game(ui);

ui.screen.clear();

ui.keyboard
	.on('start', game.start.bind(game))
	.on('pause', game.togglePause.bind(game));

game
	.on('started', ui.clearScore.bind(ui))
	.on('score', ui.setScore.bind(ui))
	.on('high-score', ui.setHighScore.bind(ui));
