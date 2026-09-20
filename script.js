/* =========================================================
   ANIRBAN GHOSH — PORTFOLIO V4 INTERACTIONS
   ========================================================= */
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const dropdowns = document.querySelectorAll('.nav-dropdown');
const nested = document.querySelectorAll('.nested-dropdown');
const cursorGlow = document.querySelector('.cursor-glow');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 40);
}, {passive:true});

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
}

dropdowns.forEach(drop => {
  const trigger = drop.querySelector('.dropdown-trigger');
  trigger?.addEventListener('click', e => {
    e.preventDefault();
    const willOpen = !drop.classList.contains('open');
    dropdowns.forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded','false');
    });
    drop.classList.toggle('open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
});

nested.forEach(item => {
  const trigger = item.querySelector('.nested-trigger');
  trigger?.addEventListener('click', e => {
    e.preventDefault();
    item.classList.toggle('open');
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.nav-dropdown')) {
    dropdowns.forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded','false');
    });
  }
});

document.querySelectorAll('.main-nav a').forEach(a => {
  a.addEventListener('click', () => {
    mainNav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded','false');
  });
});

/* Reveal-on-scroll. */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Desktop cursor glow. */
if (cursorGlow) {
  window.addEventListener('pointermove', e => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }, {passive:true});
}

/* Mind-map highlighting. */
const mindLines = document.querySelectorAll('.mind-line');
document.querySelectorAll('.mind-node').forEach(node => {
  const key = node.dataset.node;
  const setActive = active => {
    node.classList.toggle('active', active);
    mindLines.forEach(line => line.classList.toggle('active', active && line.dataset.for === key));
  };
  node.addEventListener('mouseenter', () => setActive(true));
  node.addEventListener('mouseleave', () => setActive(false));
  node.addEventListener('focus', () => setActive(true));
  node.addEventListener('blur', () => setActive(false));
});

/* =========================================================
   AUDIO LIBRARY
   Add data-audio="audio/file.mp3" to an item when the file exists.
   ========================================================= */
let activeAudio = null;
let activeItem = null;

document.querySelectorAll('.audio-item').forEach(item => {
  const button = item.querySelector('.play-button');
  const source = item.dataset.audio?.trim();
  if (!button) return;

  if (!source) {
    button.addEventListener('click', () => {
      item.classList.add('is-unavailable');
      const status = item.querySelector('.audio-status');
      if (status) {
        const old = status.textContent;
        status.textContent = 'ADD MP3 IN /audio TO ENABLE PLAYBACK';
        setTimeout(() => status.textContent = old, 2600);
      }
    });
    return;
  }

  button.addEventListener('click', () => {
    const absolute = new URL(source, location.href).href;
    if (!activeAudio || activeAudio.src !== absolute) {
      activeAudio?.pause();
      activeItem?.classList.remove('is-playing');
      document.querySelectorAll('.play-button').forEach(b => b.innerHTML = '<i class="fa-solid fa-play"></i>');
      activeAudio = new Audio(source);
      activeItem = item;
      activeAudio.addEventListener('ended', () => {
        item.classList.remove('is-playing');
        button.innerHTML = '<i class="fa-solid fa-play"></i>';
      });
    }
    if (activeAudio.paused) {
      activeAudio.play();
      item.classList.add('is-playing');
      button.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      activeAudio.pause();
      item.classList.remove('is-playing');
      button.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });
});

/* =========================================================
   CONTACT FORM
   ========================================================= */
const form = document.querySelector('#contactForm');
const msg = document.querySelector('#msg');
if (form) {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwcTwIsE3mb904ij6dkJoMdjZz0JKEC9BGMUuzYKs0EHxsSnvlpy7Lul_cH1GJCbc0T/exec';
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (msg) msg.textContent = 'Sending…';
    try {
      await fetch(scriptURL, {method:'POST', body:new FormData(form), mode:'no-cors'});
      if (msg) msg.textContent = 'Message sent successfully.';
      form.reset();
      setTimeout(() => { if (msg) msg.textContent = ''; }, 5000);
    } catch (err) {
      console.error(err);
      if (msg) msg.textContent = 'Something went wrong. Please try again.';
    }
  });
}

