# Anirban Ghosh — Portfolio V4

A static HTML/CSS/JavaScript portfolio with a dark editorial / cinematic visual system.

## Pages
- `index.html` — Home
- `about.html` — About + interactive curiosity map
- `work.html` — Engineering projects + case studies
- `teaching.html` — Computer science, robotics and chess teaching
- `chess.html` — Chess journey + interactive CSS 3D board
- `stories.html` — Audio storytelling + photo-led editorial section
- `notes.html` — Notes / journal
- `contact.html` — Contact form

## V4 changes
- Tighter vertical rhythm and less dead space.
- Explore dropdown opens deliberately on click instead of appearing unexpectedly on hover.
- Teaching now includes a personal photo-led editorial section and compact proof/stat blocks.
- Stories now includes a personal photo-led storytelling section and improved audio-library states.
- Work project media has stronger framing and hierarchy.
- Chess now contains a responsive CSS 3D board built with plain HTML/CSS/JS. It supports:
  - 3D and flat views
  - board flipping
  - pointer-based desktop perspective
  - selecting pieces and highlighted pseudo-legal moves
  - captures
  - pawn promotion to queen
  - reset and move log
- Contact page has a calmer, more stable composition.
- Mobile layouts were tightened for the new sections.

## Images
The V4 build uses the existing personal images in `images/`:
- `hero.jpeg`
- `about.jpeg`
- `logoag.png`

Additional project artwork is stored as SVG files in `images/`.

## Audio
The audio UI is ready for real MP3s. Add files under an `audio/` folder and set each story card's `data-audio` attribute, for example:

```html
<article class="audio-item" data-audio="audio/great-detectives-christmas.mp3">
```

## Contact form
The Google Apps Script endpoint from the previous build is retained in `script.js`. Replace it if the form backend changes.

## Run locally
Open `index.html` directly or serve the folder with a local web server, e.g.:

```bash
python -m http.server 8000
```
