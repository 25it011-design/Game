# Sky Hopper

An original 2D side-scrolling platformer that runs in any modern browser on Windows, Mac, Linux, and phones. It uses HTML, CSS, and vanilla JavaScript with the HTML5 Canvas. There are no dependencies, no build step, no paid APIs, and no copyrighted artwork or music. All sprites are drawn in code, and all sounds are synthesized at runtime.

## Project structure

```
platformer/
├── index.html   Page layout: canvas, HUD, menus, touch controls
├── style.css    Responsive 16:9 stage, retro panels and buttons
├── game.js      Engine: physics, collision, enemies, levels, audio, rendering
├── assets/      Reserved for images or audio you add later
├── tools/       gen_levels.py: builds and checks the level maps (development only)
└── README.md    This file
```

Everything the game needs is in these files. No server is required.

## Run it locally

Option A (simplest): double-click `index.html`. It opens in your browser and works from a `file://` address.

Option B: serve the folder. This is useful if you want to test over HTTP as the public site will run.

```bash
cd platformer
python3 -m http.server 8000
# then open http://localhost:8000
```

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Arrow keys or A / D | ◀ ▶ buttons |
| Jump (hold for a higher jump) | Space, W, or ↑ | JUMP |
| Run faster | Shift | RUN |
| Crouch / enter a warp pipe | ↓ or S (while standing on a green pipe) | ▼ |
| Pause / resume | P or Esc | II button |
| Restart the world | R (while playing or paused) | Pause menu |
| Fullscreen | F, or the Fullscreen button | Fullscreen button |
| Mute | M button in the HUD | M button |

## Gameplay

- **Stomp enemies** from above to defeat them. Touching them from the side hurts you.
- **Question blocks (?)** give coins, a growth mushroom, a speed star, or a shield.
- **Bricks** bump when you hit them. When you are big, you can break them.
- **Mushroom** makes you big and lets you survive one hit. Getting hit while small costs a life.
- **Star** gives a temporary speed boost. **Shield** blocks one hit for 10 seconds.
- **Coins** add points. Collect 100 for an extra life. Secret coins (pink) are worth more.
- **Warp pipes** (green) lead to a hidden ledge with secret coins. Stand on the pipe and press Down.
- **Checkpoints** (flags on poles) save your place. Dying returns you to the last one you passed.
- **Timer** counts down from 300 seconds. Time left over becomes a bonus at the end of each world.
- **Flagpole** at the end of each world completes it.
- **Boss** in the Final Castle: stomp it six times while avoiding its fireballs.

## The five worlds

1. **Grassland Adventure**: a gentle introduction with pits, pipes, and bricks.
2. **Underground Caverns**: dark caves, a hanging rock, and hidden treasure.
3. **Sky Platforms**: floating platforms, a moving platform, and longer jumps.
4. **Lava Fortress**: lava pits with bridges, stone pillars, and more enemies.
5. **Final Castle**: a lava moat, a corridor of pillars, and the boss arena.

Each world's layout is checked by a generator script (see Development below) to confirm that the flagpole or boss arena can be reached from the start using the player's jump limits.

## Deploy free on GitHub Pages

GitHub Pages serves static files for free. This game needs nothing else.

1. **Create a repository.** Sign in to GitHub, click **New**, and name it `sky-hopper`. Set it to **Public**. Do not add a README or license from the website, because you already have them.
2. **Upload the files.** On the new repository's page, click **uploading an existing file**. Drag in the *contents* of the `platformer` folder: `index.html`, `style.css`, `game.js`, `README.md`, and the `assets` and `tools` folders. Then click **Commit changes**.
   - Make sure `index.html` sits at the top level of the repository, not inside a subfolder.
3. **Enable Pages.** Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**. Choose the **main** branch and the **/ (root)** folder, then click **Save**.
4. **Wait about a minute.** Refresh the Pages settings page. It shows your public address, in the form `https://YOUR-USERNAME.github.io/sky-hopper/`.
5. **Open the link.** Play on desktop or phone. If you see an old version after an update, hard-refresh the page (Ctrl+F5 or Cmd+Shift+R).

Updating later: upload the changed file to the repository the same way, and GitHub redeploys automatically.

## Testing checklist

Desktop
- [ ] Title screen loads. The Play, Level Select, How to Play, and Sound buttons each open their screen, and Back returns to the title.
- [ ] Play Game starts World 1. The HUD shows score, coins, lives, time, and the world name.
- [ ] Arrow keys and A/D move. Holding Shift runs faster.
- [ ] A short tap jumps low, and a held press jumps higher.
- [ ] Stomping a walker removes it and bounces you up. Touching one from the side costs a life.
- [ ] Hitting a ? block releases a reward. Hitting a brick while small bumps it. Hitting it while big breaks it.
- [ ] Pressing Down on a green pipe warps you to the blue pipe on the ledge with secret coins.
- [ ] Reaching a checkpoint and then dying respawns you at that checkpoint.
- [ ] Falling into a pit or lava costs a life. At zero lives, the Game Over screen appears with Try Again working.
- [ ] Pause (P or Esc) freezes the world. Resume continues, and Restart Level resets the world.
- [ ] Reaching the flagpole shows World Clear with a time bonus. Next World starts the following world.
- [ ] Level Select shows locked worlds until you clear the one before them. Best scores are kept after a reload.
- [ ] Stomping the boss six times shows the victory screen. The high score persists after a reload.
- [ ] Sound settings: volume, music, and sound effects each change audio, and the settings persist after a reload.
- [ ] F or the Fullscreen button toggles fullscreen. Resizing the window keeps the 16:9 layout.

Phone or tablet
- [ ] Touch buttons appear. Left, Right, Jump, Run, and Down respond, including holding two at once (for example Right plus Jump).
- [ ] The page does not scroll or zoom while you play.
- [ ] Rotating the device keeps the game visible.

Browsers
- [ ] Works in recent Chrome, Edge, Firefox, and Safari.
- [ ] The audio starts only after your first tap or key press.

## Development

The level maps are generated by `tools/gen_levels.py`, which also checks them. To change or add a level, edit the level functions in that script and run:

```bash
python3 tools/gen_levels.py
```

The script checks that every level can be finished with the player's jump limits, and it refuses to write `game.js` if a level fails. Running it again on an unchanged script leaves `game.js` identical. The game file already contains the generated levels, so you do not need Python to play or deploy the game.

## Notes and limitations

- Graphics are drawn with canvas shapes in a pixel-art style, not from image files. You can replace them by editing the draw functions in `game.js`.
- Music is a simple chiptune loop synthesized in the browser. Each world has its own tempo and bass line.
- Level layout has been checked for reachability, and the core physics has been tested with automated headless checks. Each world still deserves a full playthrough on your own devices, because feel and difficulty are subjective.
