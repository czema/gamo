window.addEventListener('DOMContentLoaded', () => {

   // Object types:
   // 0 : none
   // 1 : missile
   // 2 : rock, slow
   // 3 : rock, fast

   const toRad = deg => deg * (Math.PI / 180);
   const getRadius = type => {
      switch (type) {
         case 0: return 10;
         case 1: return 10;
         case 2: return 40;
         case 3: return 40;
      }
   }

   const state = {
      ctx: null,
      maxX: 0, maxY: 0,
      time: 0,
      keys: {},
      player: {
         missile_time: -100000
      },
      objects: [
         { type: 0, x: 10, y: 10, rot: toRad(0), vel: 0 },
         { type: 2, x: 1100, y: 100, rot: toRad(15), vel: 1 },
         { type: 3, x: 130, y: 1150, rot: toRad(30), vel: 4 },
         { type: 2, x: 1200, y: 250, rot: toRad(3), vel: 1 },
         { type: 3, x: 130, y: 310, rot: toRad(10), vel: 4 },
         { type: 2, x: 1350, y: 1150, rot: toRad(80), vel: 1 },
         { type: 3, x: 16, y: 410, rot: toRad(20), vel: 4 },
         { type: 2, x: 190, y: 590, rot: toRad(0), vel: 1 },
         { type: 3, x: 10, y: 620, rot: toRad(3), vel: 4 },
         { type: 2, x: 110, y: 715, rot: toRad(9), vel: 1 },
         { type: 3, x: 1900, y: 850, rot: toRad(12), vel: 4 },
         { type: 2, x: 1100, y: 910, rot: toRad(20), vel: 1 },
      ]
   };

   const update = time => {
      let btn_B = false;
      let btn_A = state.keys.Space;
      let btn_Y = false;
      let btn_X = false;
      let btn_LSH = state.keys.KeyQ;
      let btn_RSH = state.keys.KeyE;
      let btn_SELECT = false;
      let btn_START = false;
      let btn_UP = state.keys.ArrowUp || state.keys.KeyW;
      let btn_DOWN = state.keys.ArrowDown || state.keys.KeyS;
      let btn_LEFT = state.keys.ArrowLeft || state.keys.KeyA;
      let btn_RIGHT = state.keys.ArrowRight || state.keys.KeyD;

      const gamepads = navigator.getGamepads();
      for (const gamepad of gamepads) {
         if (!gamepad) continue;

         let btn_B = btn_B || gamepad.buttons[0].pressed;
         let btn_A = btn_A || gamepad.buttons[1].pressed;
         let btn_Y = btn_Y || gamepad.buttons[2].pressed;
         let btn_X = btn_X || gamepad.buttons[3].pressed;
         let btn_LSH = btn_LSH || gamepad.buttons[4].pressed;
         let btn_RSH = btn_RSH || gamepad.buttons[5].pressed;
         let btn_SELECT = btn_SELECT || gamepad.buttons[8].pressed;
         let btn_START = btn_START || gamepad.buttons[9].pressed;
         let btn_UP = btn_UP || gamepad.buttons[12].pressed;
         let btn_DOWN = btn_DOWN || gamepad.buttons[13].pressed;
         let btn_LEFT = btn_LEFT || gamepad.buttons[14].pressed;
         let btn_RIGHT = btn_RIGHT || gamepad.buttons[15].pressed;
      }

      // Update player.
      if (btn_DOWN) state.objects[0].y += 10;
      if (btn_RIGHT) state.objects[0].x += 10;
      if (btn_LEFT) state.objects[0].x -= 10;
      if (btn_UP) state.objects[0].y -= 10;

      if (btn_LSH) state.objects[0].rot -= 0.1;
      if (btn_RSH) state.objects[0].rot += 0.1;

      if (state.objects[0].x < 0) state.objects[0].x = state.maxX;
      if (state.objects[0].y < 0) state.objects[0].y = state.maxY;
      if (state.objects[0].x > state.maxX) state.objects[0].x = 0;
      if (state.objects[0].y > state.maxY) state.objects[0].y = 0;

      // Move objects
      for (let i = 0; i < state.objects.length; i++) {
         const obj = state.objects[i];

         obj.x += obj.vel * Math.cos(obj.rot);
         obj.y += obj.vel * Math.sin(obj.rot);

         if (obj.x < 0) obj.x = state.maxX;
         if (obj.y < 0) obj.y = state.maxY;
         if (obj.x > state.maxX) obj.x = 0;
         if (obj.y > state.maxY) obj.y = 0;
      }

      // Collisions
      // Check the distance between every object.
      for (let i = 0; i < state.objects.length; i++) {
         const obj1 = state.objects[i];

         if (obj1.dead < time) continue; // Doesn't actually exist.

         for (let j = 0; j < state.objects.length; j++) {
            if (i == j) continue;

            const obj2 = state.objects[j];

            if (obj2.dead < time) continue; // Doesn't actually exist.

            const distX = obj1.x - obj2.x;
            const distY = obj1.y - obj2.y;
            const distance = Math.sqrt((distX * distX) + (distY * distY));

            const c1r = getRadius(obj1.type);
            const c2r = getRadius(obj2.type);

            if (distance <= c1r + c2r) {
               // Implement collision resolution.


               if (obj1.type === 1 && obj2.type === 2) {
                  // Missle-rock
                  obj1.dead = time;
                  obj2.dead = time;

                  state.objects.push({
                     type: 4,
                     x: obj2.x,
                     y: obj2.y,
                     rot: obj2.rot,
                     vel: obj2.vel,
                     dead: time + 1000
                  });

               } else if (obj1.type === 1 && obj2.type === 3) {
                  // Missle-rock
                  obj1.dead = time;
                  obj2.dead = time;

                  state.objects.push({
                     type: 4,
                     x: obj2.x,
                     y: obj2.y,
                     rot: obj1.rot,
                     vel: obj1.vel,
                     dead: time + 1000
                  });
               }
            }
         }
      }

      // New missle
      if (btn_A) {
         if (state.player.missile_time + 500 < time) {
            const missile = {
               type: 1,
               time: time,
               dead: time + 2000,
               x: state.objects[0].x,
               y: state.objects[0].y,
               rot: state.objects[0].rot,
               vel: 30
            };

            state.objects.push(missile);

            state.player.missile_time = time;
         }
      }

      // Delete objects.

      for (i = state.objects.length - 1; i >= 0; i--)
         if (state.objects[i].dead && state.objects[i].dead < time)
            state.objects.splice(i, 1);
   }

   const draw = time => {
      const ctx = state.ctx;

      // Clear the screen.
      ctx.fillStyle = '#FFFFFF';
      ctx.rect(0, 0, state.maxX, state.maxY);
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

         ctx.setTransform(1, 0, 0, 1, obj.x, obj.y);
         ctx.rotate(obj.rot);

         switch (obj.type) {
            case 0: // Ship
               ctx.beginPath();
               ctx.moveTo(-5, -5);
               ctx.lineTo(15, 00);
               ctx.lineTo(-5, +5);

               ctx.stroke();
               ctx.fill();
               break;
            case 1: // Missile
               ctx.fillStyle = "#000";
               ctx.beginPath();
               ctx.arc(0, 0, 10, 0, Math.PI * 2);
               ctx.fill();
               break;
            case 2: // Rocks
            case 3:
               ctx.drawImage(rock, -rock.width / 2, -rock.height / 2);
               break;
            case 4:
               ctx.fillStyle = "#C00";
               ctx.beginPath();
               ctx.arc((Math.random() * 50) - 25, (Math.random() * 50) - 25, Math.random() * 5, 0, Math.PI * 2);
               ctx.fill();
               ctx.beginPath();
               ctx.arc((Math.random() * 50) - 25, (Math.random() * 50) - 25, Math.random() * 5, 0, Math.PI * 2);
               ctx.fill();
               ctx.beginPath();
               ctx.arc(0, 0, (Math.random() * 5) + 10, 0, Math.PI * 2);
               ctx.fill();
               ctx.beginPath();
               ctx.arc((Math.random() * 50) - 25, (Math.random() * 50) - 25, Math.random() * 5, 0, Math.PI * 2);
               ctx.fill();
               ctx.beginPath();
               ctx.arc((Math.random() * 50) - 25, (Math.random() * 50) - 25, Math.random() * 5, 0, Math.PI * 2);
               ctx.fill();
               break;
         }
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
   };

   const render = time => {
      update(time);
      draw(time);
      state.time = time;
      window.requestAnimationFrame(render);
   };

   const init = () => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');

      // Set the canvas to the same size as the window and set the internal state while we are at it.
      state.maxX = canvas.width = document.body.clientWidth;
      state.maxY = canvas.height = document.body.clientHeight;
      state.ctx = ctx;

      // Fixes pixelated 1px lines.
      ctx.translate(0.5, 0.5);

      state.objects[0].x = state.maxX / 2;
      state.objects[0].y = state.maxY / 2;

      // Begin render loop.
      window.requestAnimationFrame(render);
   };

   // Keyboard input is event driven.
   document.addEventListener('keydown', evt => {
      state.keys[evt.code] = true;
   }, { passive: true });

   document.addEventListener('keyup', evt => {
      state.keys[evt.code] = false;
   }, { passive: true });

   // Load assets.
   const rock = document.createElement('img');
   rock.src = "assets/collision/rock.svg";
   document.body.appendChild(rock);

   // Wait until assets are loaded to begin rendering.
   rock.addEventListener('load', () => {
      init();
   });

});