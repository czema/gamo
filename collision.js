window.addEventListener('DOMContentLoaded', () => {
	const rock = document.createElement('img');
	rock.src = "assets/collision/rock.svg";
	document.body.appendChild(rock);
	rock.addEventListener('load', () => {

		const canvas = document.querySelector('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = document.body.clientWidth; //document.width is obsolete
		canvas.height = document.body.clientHeight; //document.height is obsolete
		let canvasW = canvas.width;
		let canvasH = canvas.height;

		ctx.translate(0.5, 0.5);

		const state = {
			time: 0,
			player: {
				x: 0, y: 0
			},
			objects: [
				{ type: 1, x: 100, y: 100, rot: 15 },
				{ type: 2, x: 30, y: 150, rot: 30 },
				{ type: 1, x: 200, y: 150, rot: 3 },
				{ type: 2, x: 30, y: 150, rot: 10 },
				{ type: 1, x: 350, y: 150, rot: 80 },
				{ type: 2, x: 6, y: 150, rot: 20 },
				{ type: 1, x: 90, y: 90, rot: 0 },
				{ type: 2, x: 0, y: 20, rot: 3 },
				{ type: 1, x: 10, y: 15, rot: 9 },
				{ type: 2, x: 900, y: 50, rot: 12 },
				{ type: 1, x: 100, y: 10, rot: 20 },
			]
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

				if (btn_DOWN) state.player.y += 10;
				if (btn_RIGHT) state.player.x += 10;
				if (btn_LEFT) state.player.x -= 10;
				if (btn_UP) state.player.y -= 10;

				if (state.player.x < 25) state.player.x = 25;
				if (state.player.y < 25) state.player.y = 25;
				if (state.player.x > canvasW) state.player.x = canvasW - 50;
				if (state.player.y > canvasH) state.player.y = canvasH - 50;
			}

			// Move objects
			for (let i = 0; i < state.objects.length; i++) {
				const obj = state.objects[i];
				switch (obj.type) {
					case 1:
						obj.x += 3;
						break;
					case 2:
						obj.x += 6;
						break;
				}

				if (obj.x > canvasW) {
					// reset
					obj.x = Math.random() * 60;
					obj.rot = Math.random() * 90;
				}
				if (obj.y > canvasH) {
					obj.y = Math.random() * 60;
					obj.rot = Math.random() * 90;
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
			ctx.fillText('Collision', 12, 32);

			ctx.fillStyle = "rgba(65, 128, 255, 0.85)";
			ctx.fillText('Collision', 10, 30);

			// World
			for (let i = 0; i < state.objects.length; i++) {
				const obj = state.objects[i];
				switch (obj.type) {
					case 1:
					case 2: 
						{
						ctx.save();
						ctx.rotate(obj.rot * Math.PI / 180);

						ctx.drawImage(rock, obj.x, obj.y);
						ctx.restore();
						break;

					}
				}
			}

			// Player
			ctx.beginPath();
			ctx.moveTo(state.player.x + 25, state.player.y + 25);
			ctx.lineTo(state.player.x, state.player.y);
			ctx.lineTo(state.player.x - 25, state.player.y);

			ctx.stroke();
			ctx.fill();


			// Weapon

			state.time = time;
		};

		window.requestAnimationFrame(render);
	});
});