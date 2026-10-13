/* Perspective sketches follow scroll and settle with a short, finite interpolation. */
'use strict';
(() => {
  const root = document.getElementById('zoom');
  const canvas = document.getElementById('micro-canvas');
  let ctx = canvas.getContext('2d');
  if (!ctx) return;
  const mainContext = ctx;
  const makeLayer = () => {
    const surface = document.createElement('canvas');
    return { canvas: surface, context: surface.getContext('2d') };
  };
  const sceneLayers = [makeLayer(), makeLayer()];
  const paperLayer = makeLayer();
  if (!paperLayer.context || sceneLayers.some((layer) => !layer.context)) return;
  const $ = (id) => document.getElementById(id);
  const catalog = window.ATLAS_CATALOG.molecules;
  let molecule =
    catalog.find(
      (m) =>
        m.id === document.querySelector('.molecule-item[aria-pressed=true]')?.dataset.moleculeId,
    ) || catalog[0];
  const stageSources = [
    { href: 'https://doi.org/10.1083/jcb.34.1.207', label: 'Reese & Karnovsky, 1967' },
    { href: 'https://doi.org/10.1083/jcb.200302070', label: 'Nitta et al., 2003' },
    { href: 'https://doi.org/10.1126/science.175.4023.720', label: 'Singer & Nicolson, 1972' },
    {
      href: 'https://www.rdkit.org/docs/GettingStartedInPython.html#working-with-3d-molecules',
      label: 'Метод построения: RDKit',
    },
  ];
  const stages = [
    {
      name: 'Мозговой капилляр',
      label: 'КАПИЛЛЯР',
      text: 'Эндотелий отделяет просвет сосуда от ткани мозга. Снаружи расположены базальная мембрана и поддерживающие клетки.',
      focus: 'Приближаем участок сосудистой стенки.',
      scene: vessel,
    },
    {
      name: 'Эндотелиальные клетки',
      label: 'ЭНДОТЕЛИЙ',
      text: 'Плотные контакты соединяют соседние клетки и ограничивают перенос между ними. Базальная мембрана расположена снаружи эндотелия.',
      focus: 'Следующий уровень — плазматическая мембрана клетки.',
      scene: cells,
    },
    {
      name: 'Липидный бислой',
      label: 'КЛЕТОЧНАЯ МЕМБРАНА',
      text: 'Полярные головки липидов обращены к водной среде. Гидрофобные хвосты образуют внутреннюю часть бислоя. В мембране находятся белки.',
      focus: 'Переходим к структуре малой молекулы.',
      scene: bilayer,
    },
    {
      name: 'Молекулярная структура',
      label: 'МОЛЕКУЛА',
      text: '',
      focus:
        'Шаро-стержневая схема. Водороды опущены. Перенос через мембрану здесь не рассчитывается.',
      scene: molecular,
    },
  ];
  let width = 800,
    height = 450,
    pending = false,
    active = -1,
    shownMolecule = '';
  let selectedProgress = null;
  let displayedProgress = null;
  let lastFrameTime = null;
  let anchorScroll = false;
  let scrollOrigin = {
    progress: 0,
    y: Math.max(0, root.getBoundingClientRect().top + window.scrollY - 18),
  };
  let queue = [],
    camera,
    zoom = 1;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const ease = (n) => {
    n = clamp(n);
    return n * n * (3 - 2 * n);
  };
  const mix = (a, b, t) => a + (b - a) * t;
  const mixTone = (a, b, t) => {
    const channels = (color) => color.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16));
    const destination = channels(b);
    return `rgb(${channels(a)
      .map((value, i) => Math.round(mix(value, destination[i], t)))
      .join(' ')})`;
  };
  const v = (x, y, z) => [x, y, z];

  // A restrained print palette changes surfaces, never the projected geometry or labels.
  let atmosphere = document.body.classList.contains('atmosphere-on');
  const printTones = {
    '#e5e4df': '#dedbe3',
    '#c5c4bf': '#b9b1c2',
    '#e1e0da': '#d8d3df',
    '#bcbab4': '#c3bdc9',
    '#aaa8a1': '#a59baa',
    '#eeece5': '#e9e6ed',
    '#c8c5bd': '#cdc6d4',
    '#d7d4cc': '#dbd5e1',
    '#bab7af': '#a99ab2',
    '#bbb9b2': '#afa3b6',
    '#e7e3da': '#dfd9e5',
    '#aaa69e': '#a693b3',
    '#777': '#76687f',
    '#666': '#6e6178',
  };
  const printTone = (color) => (atmosphere ? printTones[color] || color : color);

  // Static manga screen tone, clipped to the same scientific surfaces.
  const screenTile = document.createElement('canvas');
  screenTile.width = screenTile.height = 6;
  const screenContext = screenTile.getContext('2d');
  let screenTone = null;
  if (screenContext) {
    screenContext.fillStyle = '#24251e33';
    screenContext.beginPath();
    screenContext.arc(1, 1, 0.65, 0, Math.PI * 2);
    screenContext.fill();
    screenTone = ctx.createPattern(screenTile, 'repeat');
  }

  function fillScreenTone() {
    if (!atmosphere || !screenTone) return;
    ctx.fillStyle = screenTone;
    ctx.fill();
  }

  function project(point) {
    let [x, y, z] = point.map((n, i) => n - camera.focus[i]);
    const ya = y * Math.cos(camera.pitch) - z * Math.sin(camera.pitch);
    const za = y * Math.sin(camera.pitch) + z * Math.cos(camera.pitch);
    const xa = x * Math.cos(camera.yaw) + za * Math.sin(camera.yaw);
    const zb = -x * Math.sin(camera.yaw) + za * Math.cos(camera.yaw);
    const perspective = 10 / Math.max(2, 10 - zb);
    const unit = Math.min(width, height) * 0.135 * zoom * perspective;
    return { x: width * 0.5 + xa * unit, y: height * 0.51 - ya * unit, z: zb, unit };
  }
  function poly(
    points,
    fill = '#e9e7e0',
    stroke = '#242424',
    hatch = false,
    lineWidth = 0.9,
    screen = true,
  ) {
    const p = points.map(project);
    queue.push({
      z: p.reduce((sum, n) => sum + n.z, 0) / p.length,
      draw() {
        ctx.beginPath();
        p.forEach((n, i) => (i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y)));
        ctx.closePath();
        ctx.fillStyle = printTone(fill);
        ctx.fill();
        if (screen) fillScreenTone();
        if (hatch) {
          ctx.save();
          ctx.clip();
          ctx.strokeStyle = '#5d5d5d';
          ctx.lineWidth = 0.45;
          const minX = Math.max(-height, Math.min(...p.map((n) => n.x))),
            maxX = Math.min(width + height, Math.max(...p.map((n) => n.x)));
          const minY = Math.max(0, Math.min(...p.map((n) => n.y))),
            maxY = Math.min(height, Math.max(...p.map((n) => n.y)));
          for (let x = minX - (maxY - minY); x < maxX; x += 9) {
            ctx.beginPath();
            ctx.moveTo(x, maxY);
            ctx.lineTo(x + maxY - minY, minY);
            ctx.stroke();
          }
          ctx.restore();
        }
        if (stroke) {
          strokeContour(p, stroke, lineWidth, true);
        }
      },
    });
  }
  function strokeContour(points, color, weight, closed = false, dash = []) {
    ctx.save();
    ctx.strokeStyle = printTone(color);
    ctx.lineWidth = weight;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.setLineDash(dash);
    ctx.beginPath();
    points.forEach((point, i) => (i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
    if (closed) ctx.closePath();
    ctx.stroke();

    // Pen pressure follows the original contour; geometry and bond counts stay intact.
    if (atmosphere && !dash.length && weight >= 0.8 && points.length > 1) {
      const start = (points.length - 1) * 0.55;
      const end = (points.length - 1) * 0.8;
      const sample = (position) => {
        const index = Math.floor(position);
        const a = points[index];
        const b = points[Math.min(index + 1, points.length - 1)];
        return { x: mix(a.x, b.x, position - index), y: mix(a.y, b.y, position - index) };
      };
      const segment = [
        sample(start),
        ...points.slice(Math.ceil(start), Math.floor(end) + 1),
        sample(end),
      ];
      const length = segment
        .slice(1)
        .reduce(
          (total, point, i) => total + Math.hypot(point.x - segment[i].x, point.y - segment[i].y),
          0,
        );
      if (length > 18) {
        ctx.lineWidth = weight * 1.3;
        ctx.beginPath();
        segment.forEach((point, i) =>
          i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y),
        );
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function line(points, color = '#222', weight = 1.5, dash = []) {
    const p = points.map(project);
    queue.push({
      z: p.reduce((sum, n) => sum + n.z, 0) / p.length,
      draw() {
        strokeContour(p, color, weight, false, dash);
      },
    });
  }
  function sphere(center, radius, fill = '#e7e5de', label = '', aspect = [1, 1]) {
    const p = project(center);
    const r = radius * p.unit;
    queue.push({
      z: p.z + radius * 0.12,
      draw() {
        const rx = r * aspect[0],
          ry = r * aspect[1];
        if (p.x + rx < 0 || p.x - rx > width || p.y + ry < 0 || p.y - ry > height) return;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, rx, ry, -0.12, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = printTone(fill);
        ctx.fill();
        fillScreenTone();
        ctx.fillStyle = '#00000022';
        ctx.beginPath();
        ctx.ellipse(p.x + rx * 0.58, p.y + ry * 0.44, rx * 0.9, ry * 1.15, -0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, rx, ry, -0.12, 0, Math.PI * 2);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1.15;
        ctx.stroke();
        if (label && r > 7) {
          ctx.font = `700 ${Math.max(9, Math.min(15, r * 0.95))}px "PT Sans", Arial`;
          ctx.fillStyle = '#181818';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, p.x, p.y);
        }
      },
    });
  }
  function box(x0, x1, y0, y1, z0, z1, hatch = false) {
    poly([v(x0, y0, z0), v(x1, y0, z0), v(x1, y1, z0), v(x0, y1, z0)], '#bcbab4', '#444', hatch);
    poly([v(x0, y0, z0), v(x1, y0, z0), v(x1, y0, z1), v(x0, y0, z1)], '#aaa8a1', '#333', true);
    poly([v(x0, y1, z0), v(x1, y1, z0), v(x1, y1, z1), v(x0, y1, z1)], '#eeece5', '#333');
    poly([v(x0, y0, z0), v(x0, y1, z0), v(x0, y1, z1), v(x0, y0, z1)], '#c8c5bd', '#333');
    poly([v(x1, y0, z0), v(x1, y1, z0), v(x1, y1, z1), v(x1, y0, z1)], '#d7d4cc', '#333');
    poly([v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1)], '#f0eee8', '#333', hatch);
  }
  function vessel(t) {
    camera = {
      pitch: 0.17,
      yaw: 0.55,
      focus: [mix(0, -0.7, t), mix(0, 0.18, t), mix(0, 0.5, t)],
    };
    zoom = mix(width < 600 ? 1.35 : 2.05, 3.1, ease(t));
    const start = -2.9;
    const end = 2.9;
    const radius = 0.82;
    const wall = 0.09;
    const cuts = 48;
    const sections = 16;
    const ring = (x, r, angle) => {
      const curve = 0.07 * (1 - (x / end) ** 2);
      const taper = 1 + 0.025 * Math.cos((x / end) * Math.PI);
      return v(x, curve + r * taper * Math.cos(angle), r * taper * Math.sin(angle));
    };
    const alongWall = (from, to, r, angle) =>
      Array.from({ length: sections + 1 }, (_, i) => ring(mix(from, to, i / sections), r, angle));
    const windowStart = -1.45;
    const windowEnd = 1.45;
    const upperEdge = 0.18;
    const lowerEdge = 2.28;
    const inWindow = (x, angle) =>
      x > windowStart && x < windowEnd && angle > upperEdge && angle < lowerEdge;

    // A closed vessel with one local cutaway, rather than an entire unrolled half-wall.
    for (let j = 0; j < sections; j++) {
      const x0 = mix(start, end, j / sections);
      const x1 = mix(start, end, (j + 1) / sections);
      for (let i = 0; i < cuts; i++) {
        const a = (i / cuts) * Math.PI * 2;
        const b = ((i + 1) / cuts) * Math.PI * 2;
        const middle = (a + b) / 2;
        if (inWindow((x0 + x1) / 2, middle)) continue;
        const tone = mixTone(
          printTone('#e5e4df'),
          printTone('#eeece5'),
          (Math.cos(middle) + 1) / 2,
        );
        poly(
          [ring(x0, radius, a), ring(x1, radius, a), ring(x1, radius, b), ring(x0, radius, b)],
          tone,
          null,
          false,
          0.9,
          false,
        );
        poly(
          [
            ring(x0, radius - wall, a),
            ring(x1, radius - wall, a),
            ring(x1, radius - wall, b),
            ring(x0, radius - wall, b),
          ],
          '#f0efea',
          null,
          false,
          0.9,
          false,
        );
      }
    }

    for (const x of [start, end]) {
      const outer = [];
      const inner = [];
      for (let i = 0; i <= cuts; i++) {
        const a = (i / cuts) * Math.PI * 2;
        outer.push(ring(x, radius, a));
        inner.push(ring(x, radius - wall, a));
        if (i < cuts) {
          const b = ((i + 1) / cuts) * Math.PI * 2;
          poly(
            [
              ring(x, radius, a),
              ring(x, radius, b),
              ring(x, radius - wall, b),
              ring(x, radius - wall, a),
            ],
            '#e1e0da',
            null,
            false,
            0.9,
            false,
          );
        }
      }
      line(outer, '#333', 1.25);
      line(inner, '#777', 0.85);
    }

    // Ink contours distinguish the outer wall, its basal outline and the cut edge.
    for (const a of [0, Math.PI]) {
      line(alongWall(start, end, radius, a), '#222', 1.4);
      line(alongWall(start, end, radius + 0.05, a), '#777', 0.6);
    }
    for (const x of [windowStart, windowEnd]) {
      const edge = [];
      for (let i = 0; i <= 22; i++) edge.push(ring(x, radius, mix(upperEdge, lowerEdge, i / 22)));
      line(edge, '#333', 1.05);
    }
    for (const a of [upperEdge, lowerEdge]) {
      line(alongWall(windowStart, windowEnd, radius, a), '#333', 1.05);
    }

    // A few short ink hatches follow the surface, leaving the cutaway readable.
    for (const x of [-2.65, -2.48, -2.31, -2.14, 2.05, 2.22, 2.39, 2.56]) {
      line([ring(x, radius + 0.006, 2.55), ring(x + 0.1, radius + 0.006, 2.96)], '#666', 0.6);
      if (atmosphere)
        line(
          [ring(x + 0.05, radius + 0.008, 2.65), ring(x + 0.1, radius + 0.008, 2.86)],
          '#333',
          0.35,
        );
    }

    // Short seams and flattened nuclei sit on the wall, outside the lumen.
    for (const x of [-2.1, 2.1]) {
      const seam = [];
      for (let i = 0; i <= 24; i++) seam.push(ring(x, radius + 0.005, (i / 24) * Math.PI));
      line(seam, '#666', 0.65);
    }
    sphere(ring(-2.12, radius + 0.02, 0.28), 0.13, '#a7a6a0', '', [1.7, 0.5]);
    sphere(ring(2.08, radius + 0.02, 0.25), 0.13, '#a7a6a0', '', [1.7, 0.5]);

    // Blood cells are visible through the local window, with flat biconcave linework.
    for (const x of [-0.9, 0.45]) {
      const point = project(v(x, -0.04, 0.1));
      queue.push({
        z: point.z,
        draw() {
          const rx = point.unit * 0.36;
          const ry = point.unit * 0.2;
          ctx.beginPath();
          ctx.ellipse(point.x, point.y, rx, ry, -0.2, 0, Math.PI * 2);
          ctx.fillStyle = '#c2c1bb';
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1.05;
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(point.x, point.y, rx * 0.48, ry * 0.44, -0.2, 0, Math.PI * 2);
          ctx.fillStyle = '#f0efea';
          ctx.fill();
          ctx.lineWidth = 0.65;
          ctx.stroke();
        },
      });
    }

    // Supporting cells remain on the abluminal surface; no floating stick-like feet.
    line([v(-2, 0.92, -0.12), v(-1.45, 1.03, -0.1), v(-0.75, 0.92, -0.12)], '#666', 1.7);
    sphere(v(-1.45, 1.02, -0.1), 0.12, '#bbb9b2', '', [1.7, 0.45]);
    for (const x of [-1.65, 1.8]) {
      sphere(v(x, -0.9, 0.05), 0.17, '#d2d0c8', '', [1.75, 0.33]);
      line([v(x, -0.95, 0.05), v(x + 0.05, -1.12, 0.08), v(x + 0.18, -1.29, 0.12)], '#777', 1.3);
    }
  }
  function cells(t) {
    camera = { pitch: 0.38, yaw: -0.38, focus: [0, mix(0, 0.12, t), mix(0, 0.12, t)] };
    zoom = mix(1.05, 2.4, ease(t));
    box(-3.4, 3.4, -1.8, 1.8, -0.85, -0.74, true);
    box(-3.2, -0.09, -1.5, 1.5, -0.17, 0.13);
    box(0.09, 3.2, -1.5, 1.5, -0.17, 0.13);
    sphere(v(-1.68, 0.1, 0.2), 0.46, '#bab7af', '', [1.6, 0.8]);
    sphere(v(1.7, -0.15, 0.2), 0.46, '#bab7af', '', [1.6, 0.8]);
    for (let y = -1.35; y <= 1.4; y += 0.18) {
      line([v(-0.12, y, 0.17), v(0.12, y + 0.03, 0.17)], '#111', 3);
      sphere(v(0, y, 0.17), 0.045, '#222');
    }
    line([v(0, -1.48, 0.16), v(0, 1.48, 0.16)], '#222', 1.2);
  }
  function bilayer(t) {
    camera = { pitch: 0.26, yaw: -0.39, focus: [mix(0, -0.65, t), 0, mix(0, 0.45, t)] };
    zoom = mix(1.15, 2.4, ease(t));
    for (let ix = 0; ix < 13; ix++)
      for (let iz = 0; iz < 5; iz++) {
        const x = (ix - 6) * 0.45,
          z = (iz - 2) * 0.47;
        if (Math.abs(x - 1.1) < 0.5 && Math.abs(z) < 0.55) continue;
        for (const sign of [-1, 1]) {
          sphere(v(x, sign * 0.65, z), 0.14, '#e7e3da');
          line(
            [
              v(x - 0.04, sign * 0.52, z),
              v(x - 0.11, sign * 0.26, z + 0.045),
              v(x - 0.055, sign * 0.04, z),
            ],
            '#252525',
            1.5,
          );
          line(
            [
              v(x + 0.05, sign * 0.52, z),
              v(x + 0.13, sign * 0.28, z - 0.035),
              v(x + 0.11, sign * 0.04, z),
            ],
            '#252525',
            1.5,
          );
        }
      }
    for (const y of [-0.44, 0, 0.44]) sphere(v(1.1, y, 0.04), 0.37, '#aaa69e', '', [1, 1.2]);
    line([v(-2.75, 0.83, -1.2), v(2.75, 0.83, -1.2)], '#666', 0.75, [2, 4]);
    line([v(-2.75, -0.83, -1.2), v(2.75, -0.83, -1.2)], '#666', 0.75, [2, 4]);
  }
  function molecular(t) {
    camera = { pitch: 0.18, yaw: mix(-0.45, 0.1, t), focus: [0, 0, 0] };
    zoom = mix(1.35, 1.7, ease(t));
    const model = molecule.model3d;
    if (!model) return;
    const count = model.atoms.length;
    const center = [0, 1, 2].map(
      (axis) => model.atoms.reduce((sum, a) => sum + a.position[axis], 0) / count,
    );
    const extent = Math.max(
      ...model.atoms.flatMap((a) => a.position.map((n, i) => Math.abs(n - center[i]))),
      1,
    );
    const positions = model.atoms.map((a) =>
      a.position.map((n, i) => ((n - center[i]) * 2.5) / extent),
    );
    const projected = positions.map(project);
    const halfX = Math.max(...projected.map((p) => Math.abs(p.x - width * 0.5)), 1);
    const halfY = Math.max(...projected.map((p) => Math.abs(p.y - height * 0.51)), 1);
    zoom *= Math.min(1, (width * 0.5 - 25) / halfX, (height * 0.49 - 25) / halfY);
    for (const bond of model.bonds) {
      const a = positions[bond.a],
        b = positions[bond.b];
      line([a, b], '#2a2a2a', 3.4);
      queue[queue.length - 1].z = -1000;
      if (bond.order >= 1.5) {
        const offset = 0.065;
        line(
          [v(a[0], a[1] + offset, a[2]), v(b[0], b[1] + offset, b[2])],
          '#333',
          1.1,
          bond.order === 1.5 ? [3, 3] : [],
        );
        queue[queue.length - 1].z = -1000;
      }
    }
    model.atoms.forEach((a, i) =>
      sphere(
        positions[i],
        a.element === 'C' ? 0.17 : 0.205,
        a.element === 'O' ? '#aaa69d' : a.element === 'N' ? '#d4d0c6' : '#eeeae1',
        a.element,
      ),
    );
  }
  function drawScene(index, t, layerIndex) {
    queue = [];
    stages[index].scene(t);
    queue.sort((a, b) => a.z - b.z);
    const layer = sceneLayers[layerIndex];
    ctx = layer.context;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    try {
      // Render opaque scientific surfaces before blending complete scene layers.
      ctx.globalAlpha = 1;
      for (const item of queue) item.draw();
    } finally {
      ctx.restore();
      ctx = mainContext;
    }
    return layer.canvas;
  }

  function drawPaperBehind(layers) {
    const paper = paperLayer.context;
    paper.clearRect(0, 0, paperLayer.canvas.width, paperLayer.canvas.height);
    for (const layer of layers) paper.drawImage(layer, 0, 0);
    paper.globalCompositeOperation = 'source-in';
    paper.fillStyle = '#fff';
    paper.fillRect(0, 0, paperLayer.canvas.width, paperLayer.canvas.height);
    paper.globalCompositeOperation = 'source-over';

    ctx.save();
    // The halo softens the boundary; the exact silhouette keeps the landscape out of surfaces.
    ctx.globalAlpha = 0.65;
    ctx.filter = 'blur(10px)';
    ctx.drawImage(paperLayer.canvas, 0, 0, width, height);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    ctx.drawImage(paperLayer.canvas, 0, 0, width, height);
    ctx.restore();
  }

  function blendScene(layer, opacity) {
    if (opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(layer, 0, 0, width, height);
    ctx.restore();
  }
  function render(timestamp) {
    pending = false;
    atmosphere = document.body.classList.contains('atmosphere-on');
    const bounds = root.getBoundingClientRect();
    if (document.hidden || bounds.bottom < 0 || bounds.top > window.innerHeight) {
      displayedProgress = null;
      lastFrameTime = null;
      return;
    }
    const distance = Math.max(300, root.offsetHeight * 0.6);
    const targetProgress =
      selectedProgress ??
      (scrollOrigin
        ? clamp(
            scrollOrigin.progress +
              (window.scrollY - scrollOrigin.y) / Math.max(300, root.offsetHeight * 0.6),
          )
        : clamp(-bounds.top / distance));
    const motion = document.body.dataset.motion !== 'off';
    const elapsed = lastFrameTime === null ? 16 : Math.min(48, timestamp - lastFrameTime);
    if (!motion || displayedProgress === null) displayedProgress = targetProgress;
    else displayedProgress = mix(displayedProgress, targetProgress, 1 - Math.exp(-elapsed / 80));
    const settling = Math.abs(targetProgress - displayedProgress) > 0.001;
    if (!settling) displayedProgress = targetProgress;
    lastFrameTime = settling && motion ? timestamp : null;
    const progress = displayedProgress;
    const phase = progress * 3.65;
    const index = Math.min(3, Math.floor(phase));
    const part = index === 3 ? clamp((phase - 3) / 0.65) : phase - index;
    ctx.clearRect(0, 0, width, height);
    // Zoom into the current surface, then resolve the next schematic level.
    const reveal = index < 3 && motion ? ease((part - 0.45) / 0.55) : 0;
    const currentLayer = drawScene(index, motion ? part : 0, 0);
    const nextLayer = reveal ? drawScene(index + 1, 0, 1) : null;
    if (atmosphere) drawPaperBehind(nextLayer ? [currentLayer, nextLayer] : [currentLayer]);
    blendScene(currentLayer, 1 - reveal);
    if (nextLayer) blendScene(nextLayer, reveal);
    const shown = reveal > 0.55 ? index + 1 : index;
    root.dataset.level = String(shown);
    $('zoom-progress-fill').style.width = `${progress * 100}%`;
    if (active !== shown || (shown === 3 && shownMolecule !== molecule.id)) {
      active = shown;
      shownMolecule = molecule.id;
      const stage = stages[shown];
      const source = stageSources[shown];
      $('zoom-source').href = source.href;
      $('zoom-source').textContent = source.label;
      $('zoom-number').textContent = String(shown + 1).padStart(2, '0');
      $('zoom-name').textContent = shown === 3 ? molecule.name : stage.name;
      $('zoom-description').textContent =
        shown === 3
          ? `${molecule.formula}. ${molecule.model3d?.method.includes('2D') ? 'Плоские координаты RDKit: 3D-конформер не получен.' : 'Конформер структуры из SMILES, построенный RDKit.'}`
          : stage.text;
      $('zoom-focus').textContent = stage.focus;
      $('zoom-frame-level').textContent = stage.label;
      canvas.setAttribute(
        'aria-label',
        `${shown === 3 ? molecule.name : stage.name}. ${shown === 3 ? 'Шаро-стержневая структура молекулы.' : stage.text}`,
      );
      for (const button of document.querySelectorAll('[data-zoom-level]'))
        button.setAttribute('aria-pressed', String(Number(button.dataset.zoomLevel) === shown));
    }
    // Stop drawing as soon as the target is reached; there is no ambient animation loop.
    if (settling && motion) schedule();
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(render);
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const layer of [...sceneLayers, paperLayer]) {
      layer.canvas.width = canvas.width;
      layer.canvas.height = canvas.height;
    }
    for (const layer of sceneLayers) layer.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    schedule();
  }
  for (const button of document.querySelectorAll('[data-zoom-level]'))
    button.addEventListener('click', () => {
      const level = Number(button.dataset.zoomLevel);
      selectedProgress = level === 3 ? 0.94 : (level + 0.04) / 3.65;
      scrollOrigin = { progress: selectedProgress, y: window.scrollY };
      schedule();
    });
  document.addEventListener('atlas:molecule', (event) => {
    const next = catalog.find((m) => m.id === event.detail.id);
    if (next) {
      molecule = next;
      active = -1;
      schedule();
    }
  });
  new MutationObserver(schedule).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-motion', 'class'],
  });
  new ResizeObserver(resize).observe(canvas);
  for (const link of document.querySelectorAll('a[href="#zoom"]'))
    link.addEventListener('click', () => {
      selectedProgress = 0;
      scrollOrigin = null;
      anchorScroll = true;
      schedule();
      setTimeout(() => {
        anchorScroll = false;
      }, 100);
    });
  window.addEventListener(
    'scroll',
    () => {
      if (anchorScroll) scrollOrigin = { progress: 0, y: window.scrollY };
      else selectedProgress = null;
      const bounds = root.getBoundingClientRect();
      if (bounds.bottom < 0) scrollOrigin = null;
      schedule();
    },
    { passive: true },
  );
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  resize();
})();
