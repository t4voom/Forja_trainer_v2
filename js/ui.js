/* FORJA Trainer — componentes de interface: ícones extras, toast, modal, gráficos, tabela e formatação */
(function (global) {
  'use strict';
  const { U } = global;
  const { esc, icon } = U;

  // Ícones do Dashboard que o app não tinha (mesmo traço fino, 24×24)
  Object.assign(U.ICONS, {
    grid: '<rect x="3.75" y="3.75" width="7" height="7" rx="2"/><rect x="13.25" y="3.75" width="7" height="7" rx="2"/><rect x="3.75" y="13.25" width="7" height="7" rx="2"/><rect x="13.25" y="13.25" width="7" height="7" rx="2"/>',
    users: '<circle cx="9" cy="8.5" r="3.25"/><path d="M3 19.25c.9-3 3.2-4.5 6-4.5s5.1 1.5 6 4.5"/><path d="M15.5 5.6a3.25 3.25 0 0 1 0 5.8M17.5 14.9c1.7.6 2.9 2 3.5 4.35"/>',
    building: '<path d="M4.75 20.25V5.75a2 2 0 0 1 2-2h6.5a2 2 0 0 1 2 2v14.5M15.25 9.75h2a2 2 0 0 1 2 2v8.5M3.25 20.25h17.5"/><path d="M8.25 7.75h3M8.25 11.25h3M8.25 14.75h3"/>',
    whistle: '<circle cx="9" cy="14" r="5.25"/><path d="M13.5 11.25 20.25 8V5.75h-9.5v3.5"/><circle cx="9" cy="14" r="1" fill="currentColor"/>',
    alert: '<path d="M12 4.25 21 19.75H3z"/><path d="M12 10v4.25M12 17v.01"/>',
    arrowLeft: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
    refresh: '<path d="M19.25 12a7.25 7.25 0 1 1-2.12-5.13"/><path d="M19.25 4.75v4.5h-4.5"/>',
    note: '<path d="M5.75 3.75h9l3.5 3.5v13H5.75z"/><path d="M14.75 3.75v3.5h3.5M8.75 12h6.5M8.75 15.5h4.5"/>',
    key: '<circle cx="8" cy="15.5" r="3.75"/><path d="m10.75 12.75 8.5-8.5M16.5 7l2.5 2.5M14.25 9.25l1.75 1.75"/>',
    login: '<path d="M9.75 4.75h-3a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h3"/><path d="M14 16.25 18.25 12 14 7.75M18.25 12H8.5"/>',
    moon: '<path d="M19.5 14.5A7.75 7.75 0 0 1 9.5 4.5a7.75 7.75 0 1 0 10 10z"/>',
    activity: '<path d="M3.75 12h3.5l2.5-6.5 4.5 13 2.5-6.5h3.5"/>'
  });

  /* ---------- Formatação ---------- */
  const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const F = {
    kg: (v) => (v == null || v === '' ? '—' : `${nf1.format(v)} kg`),
    cm: (v) => (v == null || v === '' ? '—' : `${nf2.format(v / 100)} m`),
    meters: (v) => (v == null || v === '' ? '—' : nf2.format(v / 100)),
    age: (v) => (v == null ? '—' : `${v} anos`),
    num: (v) => (v == null ? '—' : nf1.format(v)),
    date: (v) => (v ? new Date(v).toLocaleDateString('pt-BR') : '—'),
    dateTime: (v) => {
      if (!v) return '—';
      const d = new Date(v);
      return `${d.toLocaleDateString('pt-BR')} · ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    },
    // "agora", "há 5 min", "há 3 h", "ontem", "há 4 dias", depois a data
    ago: (v) => {
      if (!v) return '—';
      const s = (Date.now() - new Date(v).getTime()) / 1000;
      if (s < 60) return 'agora';
      if (s < 3600) return `há ${Math.floor(s / 60)} min`;
      if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
      if (s < 172800) return 'ontem';
      if (s < 86400 * 30) return `há ${Math.floor(s / 86400)} dias`;
      return new Date(v).toLocaleDateString('pt-BR');
    },
    initials: (name) => String(name || '?').trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?',
    // Classificação da OMS para adultos
    bmiClass: (v) => (v == null ? '' : v < 18.5 ? 'Abaixo do peso' : v < 25 ? 'Peso normal' : v < 30 ? 'Sobrepeso' : 'Obesidade'),
    scheme: (x) => `${x.sets} × ${x.repMin === x.repMax ? x.repMin : `${x.repMin}–${x.repMax}`}`
  };

  /* ---------- Toast ---------- */
  function toast(message, { error = false, duration = 3200 } = {}) {
    const el = U.h(`<div class="toast ${error ? 'is-error' : ''}" role="status">${icon(error ? 'alert' : 'check', { size: 18, stroke: 2.2 })}<span>${esc(message)}</span></div>`);
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 220); }, duration);
  }

  /* ---------- Modal ---------- */
  function modal({ title, sub = '', body, foot = null, size = '' }) {
    const back = U.h(`
      <div class="modal-back" role="presentation">
        <section class="modal ${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
          <header class="modal-head">
            <div><h2 class="modal-title">${esc(title)}</h2>${sub ? `<p class="card-sub mt-1">${esc(sub)}</p>` : ''}</div>
            <button type="button" class="icon-btn" data-close aria-label="Fechar">${icon('close', { size: 18, stroke: 2 })}</button>
          </header>
          <div class="modal-body"></div>
          ${foot ? '<footer class="modal-foot"></footer>' : ''}
        </section>
      </div>`);
    back.querySelector('.modal-body').append(body);
    if (foot) back.querySelector('.modal-foot').append(foot);
    const prev = document.activeElement;
    const close = () => { back.remove(); document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    back.addEventListener('mousedown', (e) => { if (e.target === back) close(); });
    back.querySelector('[data-close]').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(back);
    const first = back.querySelector('input, textarea, select');
    setTimeout(() => (first || back.querySelector('[data-close]')).focus(), 30);
    return { el: back, close };
  }

  function confirm({ title, message, confirmLabel = 'Confirmar', danger = false }) {
    return new Promise((resolve) => {
      const body = U.h(`<p class="muted">${esc(message)}</p>`);
      const foot = U.h(`<div class="row-flex"><button type="button" class="btn btn-ghost" data-no>Cancelar</button><button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-yes>${esc(confirmLabel)}</button></div>`);
      const m = modal({ title, body, foot, size: 'is-sm' });
      let done = false;
      const finish = (v) => { if (done) return; done = true; m.close(); resolve(v); };
      foot.querySelector('[data-no]').addEventListener('click', () => finish(false));
      foot.querySelector('[data-yes]').addEventListener('click', () => finish(true));
      m.el.querySelector('[data-close]').addEventListener('click', () => finish(false));
      setTimeout(() => foot.querySelector('[data-yes]').focus(), 40);
    });
  }

  /* ---------- Controles ---------- */
  function segmented(options, value, onChange, label = '') {
    const el = U.h(`<div class="seg" role="group" aria-label="${esc(label)}">${options.map((o) => `<button type="button" data-v="${esc(o.value)}" aria-pressed="${o.value === value}">${esc(o.label)}</button>`).join('')}</div>`);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]');
      if (!b) return;
      el.querySelectorAll('[data-v]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      onChange(b.dataset.v);
    });
    return el;
  }

  const meterClass = (value, max) => (max && value >= max ? 'is-full' : max && value / max >= 0.9 ? 'is-warn' : '');
  const meterHTML = (value, max) => `<div class="meter ${meterClass(value, max)}" role="meter" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${value}"><span style="width:${max ? Math.min(100, (value / max) * 100) : 0}%"></span></div>`;

  function statusPill(status) {
    return status === 'ATIVO' ? '<span class="pill is-success">Ativo</span>' : '<span class="pill">Inativo</span>';
  }

  function emptyHTML(iconName, title, text = '') {
    return `<div class="empty"><div class="empty-icon">${icon(iconName, { size: 22 })}</div><p class="empty-title">${esc(title)}</p>${text ? `<p>${esc(text)}</p>` : ''}</div>`;
  }

  /* ---------- Gráfico de linha (peso) ----------
     points: [{ data, pesoKg }] em ordem de data. Desenha área suave, eixos discretos e dica ao passar o mouse. */
  function lineChart(points, { height = 240 } = {}) {
    const wrap = U.h('<div class="chart"></div>');
    if (points.length < 2) {
      wrap.innerHTML = emptyHTML('chart', points.length ? 'Só uma pesagem até agora' : 'Sem pesagens registradas', 'O gráfico aparece a partir de duas pesagens feitas pelo aluno no app.');
      return wrap;
    }
    const W = 720, H = height, P = { l: 44, r: 16, t: 16, b: 28 };
    const xs = points.map((p) => new Date(p.data).getTime());
    const ys = points.map((p) => p.pesoKg);
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    let y0 = Math.min(...ys), y1 = Math.max(...ys);
    const pad = Math.max(0.5, (y1 - y0) * 0.2);
    y0 = Math.floor(y0 - pad); y1 = Math.ceil(y1 + pad);
    const X = (t) => P.l + (x1 === x0 ? (W - P.l - P.r) / 2 : ((t - x0) / (x1 - x0)) * (W - P.l - P.r));
    const Y = (v) => P.t + (1 - (v - y0) / (y1 - y0)) * (H - P.t - P.b);
    const pts = points.map((p, i) => [X(xs[i]), Y(p.pesoKg)]);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
    const area = `${line}L${pts[pts.length - 1][0].toFixed(1)},${H - P.b}L${pts[0][0].toFixed(1)},${H - P.b}Z`;
    const ticks = 4;
    const grid = Array.from({ length: ticks + 1 }, (_, i) => {
      const v = y0 + ((y1 - y0) * i) / ticks;
      return `<line class="chart-grid" x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="chart-axis" x="${P.l - 8}" y="${Y(v) + 4}" text-anchor="end">${nf1.format(v)}</text>`;
    }).join('');
    const labelIdx = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])];
    const xLabels = labelIdx.map((i) => `<text class="chart-axis" x="${pts[i][0]}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}">${new Date(xs[i]).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</text>`).join('');
    wrap.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução do peso: de ${nf1.format(ys[0])} kg para ${nf1.format(ys[ys.length - 1])} kg">
        <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity="0.22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
        ${grid}${xLabels}
        <path class="chart-area" d="${area}"/>
        <path class="chart-line" d="${line}"/>
        ${points.length <= 24 ? pts.map((p) => `<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="3.5"/>`).join('') : ''}
        <circle class="chart-hover" r="5" cx="0" cy="0" opacity="0"/>
      </svg>
      <div class="chart-tip" hidden></div>`;
    const svg = wrap.querySelector('svg');
    const dot = wrap.querySelector('.chart-hover');
    const tip = wrap.querySelector('.chart-tip');
    svg.addEventListener('mousemove', (e) => {
      const r = svg.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * W;
      let best = 0;
      pts.forEach((p, i) => { if (Math.abs(p[0] - mx) < Math.abs(pts[best][0] - mx)) best = i; });
      const [px, py] = pts[best];
      dot.setAttribute('cx', px); dot.setAttribute('cy', py); dot.setAttribute('opacity', '1');
      tip.hidden = false;
      tip.style.left = `${(px / W) * 100}%`;
      tip.style.top = `${(py / H) * r.height}px`;
      tip.innerHTML = `<strong class="num">${nf1.format(points[best].pesoKg)} kg</strong>${F.date(points[best].data)}`;
    });
    svg.addEventListener('mouseleave', () => { tip.hidden = true; dot.setAttribute('opacity', '0'); });
    return wrap;
  }

  function sparkline(points) {
    if (points.length < 2) return '';
    const ys = points.map((p) => p.pesoKg);
    const min = Math.min(...ys), max = Math.max(...ys);
    const d = ys.map((v, i) => `${i ? 'L' : 'M'}${((i / (ys.length - 1)) * 96).toFixed(1)},${(max === min ? 14 : 26 - ((v - min) / (max - min)) * 24).toFixed(1)}`).join('');
    return `<svg class="spark" viewBox="0 0 96 28" aria-hidden="true"><path d="${d}"/></svg>`;
  }

  const deltaHTML = (v) => (v == null ? '' : `<span class="delta ${v > 0 ? 'is-up' : v < 0 ? 'is-down' : ''}">${v > 0 ? '+' : ''}${nf1.format(v)} kg</span>`);

  /* ---------- Tabela com ordenação e paginação ---------- */
  function sortRows(rows, key, dir) {
    const m = dir === 'desc' ? -1 : 1;
    return rows.slice().sort((a, b) => {
      const x = a[key], y = b[key];
      if (x == null || x === '') return 1;
      if (y == null || y === '') return -1;
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * m;
      return String(x).localeCompare(String(y), 'pt-BR', { numeric: true }) * m;
    });
  }

  function pagerHTML(page, pages, total, per) {
    if (total <= per) return total ? `<div class="pager"><span>${total} ${total === 1 ? 'resultado' : 'resultados'}</span></div>` : '';
    const from = (page - 1) * per + 1, to = Math.min(total, page * per);
    return `
      <div class="pager">
        <span>${from}–${to} de ${total}</span>
        <div class="pager-btns">
          <button type="button" class="btn btn-secondary btn-sm" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>${icon('chevronLeft', { size: 14, stroke: 2.2 })} Anterior</button>
          <button type="button" class="btn btn-secondary btn-sm" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''}>Próxima ${icon('chevronRight', { size: 14, stroke: 2.2 })}</button>
        </div>
      </div>`;
  }

  /* ---------- Gráfico de colunas (uma série) ----------
     items: [{ label, value, note, current }] do mais antigo para o mais recente.
     Colunas finas (até 24 px) com o topo arredondado, crescendo de uma linha de base só. Dica ao passar
     o mouse ou focar com o teclado; o valor da última coluna fica escrito. A coluna "current"
     (período ainda em andamento) fica mais clara. Uma tabela invisível leva os mesmos números. */
  const niceMax = (v, integer) => {
    if (v <= 0) return integer ? 2 : 1;
    if (integer && v <= 10) return Math.max(2, Math.ceil(v / 2) * 2);
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  };

  // width: largura real do gráfico na tela, para o texto do SVG ficar no tamanho certo também no celular
  function columnChart(items, { format = (v) => nf1.format(v), integer = false, height = 220, label = '', width = 720 } = {}) {
    const wrap = U.h('<div class="chart"></div>');
    const W = Math.max(280, Math.round(width)), H = height, P = { l: 44, r: 12, t: 26, b: 28 };
    const top = niceMax(Math.max(0, ...items.map((x) => x.value)), integer);
    const band = (W - P.l - P.r) / items.length;
    const bw = Math.min(24, band * 0.62);
    const base = H - P.b;
    const Y = (v) => P.t + (1 - v / top) * (base - P.t);
    const X = (i) => P.l + i * band + (band - bw) / 2;
    const grid = [0, top / 2, top].map((v) => `<line class="chart-grid" x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="chart-axis" x="${P.l - 8}" y="${Y(v) + 4}" text-anchor="end">${esc(format(v))}</text>`).join('');
    const bar = (x, i) => {
      if (!(x.value > 0)) return '';
      const y = Y(x.value), h = base - y, r = Math.min(4, h, bw / 2), x0 = X(i);
      return `<path class="col${x.current ? ' is-current' : ''}" data-i="${i}" d="M${x0},${base}V${y + r}Q${x0},${y} ${x0 + r},${y}H${x0 + bw - r}Q${x0 + bw},${y} ${x0 + bw},${y + r}V${base}Z"/>`;
    };
    const step = Math.ceil(items.length / Math.min(6, Math.max(2, Math.floor((W - P.l - P.r) / 56))));
    const xLabels = items.map((x, i) => ((items.length - 1 - i) % step === 0 ? `<text class="chart-axis" x="${X(i) + bw / 2}" y="${H - 8}" text-anchor="middle">${esc(x.label)}</text>` : '')).join('');
    const last = items[items.length - 1];
    const lastLabel = last && last.value > 0 ? `<text class="chart-value" x="${X(items.length - 1) + bw / 2}" y="${Y(last.value) - 7}" text-anchor="middle">${esc(format(last.value))}</text>` : '';
    wrap.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
        ${grid}${xLabels}${items.map(bar).join('')}${lastLabel}
        ${items.map((x, i) => `<rect class="chart-hit" x="${P.l + i * band}" y="${P.t}" width="${band}" height="${base - P.t}" data-i="${i}" tabindex="0" aria-label="${esc(`${x.label}: ${format(x.value)}${x.note ? ` · ${x.note}` : ''}`)}"/>`).join('')}
      </svg>
      <div class="chart-tip" hidden></div>
      <table class="sr-only"><caption>${esc(label)}</caption><tbody>${items.map((x) => `<tr><th>${esc(x.label)}</th><td>${esc(format(x.value))}</td></tr>`).join('')}</tbody></table>`;
    const svg = wrap.querySelector('svg');
    const tip = wrap.querySelector('.chart-tip');
    const show = (i) => {
      const x = items[i];
      svg.querySelectorAll('.col').forEach((c) => c.classList.toggle('is-hover', c.dataset.i === String(i)));
      tip.hidden = false;
      tip.style.left = `${((X(i) + bw / 2) / W) * 100}%`;
      tip.style.top = `${(Y(Math.max(x.value, 0)) / H) * svg.getBoundingClientRect().height}px`;
      tip.innerHTML = `<strong class="num">${esc(format(x.value))}</strong>${esc(x.label)}${x.note ? ` · ${esc(x.note)}` : ''}`;
    };
    const hide = () => { tip.hidden = true; svg.querySelectorAll('.col.is-hover').forEach((c) => c.classList.remove('is-hover')); };
    svg.querySelectorAll('.chart-hit').forEach((h) => {
      h.addEventListener('mouseenter', () => show(Number(h.dataset.i)));
      h.addEventListener('focus', () => show(Number(h.dataset.i)));
      h.addEventListener('blur', hide);
    });
    svg.addEventListener('mouseleave', hide);
    return wrap;
  }

  /* ---------- Calendário de treinos ----------
     days: [{ dia: 'AAAA-MM-DD', treinos, series }]; from: segunda-feira da primeira semana; today: 'AAAA-MM-DD'.
     Uma cor em três tons (validados para os temas claro e escuro): quanto mais séries no dia, mais forte. */
  const heatLevel = (d) => (!d ? 0 : d.series >= 20 ? 3 : d.series >= 10 ? 2 : 1);
  const shiftDay = (key, n) => new Date(new Date(`${key}T12:00:00Z`).getTime() + n * 86400000).toISOString().slice(0, 10);
  const shortDate = (key) => new Date(`${key}T12:00:00Z`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' });

  function heatmap(days, { from, weeks = 12, today }) {
    const by = {};
    days.forEach((d) => { by[d.dia] = d; });
    const wrap = U.h('<div class="heat"></div>');
    const cols = Array.from({ length: weeks }, (_, w) => shiftDay(from, w * 7));
    let lastMonth = '';
    const months = cols.map((k) => {
      const m = new Date(`${k}T12:00:00Z`).toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
      const show = m !== lastMonth;
      lastMonth = m;
      return `<span class="heat-month">${show ? esc(m) : ''}</span>`;
    }).join('');
    const DOW = ['Seg', '', 'Qua', '', 'Sex', '', ''];
    let cells = '';
    for (let dow = 0; dow < 7; dow++) {
      cells += `<span class="heat-dow">${DOW[dow]}</span>`;
      cols.forEach((k) => {
        const key = shiftDay(k, dow);
        if (key > today) { cells += '<span class="heat-cell is-future" aria-hidden="true"></span>'; return; }
        const d = by[key];
        const text = d ? `${shortDate(key)}: ${d.treinos === 1 ? '1 treino' : `${d.treinos} treinos`} · ${d.series} séries` : `${shortDate(key)}: sem treino`;
        cells += `<span class="heat-cell" data-l="${heatLevel(d)}" tabindex="0" role="img" aria-label="${esc(text)}" data-tip="${esc(text)}"></span>`;
      });
    }
    wrap.innerHTML = `
      <div class="heat-grid" style="--weeks:${weeks}"><span></span>${months}${cells}</div>
      <div class="heat-legend"><span>Menos</span>${[0, 1, 2, 3].map((l) => `<span class="heat-cell" data-l="${l}" aria-hidden="true"></span>`).join('')}<span>Mais séries</span></div>
      <div class="chart-tip" hidden></div>`;
    const tip = wrap.querySelector('.chart-tip');
    const show = (c) => {
      const r = c.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      tip.hidden = false;
      tip.style.left = `${r.left - w.left + r.width / 2}px`;
      tip.style.top = `${r.top - w.top}px`;
      tip.textContent = c.dataset.tip;
    };
    wrap.querySelectorAll('.heat-grid .heat-cell[data-tip]').forEach((c) => {
      c.addEventListener('mouseenter', () => show(c));
      c.addEventListener('focus', () => show(c));
      c.addEventListener('mouseleave', () => { tip.hidden = true; });
      c.addEventListener('blur', () => { tip.hidden = true; });
    });
    return wrap;
  }

  /* ---------- Barras com faixa de referência ----------
     rows: [{ label, value, min, max }]. A faixa recomendada fica atrás, em cinza; a barra é o valor.
     O valor fica escrito e a situação vai num selo com texto (nunca só pela cor). */
  function rangeBars(rows, { format = (v) => nf1.format(v), scaleMax } = {}) {
    const end = scaleMax || Math.max(1, ...rows.map((r) => Math.max(r.value, r.max)));
    const pct = (v) => `${Math.min(100, (v / end) * 100).toFixed(1)}%`;
    const status = (r) => (r.value === 0 ? ['is-warn', 'Sem treino'] : r.value < r.min ? ['is-warn', 'Abaixo'] : r.value > r.max ? ['is-info', 'Acima'] : ['is-success', 'Na faixa']);
    return `<ul class="rbars">${rows.map((r) => {
      const [tone, text] = status(r);
      return `
        <li class="rbar">
          <span class="rbar-label">${esc(r.label)}</span>
          <span class="rbar-track" aria-hidden="true"><span class="rbar-range" style="left:${pct(r.min)};width:calc(${pct(r.max)} - ${pct(r.min)})"></span><span class="rbar-fill" style="width:${pct(r.value)}"></span></span>
          <span class="rbar-value num">${esc(format(r.value))}</span>
          <span class="pill no-dot ${tone}">${text}</span>
        </li>`;
    }).join('')}</ul>`;
  }

  // Mini gráfico de uma série de números (com ponto no último valor)
  function sparkValues(values) {
    if (values.length < 2) return '';
    const min = Math.min(...values), max = Math.max(...values);
    const pts = values.map((v, i) => [(i / (values.length - 1)) * 92 + 2, max === min ? 14 : 24 - ((v - min) / (max - min)) * 20]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
    const [lx, ly] = pts[pts.length - 1];
    return `<svg class="spark" viewBox="0 0 96 28" aria-hidden="true"><path d="${d}"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="3"/></svg>`;
  }

  global.TUI = { F, toast, modal, confirm, segmented, meterHTML, statusPill, emptyHTML, lineChart, sparkline, deltaHTML, sortRows, pagerHTML, columnChart, heatmap, rangeBars, sparkValues, shiftDay };
})(window);