/* =========================================================
   CSS-3D CHESS BOARD
   Plain HTML/CSS/JS — no chess library.
   The move engine deliberately handles piece movement/captures/promotion,
   but does not attempt full check/checkmate validation.
   ========================================================= */
/* =========================================================
   CHESS LAB — V4
   Plain HTML / CSS / JavaScript
   Piece movement, captures, promotion and board interaction.
   Does not attempt full check/checkmate validation.
   ========================================================= */

const boardEl = document.querySelector('#chessBoard');

if (boardEl) {

  const files = ['a','b','c','d','e','f','g','h'];

  const glyph = {
    w: {
      k:'♔',
      q:'♕',
      r:'♖',
      b:'♗',
      n:'♘',
      p:'♙'
    },
    b: {
      k:'♚',
      q:'♛',
      r:'♜',
      b:'♝',
      n:'♞',
      p:'♟'
    }
  };

  const initial = [
    ['br','bn','bb','bq','bk','bb','bn','br'],
    ['bp','bp','bp','bp','bp','bp','bp','bp'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['wp','wp','wp','wp','wp','wp','wp','wp'],
    ['wr','wn','wb','wq','wk','wb','wn','wr']
  ];

  let position = initial.map(row => row.slice());

  let selected = null;
  let moveHistory = [];

  let flipped = false;
  let flat = false;

  let lastMove = null;

  const squareName = (r,c) =>
    `${files[c]}${8-r}`;

  const sameColor = (a,b) =>
    a && b && a[0] === b[0];

  const inside = (r,c) =>
    r >= 0 &&
    r < 8 &&
    c >= 0 &&
    c < 8;


  /* =========================================================
     MOVE ENGINE
     ========================================================= */

  function pseudoMoves(r,c){

    const piece = position[r][c];

    if (!piece) return [];

    const color = piece[0];
    const type = piece[1];

    const moves = [];

    const add = (rr,cc) => {

      if (!inside(rr,cc)) return false;

      const target = position[rr][cc];

      if (!target){
        moves.push([rr,cc]);
        return true;
      }

      if (!sameColor(piece,target)){
        moves.push([rr,cc]);
      }

      return false;
    };


    const slide = dirs => {

      dirs.forEach(([dr,dc]) => {

        let rr = r + dr;
        let cc = c + dc;

        while (inside(rr,cc)){

          if (!add(rr,cc)) break;

          rr += dr;
          cc += dc;
        }
      });
    };


    /* Pawn */

    if(type === 'p'){

      const dir =
        color === 'w' ? -1 : 1;

      const start =
        color === 'w' ? 6 : 1;

      if(
        inside(r + dir,c) &&
        !position[r + dir][c]
      ){

        moves.push([r + dir,c]);

        if(
          r === start &&
          !position[r + 2 * dir][c]
        ){
          moves.push([r + 2 * dir,c]);
        }
      }


      [-1,1].forEach(dc => {

        const rr = r + dir;
        const cc = c + dc;

        if(
          inside(rr,cc) &&
          position[rr][cc] &&
          !sameColor(
            piece,
            position[rr][cc]
          )
        ){
          moves.push([rr,cc]);
        }
      });
    }


    /* Knight */

    else if(type === 'n'){

      [
        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1]
      ].forEach(([dr,dc]) =>
        add(r + dr,c + dc)
      );
    }


    /* Bishop */

    else if(type === 'b'){

      slide([
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1]
      ]);
    }


    /* Rook */

    else if(type === 'r'){

      slide([
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
      ]);
    }


    /* Queen */

    else if(type === 'q'){

      slide([
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1],
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
      ]);
    }


    /* King */

    else if(type === 'k'){

      [
        [-1,-1],
        [-1,0],
        [-1,1],
        [0,-1],
        [0,1],
        [1,-1],
        [1,0],
        [1,1]
      ].forEach(([dr,dc]) =>
        add(r + dr,c + dc)
      );
    }

    return moves;
  }


  /* =========================================================
     BOARD TRANSFORMATION
     
     IMPORTANT:
     Flip the board by changing DISPLAY ORDER,
     not by rotating the entire board.
     
     This keeps the chess pieces upright.
     ========================================================= */

  function getDisplaySquare(r,c){

    if(!flipped){
      return [r,c];
    }

    return [
      7-r,
      7-c
    ];
  }


  /* =========================================================
     RENDER
     ========================================================= */

  function render(){

    boardEl.innerHTML = '';

    const displayPosition = [];

    for(let displayR = 0; displayR < 8; displayR++){

      displayPosition[displayR] = [];

      for(let displayC = 0; displayC < 8; displayC++){

        const logicalR =
          flipped ? 7-displayR : displayR;

        const logicalC =
          flipped ? 7-displayC : displayC;

        displayPosition[displayR][displayC] = {
          r:logicalR,
          c:logicalC
        };
      }
    }


    /* Draw squares */

    for(let displayR = 0; displayR < 8; displayR++){

      for(let displayC = 0; displayC < 8; displayC++){

        const {
          r,
          c
        } = displayPosition[displayR][displayC];

        const sq =
          document.createElement('button');

        sq.type = 'button';

        sq.className =
          `chess-square ${
            (r+c)%2===0
              ? 'light'
              : 'dark'
          }`;

        sq.dataset.r = r;
        sq.dataset.c = c;


        /* Selected */

        if(
          selected &&
          selected[0] === r &&
          selected[1] === c
        ){
          sq.classList.add('selected');
        }


        /* Last move */

        if(lastMove){

          const isFrom =
            lastMove.from[0] === r &&
            lastMove.from[1] === c;

          const isTo =
            lastMove.to[0] === r &&
            lastMove.to[1] === c;

          if(isFrom || isTo){
            sq.classList.add('last-move');
          }
        }


        /* Legal destinations */

        if(selected){

          const moves =
            pseudoMoves(
              selected[0],
              selected[1]
            );

          const allowed =
            moves.some(
              ([rr,cc]) =>
                rr === r &&
                cc === c
            );

          if(allowed){

            if(position[r][c]){
              sq.classList.add('capture');
            }
            else{
              sq.classList.add('legal');
            }
          }
        }


        /* Piece */

        const piece =
          position[r][c];

        if(piece){

          const span =
            document.createElement('span');

          span.className =
            `chess-piece ${
              piece[0] === 'b'
                ? 'black'
                : 'white'
            }`;

          span.textContent =
            glyph[piece[0]][piece[1]];

          span.setAttribute(
            'aria-hidden',
            'true'
          );

          sq.appendChild(span);
        }


        sq.addEventListener(
          'click',
          () => handleSquare(r,c)
        );

        boardEl.appendChild(sq);
      }
    }


    /* =====================================================
       Coordinates
       ===================================================== */

    const coord =
      document.createElement('div');

    coord.className =
      'board-coordinates';


    /* Files */

    for(let displayC = 0; displayC < 8; displayC++){

      const logicalC =
        flipped
          ? 7-displayC
          : displayC;

      const s =
        document.createElement('span');

      s.className =
        'board-file';

      s.style.left =
        `${displayC * 12.5 + 6.25}%`;

      s.textContent =
        files[logicalC];

      coord.appendChild(s);
    }


    /* Ranks */

    for(let displayR = 0; displayR < 8; displayR++){

      const logicalR =
        flipped
          ? 7-displayR
          : displayR;

      const s =
        document.createElement('span');

      s.className =
        'board-rank';

      s.style.top =
        `${displayR * 12.5 + 6.25}%`;

      s.textContent =
        8-logicalR;

      coord.appendChild(s);
    }

    boardEl.appendChild(coord);


    /* =====================================================
       Move log
       ===================================================== */

    const list =
      document.querySelector('#moveList');

    if(list){

      list.innerHTML =
        moveHistory.length

          ? moveHistory
              .map(
                (m,i) =>
                  `<b>${i+1}. ${m}</b>`
              )
              .join('')

          : '<b>Start position</b>';
    }
  }


  /* =========================================================
     CLICK / MOVE HANDLING
     ========================================================= */

  function handleSquare(r,c){

    const piece =
      position[r][c];


    /* Nothing selected */

    if(!selected){

      if(piece){

        selected = [r,c];

        render();
      }

      return;
    }


    const moves =
      pseudoMoves(
        selected[0],
        selected[1]
      );


    const allowed =
      moves.some(
        ([rr,cc]) =>
          rr === r &&
          cc === c
      );


    /* Valid move */

    if(allowed){

      const [sr,sc] =
        selected;

      const moving =
        position[sr][sc];


      const captured =
        position[r][c];


      position[r][c] =
        moving;

      position[sr][sc] =
        null;


      /* Promotion */

      let promotion = '';

      if(
        moving[1] === 'p' &&
        (r === 0 || r === 7)
      ){

        position[r][c] =
          moving[0] + 'q';

        promotion = '=Q';
      }


      const capture =
        !!captured;


      const notation =
        `${squareName(sr,sc)}–${squareName(r,c)}${
          capture ? '×' : ''
        }${promotion}`;


      moveHistory.push(notation);


      lastMove = {
        from:[sr,sc],
        to:[r,c]
      };


      selected = null;

      render();

      return;
    }


    /* Select another friendly piece */

    if(
      piece &&
      selected &&
      piece[0] ===
      position[selected[0]][selected[1]][0]
    ){

      selected = [r,c];

      render();

      return;
    }


    /* Otherwise deselect */

    selected = null;

    render();
  }


  /* =========================================================
     RESET
     ========================================================= */

  function reset(){

    position =
      initial.map(row => row.slice());

    selected = null;

    moveHistory = [];

    lastMove = null;

    render();
  }


  /* =========================================================
     BOARD VIEW STATE
     ========================================================= */

  function updateViewButtons(){

    const threeD =
      document.querySelector('#board3d');

    const flatButton =
      document.querySelector('#boardFlat');


    threeD?.classList.toggle(
      'active',
      !flat
    );

    flatButton?.classList.toggle(
      'active',
      flat
    );
  }


  function applyBoardTransform(){

    if(flat){

      boardEl.style.setProperty(
        '--board-rx',
        '0deg'
      );

      boardEl.style.setProperty(
        '--board-rz',
        '0deg'
      );

      return;
    }


    boardEl.style.setProperty(
      '--board-rx',
      '47deg'
    );

    boardEl.style.setProperty(
      '--board-rz',
      '-2deg'
    );
  }


  /* =========================================================
     3D BUTTON
     ========================================================= */

  document
    .querySelector('#board3d')
    ?.addEventListener('click', () => {

      flat = false;

      boardEl.classList.remove('flat');

      updateViewButtons();

      applyBoardTransform();
    });


  /* =========================================================
     FLAT BUTTON
     ========================================================= */

  document
    .querySelector('#boardFlat')
    ?.addEventListener('click', () => {

      flat = true;

      boardEl.classList.add('flat');

      updateViewButtons();

      applyBoardTransform();
    });


  /* =========================================================
     FLIP BUTTON
     ========================================================= */

  document
    .querySelector('#boardFlip')
    ?.addEventListener('click', () => {

      flipped = !flipped;

      /*
       * Notice:
       * We DON'T rotate the board.
       *
       * render() reverses the logical board order
       * while keeping the pieces upright.
       */

      render();
    });


  /* =========================================================
     RESET BUTTON
     ========================================================= */

  document
    .querySelector('#boardReset')
    ?.addEventListener(
      'click',
      reset
    );


  /* =========================================================
     MOUSE-CONTROLLED 3D CAMERA
     ========================================================= */

  const stage =
    document.querySelector('.board-stage');


  stage?.addEventListener(
    'pointermove',
    e => {

      if(
        flat ||
        window.matchMedia(
          '(max-width: 900px)'
        ).matches
      ){
        return;
      }


      const rect =
        stage.getBoundingClientRect();


      const x =
        (e.clientX - rect.left) /
        rect.width - .5;

      const y =
        (e.clientY - rect.top) /
        rect.height - .5;


      const rx =
        47 - y * 10;

      const rz =
        -2 + x * 8;


      boardEl.style.setProperty(
        '--board-rx',
        `${rx}deg`
      );

      boardEl.style.setProperty(
        '--board-rz',
        `${rz}deg`
      );
    }
  );


  stage?.addEventListener(
    'pointerleave',
    () => {

      if(flat) return;

      boardEl.style.setProperty(
        '--board-rx',
        '47deg'
      );

      boardEl.style.setProperty(
        '--board-rz',
        '-2deg'
      );
    }
  );


  /* =========================================================
     INITIALISE
     ========================================================= */

  updateViewButtons();

  applyBoardTransform();

  render();
}