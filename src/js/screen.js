export default function Screen(element) {
	const context = element.getContext('2d');
	return {
		drawRect({x, y, width, height}, color = '#fff') {
			context.save();
			context.fillStyle = color;
			context.fillRect(x, y, width, height);
			context.restore();
			return this;
		},
		clear(color = '#000') {
			return this.drawRect({
				x: 0,
				y: 0,
				width: element.width,
				height: element.height
			}, color);
		}
	};
}
