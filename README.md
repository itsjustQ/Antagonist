# Antagonist (p5.js game)

## Porting the sketch from the p5.js Web Editor

When looking for a way to download an entire sketch from the p5.js Web Editor we found a community‑written utility mentioned in a [Reddit thread](https://www.reddit.com/r/p5js/comments/kew2gc/is_it_possible_to_easily_download_all_my_sketches/).  The tool, [**p5‑project‑downloader**](https://github.com/niemenjoki/p5-project-downloader), is designed to fetch all of a user’s projects and bundle the text files into a ZIP archive.  According to its documentation it only supports **text‑based filetypes**【612701680986543†L5-L12】.  Binary assets like images and audio are deliberately skipped, and the server side merely proxies the p5.js Web Editor’s public API【292628851887082†L11-L17】.  Because the *Antagonist* game relies on sprites and sound effects, we opted not to use the downloader and instead extracted the files manually.

The p5.js Web Editor exposes every sketch through a public API at a URL of the form:

```
https://editor.p5js.org/editor/<username>/projects
```

Each entry in the JSON response describes a file or folder along with its contents or a `url` property that points to the binary on `assets.editor.p5js.org`.  We used this API to locate the project named **Antagonists Newest copy** and then downloaded the source code and images directly.

### What’s included in this repository

* **`index.html`** – Loads the p5.js library from a CDN and executes `sketch.js`.  This replaces the previous iframe embed so that the game can run entirely from this repository.
* **`sketch.js`** – A verbatim copy of the original game logic from the Web Editor, including all variables, functions and drawing routines【963558638748338†L25-L43】.  The only modifications are comments explaining that some audio files are missing.  If you supply the MP3 files, the `loadSound()` calls will play them.
* **`style.css`** – Minimal CSS matching the original project’s styling.
* **Images** – All sprites used by the game have been downloaded from the S3 bucket and stored alongside the code.  This includes top‑level files like `p5GameBeetle.gif`, `antenemy.gif`, `bullet.gif`, `background.png`, `shieldfull.png` and `shieldempty.png`, as well as additional graphics in the `img/` directory【963558638748338†L318-L351】【963558638748338†L442-L455】.
* **Sounds** – The API lists 16 audio files (e.g. `fast.mp3`, `gainshield.mp3`, `gethit1.mp3`, `hit2.mp3`, `spit1.mp3`, `gamemusic.mp3`, etc.)【963558638748338†L360-L428】【963558638748338†L426-L479】.  Unfortunately, these cannot be downloaded from within this environment; attempts to fetch them return HTTP 403 errors.  As a result the `sounds/` folder is empty.  The game will run without audio, but you can enable sound by downloading the MP3s yourself and placing them in `sounds/` or by changing the `loadSound()` paths in `sketch.js` to the public URLs listed in the API response.

### Running the game locally

1. Clone this repository or download it as a ZIP.
2. (Optional) Obtain the missing MP3s from the p5.js Web Editor API or by downloading the sketch through your own account.  Place them in the `sounds/` folder.
3. Open `index.html` in a modern web browser.  The canvas will resize to fill the window and the game will start.  Use **WASD** to move, **Spacebar** to shoot and **Shift** to dash.

### Deploying with GitHub Pages

Since all of the HTML, JavaScript and image assets are stored in this repository, enabling GitHub Pages on the `main` branch will publish a playable version of *Antagonist*.  If you add the MP3s into `sounds/`, the deployment will include audio as well.  The published site will typically be available at `https://itsjustQ.github.io/Antagonist/`.

### Credits

*Game design and original code:* **JustQ721** (via p5.js Web Editor)

*Porting and packaging for GitHub Pages:* This repository was assembled by extracting the code and assets from the p5.js Web Editor API and organising them into a standard web project structure.