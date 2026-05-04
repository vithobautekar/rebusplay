# 🧩 Rebus Puzzle Game

A web-based rebus puzzle game with 1000 puzzles, playable directly in your browser — no backend needed.

## Features

- 🎲 1000 puzzles served in random order
- ✅ Type and submit your answer
- 🏳️ Forfeit to reveal the answer
- 🔥 Streak tracking
- 🏆 Score and summary screen at the end
- ⌨️ Keyboard shortcut: press **Enter** to submit / advance

---

## File Structure

```
rebus-game/
├── index.html    ← Main game page
├── style.css     ← Styling
├── game.js       ← Game logic
└── puzzles.js    ← All 1000 puzzle data
```

---

## 🚀 Hosting on GitHub Pages (Step-by-Step)

### Step 1 — Create a GitHub account
If you don't have one, sign up at [github.com](https://github.com).

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `rebus-game` (or anything you like)
3. Set it to **Public**
4. **Do NOT** check "Add a README" (we'll upload our own files)
5. Click **Create repository**

### Step 3 — Upload the game files
1. On the repository page, click **Add file → Upload files**
2. Drag and drop all 4 files:
   - `index.html`
   - `style.css`
   - `game.js`
   - `puzzles.js`
3. Scroll down, click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to your repository → **Settings** (top tab)
2. In the left sidebar, click **Pages**
3. Under **Source**, choose **Deploy from a branch**
4. Branch: `main` | Folder: `/ (root)`
5. Click **Save**

### Step 5 — Access your live game 🎉
After ~1–2 minutes, your game will be live at:
```
https://YOUR_USERNAME.github.io/rebus-game/
```
Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Tips

- Answers are **case-insensitive** and **punctuation is ignored** — so "man overboard" works the same as "Man Overboard"
- Press **Enter** to submit your answer, or **Enter** again to go to the next puzzle
- The puzzles shuffle randomly each time you play

---

## License

Puzzle content from *Ultimate 1000 Rebus Puzzles*. Game code is free to use and modify.
