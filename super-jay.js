window.addEventListener('DOMContentLoaded', () => {
	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');

   canvas.width = document.body.clientWidth; //document.width is obsolete
   canvas.height = document.body.clientHeight; //document.height is obsolete
   let canvasW = canvas.width;
   let canvasH = canvas.height;
	
	ctx.translate(0.5, 0.5);
	
	const sq = (ctx, x, y, w, h) => {
		ctx.fillRect(x, y, w, h);
	};

	document.addEventListener('keydown', evt => {
		if (evt.which === 65) { // a
			h4.innerText = 'by Henry';
		} else if (evt.which === 66) { //b
			h4.innerText = 'by Robbie';
		}
	});
	
	const state = {
		time: 0,
		x: 0,
		y: 0,
		b1: "#000000",
		b2: "#000000",
		b3: "#000000",
		b4: "#000000"
	};
	
	const render = time => {
		window.requestAnimationFrame(render);

		// State update.
		const gamepads = navigator.getGamepads();
		for (const gamepad of gamepads) {
			if (!gamepad) continue;
			const btn_B = gamepad.buttons[0].pressed;
			const btn_A = gamepad.buttons[1].pressed;
			const btn_Y = gamepad.buttons[2].pressed;
			const btn_X = gamepad.buttons[3].pressed;
			const btn_LSH = gamepad.buttons[4].pressed;
			const btn_RSH = gamepad.buttons[5].pressed;
			const btn_SELECT = gamepad.buttons[8].pressed;
			const btn_START = gamepad.buttons[9].pressed;
			const btn_UP = gamepad.buttons[12].pressed;
			const btn_DOWN = gamepad.buttons[13].pressed;
			const btn_LEFT = gamepad.buttons[14].pressed;
			const btn_RIGHT = gamepad.buttons[15].pressed;

			if (btn_DOWN)
				state.y += 10;
			if (btn_RIGHT)
				state.x += 10;
			if (btn_LEFT) state.x -= 10;
			if (btn_UP) state.y -= 10;

			if (state.x < 0) state.x = 0;
			if (state.y < 0) state.y = 0;
			if (btn_X) {
				state.b1 = '#FF0000';
			} else {
				state.b1 = '#000000';
			}

			if (btn_A) {
				state.b2 = '#FF0000';
			} else {
				state.b2 = '#000000';
			}

			if (btn_B) {
				state.b3 = '#FF0000';
			} else {
				state.b3 = '#000000';
			}

			if (btn_Y) {
				state.b4 = '#FF0000';
			} else {
				state.b4 = '#000000';
			}

      }

		// Render

		// Clear the screen.
		ctx.fillStyle = '#FFFFFF';
		ctx.rect(0, 0, canvasW, canvasH);
		ctx.fill();
      
		// Logo.
		ctx.font = "36px Roboto";
		ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
		ctx.fillText('Super Jay', 12, 32);

		ctx.fillStyle = "rgba(65, 128, 255, 0.85)";
		ctx.fillText('Super Jay', 10, 30);
		
		ctx.beginPath();
		ctx.fillStyle = state.b1;
		sq(ctx, state.x + 000 + (Math.random() * 50) - 25, state.y + 000 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25);
		ctx.fillStyle = state.b2;
		sq(ctx, state.x + 125 + (Math.random() * 50) - 25, state.y + 000 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25);
		ctx.fillStyle = state.b3;
		sq(ctx, state.x + 125 + (Math.random() * 50) - 25, state.y + 125 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25);
		ctx.fillStyle = state.b4;
		sq(ctx, state.x + 000 + (Math.random() * 50) - 25, state.y + 125 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25, 100 + (Math.random() * 50) - 25);
		ctx.closePath();
		ctx.stroke();

		//state.x += 4;
		//state.y += 2;
		
		if (state.x + 225 > canvasW) state.x = 0;
		if (state.y + 225 > canvasH) state.y = 0;

		state.time = time;
	};
	
	window.requestAnimationFrame(render);
});

