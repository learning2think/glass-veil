/* Browser-local interactions. The exported catalog is calculated, not a BBB predictor. */
'use strict';
(() => {
  const catalog = window.ATLAS_CATALOG;
  const molecules = catalog.molecules;
  const $ = (id) => document.getElementById(id);
  const find = (id) => molecules.find((molecule) => molecule.id === id);
  const colors = ['#171717', '#555555', '#777777'];
  const metrics = [
    {
      key: 'mw',
      label: 'MW',
      unit: 'г/моль',
      title: 'Молекулярная масса',
      text: 'Сумма масс атомов структуры, включая водороды. Размер важен, но одной массы недостаточно для оценки переноса через ГЭБ.',
    },
    {
      key: 'logp',
      label: 'logP',
      unit: 'Crippen',
      title: 'Расчётная липофильность',
      text: 'RDKit Crippen logP — оценка распределения нейтральной структуры между октанолом и водой. Это не экспериментальный logP и не logD при pH 7,4.',
    },
    {
      key: 'tpsa',
      label: 'TPSA',
      unit: 'Å²',
      title: 'Полярная поверхность',
      text: 'Топологическая оценка полярной поверхности по атомным вкладам. Помогает сравнить полярность; отдельный порог TPSA не доказывает BBB+ или BBB−.',
    },
    {
      key: 'hbd',
      label: 'HBD',
      unit: 'доноры',
      title: 'Доноры водородных связей',
      text: 'Группы, способные отдавать водород для водородной связи, например OH и NH. Здесь использовано определение дескриптора RDKit.',
    },
    {
      key: 'hba',
      label: 'HBA',
      unit: 'акцепторы',
      title: 'Акцепторы водородных связей',
      text: 'Атомы, способные принимать водородную связь. Число зависит от химического окружения, поэтому это не просто сумма всех атомов N и O.',
    },
  ];
  const layers = [
    {
      id: 'endothelium',
      name: 'Эндотелий',
      english: 'Endothelial cells',
      description:
        'Внутренняя выстилка мозгового капилляра. Именно специализированные эндотелиальные клетки образуют основную барьерную поверхность между кровью и тканью мозга.',
      chemistry:
        'Для пассивного пути молекула должна взаимодействовать с клеточными мембранами. Размер, полярность и ионизация — лишь часть факторов, определяющих перенос.',
    },
    {
      id: 'junctions',
      name: 'Плотные контакты',
      english: 'Tight junctions',
      description:
        'Белковые комплексы соединяют соседние эндотелиальные клетки и ограничивают перемещение между ними.',
      chemistry:
        'Путь между клетками сильно ограничен. Для малой молекулы нельзя предполагать свободный проход через промежутки между эндотелиальными клетками.',
    },
    {
      id: 'pericyte',
      name: 'Перицит',
      english: 'Pericyte',
      description:
        'Клетка с отростками на наружной поверхности капилляра, связанная с базальной мембраной. Поддерживает сосуд и участвует в регуляции барьерных свойств.',
      chemistry:
        'Барьерные свойства зависят от взаимодействия клеток. Молекулярные дескрипторы сами по себе не описывают состояние этой системы.',
    },
    {
      id: 'membrane',
      name: 'Базальная мембрана',
      english: 'Basement membrane',
      description:
        'Сеть внеклеточного матрикса вокруг сосуда: коллаген, ламинины и другие компоненты. Это опорная оболочка; у неё нет дендритов или аксонов.',
      chemistry:
        'Матрикс поддерживает организацию сосудистой стенки. Его нельзя свести к одной липидной мембране или представить как единственный фильтр ГЭБ.',
    },
    {
      id: 'astrocyte',
      name: 'Ножки астроцита',
      english: 'Astrocyte endfeet',
      description:
        'Конечные участки отростков астроцита охватывают сосуд снаружи и участвуют в поддержании нейроваскулярной системы. На схеме показано их положение относительно сосуда.',
      chemistry:
        'Это отростки астроцита, а не аксоны нейрона. Астроциты поддерживают среду и барьер, но не заменяют эндотелиальную выстилку.',
    },
    {
      id: 'transporters',
      name: 'Транспортёры',
      english: 'Membrane transporters',
      description:
        'Мембранные белки переносят определённые вещества. На схеме показан эффлюкс: направление из эндотелиальной клетки в просвет сосуда, обратно к крови.',
      chemistry:
        'P-gp и BCRP могут ограничивать накопление некоторых веществ. Субстратность не определяется одним logP, а активный перенос требует отдельного анализа.',
    },
  ];

  const layerSources = {
    endothelium: { href: 'https://doi.org/10.1083/jcb.34.1.207', label: 'Reese & Karnovsky, 1967' },
    junctions: { href: 'https://doi.org/10.1083/jcb.200302070', label: 'Nitta et al., 2003' },
    pericyte: {
      href: 'https://www.nature.com/articles/nature09513',
      label: 'Daneman et al., 2010',
    },
    membrane: { href: 'https://www.nature.com/articles/ncomms4413', label: 'Yao et al., 2014' },
    astrocyte: { href: 'https://www.nature.com/articles/325253a0', label: 'Janzer & Raff, 1987' },
    transporters: {
      href: 'https://doi.org/10.1016/0092-8674(94)90212-7',
      label: 'Schinkel et al., 1994',
    },
  };

  function readStorage(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Atlas still works with storage blocked. */
    }
  }
  const savedCompare = readStorage('bbb-atlas:compare', null);
  let compare = Array.isArray(savedCompare)
    ? [...new Set(savedCompare.filter(find))].slice(0, 3)
    : ['caffeine', 'diazepam'];
  const savedSelected = readStorage('bbb-atlas:selected', 'caffeine');
  let selected = find(savedSelected) ? savedSelected : 'caffeine';
  let activeMetric = 'logp';
  let chartMode = 'bars';
  const chartViewport = window.matchMedia('(max-width: 580px)');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let requestedMotion = readStorage('bbb-atlas:motion', true) !== false;
  let motionEnabled = requestedMotion && !motionPreference.matches;
  let transportVisible = false;
  let toastTimer;
  const number = (value) =>
    Number.isInteger(value)
      ? String(value)
      : value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function toast(message) {
    $('toast').textContent = message;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      $('toast').hidden = true;
    }, 3200);
  }
  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function renderList() {
    const query = $('search').value.trim().toLocaleLowerCase('ru-RU');
    const visible = molecules.filter(
      (m) =>
        !query ||
        `${m.name} ${m.english} ${m.smiles} ${m.canonical}`
          .toLocaleLowerCase('ru-RU')
          .includes(query),
    );
    $('molecule-list').replaceChildren();
    if (!visible.length) {
      $('molecule-list').append(
        element(
          'p',
          'empty-state',
          'Совпадений нет. Попробуй название из каталога; произвольные структуры пока не рассчитываются.',
        ),
      );
    }
    for (const m of visible) {
      const button = element('button', 'molecule-item');
      button.type = 'button';
      button.dataset.moleculeId = m.id;
      button.setAttribute('aria-pressed', String(m.id === selected));
      button.setAttribute('aria-label', `Открыть карточку: ${m.name}`);
      button.append(
        element('span', 'list-number', String(molecules.indexOf(m) + 1).padStart(2, '0')),
      );
      const text = element('span');
      text.append(
        element('strong', '', m.name),
        element('small', '', `${m.english} / ${m.formula}`),
      );
      button.append(text);
      button.addEventListener('click', () => {
        selected = m.id;
        writeStorage('bbb-atlas:selected', selected);
        renderDossier();
        // Update selection in place, keeping keyboard focus on the chosen entry.
        for (const item of $('molecule-list').querySelectorAll('button'))
          item.setAttribute('aria-pressed', String(item === button));
      });
      $('molecule-list').append(button);
    }
  }
  function renderMetricDescription() {
    const metric = metrics.find((m) => m.key === activeMetric);
    const explanation = $('descriptor-explanation');
    explanation.replaceChildren(
      element('strong', '', `${metric.title}. `),
      document.createTextNode(metric.text),
    );
    for (const button of $('descriptors').querySelectorAll('button'))
      button.setAttribute('aria-pressed', String(button.dataset.metric === activeMetric));
  }
  function renderDossier() {
    const m = find(selected);
    $('molecule-topic').textContent = m.topic;
    $('molecule-name').textContent = m.name;
    $('molecule-subtitle').textContent = `${m.english.toUpperCase()} / ${m.formula} / CID ${m.cid}`;
    $('structure').src = `./structures/${m.id}.svg`;
    $('structure').alt = `Структурная формула: ${m.name}`;
    $('smiles').textContent = m.smiles;
    $('molecule-note').textContent = m.note;
    $('pubchem-link').href = `https://pubchem.ncbi.nlm.nih.gov/compound/${m.cid}`;
    $('descriptors').replaceChildren();
    for (const metric of metrics) {
      const button = element('button', 'descriptor');
      button.type = 'button';
      button.dataset.metric = metric.key;
      button.setAttribute(
        'aria-label',
        `${metric.title}: ${number(m[metric.key])} ${metric.unit}. Показать пояснение`,
      );
      button.append(
        element('span', '', metric.label),
        element('strong', '', number(m[metric.key])),
        element('small', '', metric.unit),
      );
      button.addEventListener('click', () => {
        activeMetric = metric.key;
        renderMetricDescription();
      });
      $('descriptors').append(button);
    }
    renderMetricDescription();
    renderAddCompare();
    const dossier = document.querySelector('.dossier');
    dossier.classList.remove('swap');
    // Restart a short transition when a different structure is selected.
    void dossier.offsetWidth;
    dossier.classList.add('swap');
    document.dispatchEvent(new CustomEvent('atlas:molecule', { detail: { id: m.id } }));
  }
  function renderAddCompare() {
    const button = $('add-compare');
    const added = compare.includes(selected);
    button.disabled = added;
    button.replaceChildren(
      document.createTextNode(added ? 'В сравнении' : 'Добавить к сравнению'),
      element('span', '', added ? '✓' : '＋'),
    );
  }
  function renderComparison() {
    $('compare-chips').replaceChildren();
    const selectedMolecules = compare.map(find);
    selectedMolecules.forEach((m, i) => {
      const chip = element('span', 'compare-chip');
      chip.style.setProperty('--chip-color', colors[i]);
      chip.append(document.createTextNode(m.name));
      const remove = element('button', '', '×');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Убрать из сравнения: ${m.name}`);
      remove.addEventListener('click', () => {
        compare = compare.filter((id) => id !== m.id);
        writeStorage('bbb-atlas:compare', compare);
        renderComparison();
        renderAddCompare();
      });
      chip.append(remove);
      $('compare-chips').append(chip);
    });
    if (!compare.length)
      $('compare-chips').append(
        element('p', 'comparison-empty', 'Добавь до трёх молекул из карточек выше.'),
      );
    const table = $('comparison-table');
    const header = element('tr');
    const first = element('th', '', 'Свойство');
    first.scope = 'col';
    header.append(first);
    for (const m of selectedMolecules) {
      const th = element('th', '', m.name);
      th.scope = 'col';
      header.append(th);
    }
    table.tHead.replaceChildren(header);
    const rows = [];
    for (const metric of [
      ...metrics,
      { key: 'rotatable', label: 'Вращаемые связи', unit: '' },
      { key: 'rings', label: 'Кольца', unit: '' },
    ]) {
      const row = element('tr');
      const heading = element(
        'th',
        '',
        `${metric.label}${['mw', 'tpsa'].includes(metric.key) ? `, ${metric.unit}` : ''}`,
      );
      heading.scope = 'row';
      row.append(heading);
      for (const m of selectedMolecules) row.append(element('td', '', number(m[metric.key])));
      rows.push(row);
    }
    table.tBodies[0].replaceChildren(...rows);
    renderBars(selectedMolecules);
    renderChart(selectedMolecules);
    renderInsight(selectedMolecules);
    $('clear-compare').disabled = !compare.length;
  }
  const scales = {
    mw: { min: 0, max: 500, description: 'Размер в числах: сумма масс атомов структуры.' },
    logp: {
      min: -2,
      max: 5,
      description:
        'Выше logP — больше предпочтение октанола относительно воды для нейтральной формы.',
    },
    tpsa: {
      min: 0,
      max: 120,
      description: 'Больше TPSA — больше расчётная площадь полярных участков.',
    },
    hbd: {
      min: 0,
      max: 4,
      description: 'Сколько групп могут отдавать водород для водородной связи.',
    },
    hba: { min: 0, max: 6, description: 'Сколько атомов могут принимать водородную связь.' },
  };
  function renderBars(items) {
    const container = $('property-bars');
    container.replaceChildren();
    if (!items.length) {
      container.append(
        element(
          'p',
          'comparison-empty',
          'Выбери молекулы выше — здесь появится сравнение их свойств.',
        ),
      );
      return;
    }
    for (const metric of metrics) {
      const scale = scales[metric.key];
      const article = element('article', 'property-card');
      const heading = element('div', 'property-card-head');
      heading.append(
        element('h4', '', metric.title),
        element('span', '', `${metric.label} / ${metric.unit}`),
      );
      article.append(heading, element('p', 'property-description', scale.description));
      const position = (value) => ((value - scale.min) / (scale.max - scale.min)) * 100;
      const zero = position(0);
      items.forEach((m, i) => {
        const value = m[metric.key];
        const row = element('div', 'bar-row');
        row.style.setProperty('--bar-color', colors[i]);
        row.setAttribute(
          'aria-label',
          `${m.name}: ${metric.label} ${number(value)} ${metric.unit}`,
        );
        row.append(element('span', 'bar-name', m.name));
        const track = element('div', 'bar-track');
        track.setAttribute('aria-hidden', 'true');
        const fill = element('span', 'bar-fill');
        fill.style.setProperty('--bar-left', `${Math.min(zero, position(value))}%`);
        fill.style.setProperty('--bar-width', `${Math.abs(position(value) - zero)}%`);
        fill.style.setProperty('--bar-origin', value < 0 ? 'right' : 'left');
        track.append(fill);
        if (scale.min < 0) {
          const marker = element('span', 'zero-line');
          marker.style.setProperty('--zero', `${zero}%`);
          track.append(marker);
        }
        row.append(track, element('span', 'bar-value', number(value)));
        article.append(row);
      });
      const axis = element('div', 'bar-scale');
      axis.setAttribute('aria-hidden', 'true');
      axis.append(element('span', '', number(scale.min)), element('span', '', number(scale.max)));
      if (scale.min < 0) axis.append(element('span', 'scale-zero', '0'));
      article.append(axis);
      container.append(article);
    }
  }
  function renderInsight(items) {
    if (!items.length) {
      $('comparison-insight').hidden = true;
      return;
    }
    $('comparison-insight').hidden = false;
    if (items.length === 1) {
      $('comparison-insight').textContent =
        `${items[0].name}: добавь ещё одну молекулу, чтобы увидеть различия на общем масштабе.`;
      return;
    }
    const [first, second] = items;
    const logDifference = second.logp - first.logp;
    const tpsaDifference = second.tpsa - first.tpsa;
    const logText =
      logDifference === 0
        ? 'такой же'
        : `на ${number(Math.abs(logDifference))} ${logDifference > 0 ? 'выше' : 'ниже'}`;
    const tpsaText =
      tpsaDifference === 0
        ? 'такая же'
        : `на ${number(Math.abs(tpsaDifference))} Å² ${tpsaDifference > 0 ? 'больше' : 'меньше'}`;
    $('comparison-insight').textContent =
      `${first.name} → ${second.name}: logP ${logText}, полярная поверхность ${tpsaText}. Эти различия не определяют проникновение через ГЭБ сами по себе.`;
  }
  function renderChart(items) {
    const svg = $('property-chart');
    const ns = 'http://www.w3.org/2000/svg';
    svg.replaceChildren();
    const add = (tag, attrs, text, parent = svg) => {
      const node = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
      if (text !== undefined) node.textContent = text;
      parent.append(node);
      return node;
    };
    const narrow = chartViewport.matches;
    const left = narrow ? 44 : 52;
    const right = narrow ? 388 : 734;
    const top = 24;
    const bottom = 284;
    svg.setAttribute('viewBox', narrow ? '0 0 420 320' : '0 0 760 320');
    const tickSize = narrow ? 18 : 13;
    const x = (value) => left + ((value + 2) / 7) * (right - left);
    const y = (value) => bottom - (value / 120) * (bottom - top);
    for (const value of [0, 30, 60, 90, 120]) {
      add('line', {
        x1: left,
        y1: y(value),
        x2: right,
        y2: y(value),
        stroke: '#d3d0c8',
        'stroke-dasharray': '3 6',
      });
      add(
        'text',
        {
          x: left - 14,
          y: y(value) + 5,
          fill: '#555555',
          'font-size': tickSize,
          'text-anchor': 'end',
          'font-family': 'monospace',
        },
        String(value),
      );
    }
    for (const value of [-2, -1, 0, 1, 2, 3, 4, 5]) {
      add('line', {
        x1: x(value),
        y1: top,
        x2: x(value),
        y2: bottom,
        stroke: '#d3d0c8',
        'stroke-dasharray': '2 7',
      });
      add(
        'text',
        {
          x: x(value),
          y: bottom + 25,
          fill: '#555555',
          'font-size': tickSize,
          'text-anchor': 'middle',
          'font-family': 'monospace',
        },
        String(value),
      );
    }
    add('path', {
      d: `M${left} ${top}V${bottom}H${right}`,
      stroke: '#777777',
      'stroke-width': 1.5,
      fill: 'none',
    });
    const key = $('map-molecules');
    key.replaceChildren();
    const markerRadius = narrow ? 17 : 12;
    const points = items.map((m) => ({ x: x(m.logp), y: y(m.tpsa) }));
    const badges = [];
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    let hasLeaders = false;
    items.forEach((m, i) => {
      const point = points[i];
      const crowded = points.some(
        (other, index) => index !== i && distance(point, other) < markerRadius * 2 + 6,
      );
      const offsets = crowded
        ? [
            [-38, -36],
            [38, -36],
            [-38, 36],
            [38, 36],
            [0, -60],
            [0, 60],
          ]
        : [[0, 0]];
      const candidates = offsets.map(([dx, dy]) => ({
        x: Math.max(left + markerRadius, Math.min(right - markerRadius, point.x + dx)),
        y: Math.max(top + markerRadius, Math.min(bottom - markerRadius, point.y + dy)),
      }));
      const badge =
        candidates.find(
          (candidate) =>
            badges.every((other) => distance(candidate, other) > markerRadius * 2 + 6) &&
            (!crowded ||
              points.every(
                (other, index) => index === i || distance(candidate, other) > markerRadius * 2 + 6,
              )),
        ) || candidates[0];
      badges.push(badge);
      const group = add('g', {
        class: 'chart-point',
        'data-molecule-id': m.id,
        tabindex: 0,
        role: 'button',
        'aria-label': `${m.name}: logP ${number(m.logp)}, TPSA ${number(m.tpsa)} Å². Открыть карточку.`,
      });
      add(
        'circle',
        {
          cx: badge.x,
          cy: badge.y,
          r: narrow ? 30 : 23,
          fill: 'transparent',
          class: 'chart-hit',
        },
        undefined,
        group,
      );
      if (crowded) {
        hasLeaders = true;
        add(
          'line',
          {
            x1: point.x,
            y1: point.y,
            x2: badge.x,
            y2: badge.y,
            stroke: colors[i],
            'stroke-width': 1,
          },
          undefined,
          group,
        );
        add(
          'circle',
          {
            cx: point.x,
            cy: point.y,
            r: 4,
            fill: colors[i],
            stroke: '#fff',
            'stroke-width': 1,
          },
          undefined,
          group,
        );
      }
      add(
        'circle',
        {
          cx: badge.x,
          cy: badge.y,
          r: markerRadius,
          fill: colors[i],
          stroke: '#fff',
          'stroke-width': 2,
          class: 'chart-marker',
        },
        undefined,
        group,
      );
      add(
        'text',
        {
          x: badge.x,
          y: badge.y,
          fill: '#fff',
          'font-size': narrow ? 18 : 13,
          'font-weight': 700,
          'font-family': 'var(--sans)',
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'pointer-events': 'none',
        },
        String(i + 1),
        group,
      );
      add('title', {}, `${m.name}: logP ${number(m.logp)}, TPSA ${number(m.tpsa)} Å²`, group);
      const entry = element('button', 'map-molecule');
      entry.type = 'button';
      entry.dataset.moleculeId = m.id;
      entry.style.setProperty('--point-color', colors[i]);
      entry.setAttribute('aria-label', `Открыть из сравнения: ${m.name}`);
      const marker = element('span', 'map-molecule-marker', String(i + 1));
      marker.setAttribute('aria-hidden', 'true');
      const values = element('span', 'map-molecule-copy');
      values.append(
        element('strong', '', m.name),
        element('span', '', `logP ${number(m.logp)} · TPSA ${number(m.tpsa)} Å²`),
      );
      entry.append(marker, values);
      key.append(entry);
      const inspect = () => {
        $('chart-inspector').textContent =
          `${m.name} · logP ${number(m.logp)} · TPSA ${number(m.tpsa)} Å² · MW ${number(m.mw)} г/моль`;
        for (const button of key.children) button.classList.toggle('is-active', button === entry);
      };
      const open = () => {
        selected = m.id;
        writeStorage('bbb-atlas:selected', selected);
        renderDossier();
        renderList();
        inspect();
        toast(`Открыта карточка: ${m.name}`);
      };
      group.addEventListener('pointerenter', inspect);
      group.addEventListener('focus', inspect);
      group.addEventListener('click', open);
      entry.addEventListener('pointerenter', inspect);
      entry.addEventListener('focus', inspect);
      entry.addEventListener('click', open);
      group.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
    if (!items.length)
      key.append(element('p', 'map-empty', 'Выбери молекулы в каталоге и добавь их к сравнению.'));
    $('chart-inspector').textContent = items.length
      ? `Номер соответствует молекуле в списке.${hasLeaders ? ' Линия от номера указывает точное положение близких точек.' : ''} Нажми на точку или название, чтобы открыть карточку.`
      : 'Добавь молекулы к сравнению, чтобы построить карту.';
  }
  function setChartMode(mode) {
    chartMode = mode;
    $('property-bars').hidden = mode !== 'bars';
    $('scatter-panel').hidden = mode !== 'map';
    $('bars-mode').setAttribute('aria-pressed', String(mode === 'bars'));
    $('map-mode').setAttribute('aria-pressed', String(mode === 'map'));
    $('chart-mode-description').textContent =
      mode === 'map'
        ? 'Положение точки показывает соотношение липофильности и полярной поверхности.'
        : 'Название рядом с полосой указывает вещество, длина — значение свойства.';
  }
  $('bars-mode').addEventListener('click', () => setChartMode('bars'));
  $('map-mode').addEventListener('click', () => setChartMode('map'));
  chartViewport.addEventListener('change', () => renderChart(compare.map(find)));

  const routes = {
    passive: {
      path: 'M290 158L290 387',
      color: '#171717',
      start: [290, 158],
      direction: 'Кровь → через клетку → ткань мозга',
      description:
        'Условный путь пассивной диффузии пересекает обе мембраны эндотелиальной клетки.',
      layer: 'endothelium',
    },
    efflux: {
      path: 'M462 285L462 153',
      color: '#171717',
      start: [462, 285],
      direction: 'Эндотелиальная клетка → обратно в кровь',
      description:
        'Эффлюксный транспортёр выводит субстрат из клетки в просвет сосуда. Субстратность выбранного вещества здесь не рассчитывается.',
      layer: 'transporters',
    },
    junction: {
      path: 'M339 157L339 245',
      color: '#171717',
      start: [339, 157],
      direction: 'Кровь → промежуток между клетками → ограничение',
      description:
        'Плотный контакт ограничивает парацеллюлярный перенос. На схеме путь останавливается перед контактом.',
      layer: 'junctions',
    },
  };
  function renderRouteTrace(id, route) {
    const trace = $('route-trace');
    const ns = 'http://www.w3.org/2000/svg';
    const shape = (tag, attributes, text) => {
      const node = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
      if (text) node.textContent = text;
      return node;
    };
    trace.replaceChildren();
    trace.setAttribute('aria-label', route.direction);
    const defs = shape('defs', {});
    const arrow = shape('marker', {
      id: 'trace-arrow',
      viewBox: '0 0 10 10',
      refX: 8,
      refY: 5,
      markerWidth: 5,
      markerHeight: 5,
      orient: 'auto',
    });
    arrow.append(shape('path', { d: 'M0 0L10 5L0 10Z', fill: '#65536f' }));
    defs.append(arrow);
    trace.append(defs, shape('rect', { x: 175, y: 16, width: 70, height: 52, fill: '#eeebf0' }));
    trace.append(
      shape('path', {
        d: id === 'junction' ? 'M45 42H205' : 'M45 42H375',
        class: 'route-trace-line',
        'marker-end': id === 'junction' ? '' : 'url(#trace-arrow)',
      }),
    );
    const labels =
      id === 'efflux'
        ? ['Эндотелий', 'Транспортёр', 'Кровь']
        : id === 'junction'
          ? ['Кровь', 'Контакт', 'Перенос ограничен']
          : ['Кровь', 'Эндотелий', 'Ткань мозга'];
    for (const [index, x] of [45, 210, 375].entries()) {
      if (id !== 'junction' || index === 0) {
        trace.append(shape('circle', { cx: x, cy: 42, r: 5, class: 'route-trace-node' }));
      }
      const label = shape(
        'text',
        {
          x: index === 0 ? 15 : index === 2 ? 405 : x,
          y: 90,
          'text-anchor': index === 0 ? 'start' : index === 2 ? 'end' : 'middle',
          class: 'route-trace-label',
        },
        id === 'junction' && index === 2 ? '' : labels[index],
      );
      if (id === 'junction' && index === 2) {
        label.append(
          shape('tspan', { x: 405, y: 77 }, 'Перенос'),
          shape('tspan', { x: 405, dy: 20 }, 'ограничен'),
        );
      }
      trace.append(label);
    }
    if (id === 'junction') {
      trace.append(shape('path', { d: 'M210 25V59', class: 'route-trace-stop' }));
    }
  }
  function selectRoute(id) {
    const route = routes[id];
    const ns = 'http://www.w3.org/2000/svg';
    const flow = $('transport-flow');
    flow.replaceChildren();
    const halo = document.createElementNS(ns, 'path');
    for (const [key, value] of Object.entries({
      d: route.path,
      stroke: '#faf9f4',
      'stroke-width': 10,
      fill: 'none',
    }))
      halo.setAttribute(key, String(value));
    flow.append(halo);
    const path = document.createElementNS(ns, 'path');
    for (const [key, value] of Object.entries({
      d: route.path,
      stroke: route.color,
      'stroke-width': 4,
      fill: 'none',
      class: 'flow-route',
      'marker-end': id === 'junction' ? '' : 'url(#route-arrow)',
    }))
      path.setAttribute(key, String(value));
    flow.append(path);
    // Several staggered particles keep the selected mechanism readable over time.
    for (let i = 0; i < 3; i++) {
      const group = document.createElementNS(ns, 'g');
      group.setAttribute('class', 'flow-particle');
      const particle = document.createElementNS(ns, 'circle');
      for (const [key, value] of Object.entries({
        r: 6,
        fill: route.color,
        stroke: '#faf9f4',
        'stroke-width': 2,
      }))
        particle.setAttribute(key, String(value));
      group.append(particle);
      const motion = document.createElementNS(ns, 'animateMotion');
      for (const [key, value] of Object.entries({
        path: route.path,
        dur: '4.5s',
        begin: `${-i * 1.5}s`,
        repeatCount: 'indefinite',
        calcMode: 'linear',
      }))
        motion.setAttribute(key, value);
      if (id === 'junction') {
        motion.setAttribute('keyPoints', '0;1;1;0');
        motion.setAttribute('keyTimes', '0;.42;.64;1');
      }
      group.append(motion);
      flow.append(group);
    }
    const svg = document.querySelector('.barrier-svg');
    svg.dataset.route = id;
    if (typeof svg.setCurrentTime === 'function') svg.setCurrentTime(0);
    if (id === 'junction') {
      const stop = document.createElementNS(ns, 'path');
      for (const [key, value] of Object.entries({
        d: 'M328 253H350',
        stroke: '#171717',
        'stroke-width': 7,
      }))
        stop.setAttribute(key, String(value));
      flow.append(stop);
    }
    if (id !== 'passive') {
      const pulse = document.createElementNS(ns, 'rect');
      const bounds =
        id === 'junction'
          ? { x: 330, y: 237, width: 18, height: 31 }
          : { x: 450, y: 227, width: 24, height: 35 };
      for (const [key, value] of Object.entries({
        ...bounds,
        rx: 4,
        fill: 'none',
        stroke: '#171717',
        'stroke-width': 2,
      }))
        pulse.setAttribute(key, String(value));
      const animation = document.createElementNS(ns, 'animate');
      for (const [key, value] of Object.entries({
        attributeName: 'stroke-width',
        values: '1;3;1',
        dur: '2.25s',
        repeatCount: 'indefinite',
      }))
        animation.setAttribute(key, value);
      pulse.append(animation);
      flow.append(pulse);
    }
    $('route-description').textContent = route.description;
    $('route-direction').textContent = route.direction;
    renderRouteTrace(id, route);
    for (const button of document.querySelectorAll('button[data-route]'))
      button.setAttribute('aria-pressed', String(button.dataset.route === id));
    selectLayer(route.layer);
    syncMotion();
  }
  for (const button of document.querySelectorAll('button[data-route]'))
    button.addEventListener('click', () => selectRoute(button.dataset.route));
  function syncMotion() {
    motionEnabled = requestedMotion && !motionPreference.matches;
    document.body.dataset.motion = motionEnabled ? 'on' : 'off';
    const button = $('motion-toggle');
    button.setAttribute('aria-pressed', String(motionEnabled));
    button.setAttribute(
      'aria-label',
      motionEnabled ? 'Анимация включена. Приостановить' : 'Анимация выключена. Включить',
    );
    button.replaceChildren(
      document.createTextNode('Движение '),
      element('span', '', motionEnabled ? 'Вкл' : 'Выкл'),
    );
    const svg = document.querySelector('.barrier-svg');
    svg.dataset.motion = motionEnabled && transportVisible && !document.hidden ? 'on' : 'off';
    $('transport-status').textContent = motionEnabled
      ? 'Условное движение частиц'
      : 'Движение приостановлено';
    if (typeof svg.pauseAnimations === 'function') {
      if (svg.dataset.motion === 'on') svg.unpauseAnimations();
      else svg.pauseAnimations();
    }
  }
  $('motion-toggle').addEventListener('click', () => {
    if (motionPreference.matches) {
      toast('Уменьшение движения включено в системных настройках.');
      return;
    }
    requestedMotion = !requestedMotion;
    writeStorage('bbb-atlas:motion', requestedMotion);
    syncMotion();
  });
  motionPreference.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  new IntersectionObserver(
    ([entry]) => {
      transportVisible = entry.isIntersecting;
      syncMotion();
    },
    { threshold: 0.1 },
  ).observe(document.querySelector('.barrier-svg'));
  function selectLayer(id) {
    const layer = layers.find((item) => item.id === id);
    $('layer-index').textContent = String(layers.indexOf(layer) + 1).padStart(2, '0');
    $('layer-english').textContent = layer.english;
    $('layer-title').textContent = layer.name;
    $('layer-description').textContent = layer.description;
    $('layer-chemistry').textContent = layer.chemistry;
    const source = layerSources[id];
    $('layer-source').href = source.href;
    $('layer-source').textContent = source.label;
    document.querySelector('.barrier-svg').classList.add('has-selection');
    for (const part of document.querySelectorAll('.anatomy-layer'))
      part.classList.toggle('active', part.dataset.layer === id);
    for (const button of $('layer-tabs').querySelectorAll('button'))
      button.setAttribute('aria-pressed', String(button.dataset.layer === id));
  }
  for (const layer of layers) {
    const button = element('button', 'layer-tab');
    button.append(
      element('span', 'layer-tab-index', String(layers.indexOf(layer) + 1).padStart(2, '0')),
      element('span', 'layer-tab-name', layer.name),
    );
    button.type = 'button';
    button.dataset.layer = layer.id;
    button.addEventListener('click', () => selectLayer(layer.id));
    $('layer-tabs').append(button);
  }
  for (const part of document.querySelectorAll('.anatomy-layer'))
    part.addEventListener('click', () => selectLayer(part.dataset.layer));
  $('search').addEventListener('input', renderList);
  $('add-compare').addEventListener('click', () => {
    if (compare.includes(selected)) return;
    if (compare.length >= 3) {
      toast('В сравнении уже три молекулы. Убери одну кнопкой ×.');
      return;
    }
    compare.push(selected);
    writeStorage('bbb-atlas:compare', compare);
    renderComparison();
    renderAddCompare();
    toast(`${find(selected).name} добавлен(а) к сравнению`);
  });
  $('clear-compare').addEventListener('click', () => {
    compare = [];
    writeStorage('bbb-atlas:compare', compare);
    renderComparison();
    renderAddCompare();
  });
  $('copy-smiles').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(find(selected).smiles);
      toast('SMILES скопирован');
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents($('smiles'));
      selection.removeAllRanges();
      selection.addRange(range);
      toast('SMILES выделен — нажми Ctrl+C или выбери «Копировать».');
    }
  });
  renderList();
  renderDossier();
  renderComparison();
  selectRoute('passive');
  setChartMode(chartMode);
})();
