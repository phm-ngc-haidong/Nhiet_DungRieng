/* ============================================================
   THÍ NGHIỆM: NHIỆT DUNG RIÊNG CỦA NƯỚC
   c = P·H·t / (m·ΔT)      (m: khối lượng nước, ΔT: độ tăng nhiệt độ)
   Đồ thị: trục hoành 1/ΔT, trục tung c
   ============================================================ */
/* H được nhập/hiển thị theo % (vd. 90 = 90%); khi tính c thì đổi về số thập phân (H/100).
   Mục 2 — nhập tay: P, H, m (khối lượng nước, kg), Δt, t1 (nhiệt độ đầu), t2 (nhiệt độ cuối).
   ΔT được TỰ TÍNH từ t1, t2 (lấy giá trị tuyệt đối của t2 − t1 nên nhập theo chiều nào cũng ra số dương). */
const FIELDS = ['P', 'H', 'm', 't', 't1', 't2'];
/* Dữ liệu mẫu minh họa — đun nước bằng điện với công suất không đổi P = 500 W */
const SAMPLE = [
  { P: 1000, H: 85, m: 1, t: 60, t1: 30.91, t2: 43.05 },
  { P: 1000, H: 85, m: 1, t: 60, t1: 45.76, t2: 57.98 },
  { P: 1000, H: 85, m: 1, t: 60, t1: 59.21, t2: 72.03 },
  { P: 1000, H: 85, m: 1, t: 60, t1: 73.58, t2: 86.67 },
  { P: 1000, H: 85, m: 1, t: 60, t1: 87.06, t2: 98.09 },
];

/* Mục 1 — số liệu minh họa cho "bảng báo cáo" cố định (P = 600 W, H = 90%, m = 1,00 kg, Δt = 150 s, 10 lần đo).
   Thay các giá trị trong mảng này bằng số liệu thật của nhóm bạn nếu có. */
const FIXED_DATA = [
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.0, dT: 19.0 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.1, dT: 19.1 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.4, dT: 19.4 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.5, dT: 19.5 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.2, dT: 19.2 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.3, dT: 19.3 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.0, dT: 19.0 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.6, dT: 19.6 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.2, dT: 19.2 },
  { P: 500, H: 88, m: 1, t: 120, t1: 20, t2: 39.4, dT: 19.4 },
];

const RESULT_LABEL = 'c';
const RESULT_UNIT = 'J/kg.K';
const Y_AXIS_UNIT = '·10³ J/kg.K'; // đơn vị hiển thị trên trục tung (giá trị tick = J/kg.K ÷ 1000)
const X_LABEL = '1/ΔT (K⁻¹)';
const REF_VALUE = 4200; // giá trị chuẩn của nhiệt dung riêng nước (J/kg.K)

const sections = {
  fixed: {
    rows: FIXED_DATA.map(r => ({ ...r })),
    fields: ['P', 'H', 'm', 't', 't1', 't2', 'dT'],
    exactResult: true,
    editable: false,
    tableId: 'specific-table-fixed',
    summaryId: 'specific-summary-fixed',
    canvasId: 'specific-chart-fixed',
    calcId: 'calc-fixed'
  },
  editable: {
    rows: [],
    fields: FIELDS,
    exactResult: true,
    editable: true,
    tableId: 'specific-table',
    summaryId: 'specific-summary',
    canvasId: 'specific-chart',
    calcId: 'calc-editable'
  }
};

function isFiniteNum(v) { return typeof v === 'number' && isFinite(v); }
function fmt(v, digits = 2) {
  if (!isFiniteNum(v)) return '—';
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('en-US').replace(/,/g, ' ');
  return v.toLocaleString('vi-VN', { maximumFractionDigits: digits });
}
/* Hiển thị KHÔNG làm tròn phần nguyên: 4 200,1234 */
function fmtExact(v, digits = 4) {
  if (!isFiniteNum(v)) return '—';
  const [intPart, decPart] = Math.abs(v).toFixed(digits).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return (v < 0 ? '-' : '') + grouped + ',' + decPart;
}
/* Phần trăm: luôn làm tròn đến 11 chữ số thập phân (giữ cả số 0 cuối), dấu phẩy kiểu Việt */
const PERCENT_DIGITS = 11;
function fmtPercent(v) {
  return isFiniteNum(v) ? fmtExact(v, PERCENT_DIGITS) + '%' : '—';
}
/* Số nguyên có dấu cách nghìn (4 200) */
function fmtInt(v) {
  return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}
/* Số thường, dấu phẩy Việt, không nhóm nghìn (dùng cho P, H, m, Δt) */
function fmtPlain(v, maxD = 4) {
  return v.toLocaleString('vi-VN', { maximumFractionDigits: maxD, useGrouping: false });
}
/* ΔT: luôn 1 chữ số thập phân như trong bảng */
function fmtDT(v) {
  return v.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: false });
}
/* Như fmtExact nhưng bỏ các số 0 thừa ở cuối phần thập phân: 4 200,1230 → 4 200,123 */
function fmtTrim(v, digits = 4) {
  const t = fmtExact(v, digits);
  return t.includes(',') ? t.replace(/0+$/, '').replace(/,$/, '') : t;
}
function fmtResult(section, v) {
  return section.exactResult ? fmtExact(v) : fmt(v);
}
function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN; }
function stddev(arr) {
  if (arr.length < 2) return NaN;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1));
}

/* y = c, x = 1/ΔT */
function computeY(row) {
  const { P, H, m, t, dT } = row;
  if (![P, H, m, t, dT].every(isFiniteNum) || dT === 0 || m === 0) return null;
  return P * (H / 100) * t * (1 / (m * dT));  // H tính bằng %, m tính bằng kg
}
function computeX(row) {
  const dT = row.dT;
  if (!isFiniteNum(dT) || dT === 0) return null;
  return 1 / dT;
}

/* Mục 2: ΔT = |t2 − t1| (làm tròn 10 chữ số để bỏ sai số dấu phẩy động) */
function syncDT(row) {
  row.dT = (isFiniteNum(row.t1) && isFiniteNum(row.t2))
    ? Math.round(Math.abs(row.t2 - row.t1) * 1e10) / 1e10
    : NaN;
}

function blankRow() {
  const row = {};
  FIELDS.forEach(f => row[f] = '');
  return row;
}

function renderTable(section) {
  const table = document.getElementById(section.tableId);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  section.rows.forEach((row, i) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = i + 1;
    tdIndex.style.fontWeight = '600';
    tr.appendChild(tdIndex);

    section.fields.forEach(field => {
      const td = document.createElement('td');
      if (section.editable) {
        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.inputMode = 'decimal';
        input.autocomplete = 'off';
        /* H nhập theo % · t1, t2 hiện 1 chữ số thập phân, như mục 1 */
        if (field === 'H' && isFiniteNum(row[field])) {
          input.value = row[field];
        } else if (field === 'm' && isFiniteNum(row[field])) {
          /* m hiện 2 chữ số thập phân (nếu số nhập có nhiều hơn 2 chữ số thì giữ nguyên) */
          input.value = (Math.round(row[field] * 100) / 100 === row[field]) ? row[field].toFixed(2) : String(row[field]);
        } else if ((field === 't1' || field === 't2') && isFiniteNum(row[field])) {
          input.value = row[field].toFixed(1);
        } else {
          input.value = row[field];
        }
        input.addEventListener('input', () => {
          section.rows[i][field] = parseFloat(input.value);
          syncDT(section.rows[i]);
          updateResultCell(section, i);
          updateSummaryAndChart(section);
        });
        td.appendChild(input);
      } else {
        /* Số chữ số thập phân cố định cho mỗi cột (giữ cả số 0 cuối) để các dòng thẳng hàng:
           H (%): số nguyên (tối đa 2 chữ số thập phân) · m: 2 chữ số · t1, t2, ΔT: 1 chữ số · P, Δt: số nguyên */
        const isTemp = (field === 't1' || field === 't2' || field === 'dT');
        const isEff = (field === 'H');
        const isMass = (field === 'm');
        const minD = isTemp ? 1 : (isMass ? 2 : 0);
        const maxD = isTemp ? 1 : (isMass ? 2 : (isEff ? 2 : 0));
        td.textContent = isFiniteNum(row[field])
          ? row[field].toLocaleString('vi-VN', { minimumFractionDigits: minD, maximumFractionDigits: maxD, useGrouping: false })
          : '—';
        td.style.textAlign = 'center';
        td.style.color = 'var(--ink-soft)';
      }
      tr.appendChild(td);
    });

    if (section.editable) {
      const tdDT = document.createElement('td');
      tdDT.id = `${section.tableId}-dm-${i}`;
      tdDT.style.textAlign = 'center';
      tdDT.style.color = 'var(--ink-soft)';
      tr.appendChild(tdDT);
    }

    const tdResult = document.createElement('td');
    tdResult.className = 'result-cell';
    tdResult.id = `${section.tableId}-result-${i}`;
    tr.appendChild(tdResult);

    if (section.editable) {
      const tdDel = document.createElement('td');
      tdDel.className = 'del-col';
      const btn = document.createElement('button');
      btn.className = 'row-del';
      btn.title = 'Xóa dòng';
      btn.innerHTML = '&times;';
      btn.addEventListener('click', () => {
        section.rows.splice(i, 1);
        renderTable(section);
        updateSummaryAndChart(section);
      });
      tdDel.appendChild(btn);
      tr.appendChild(tdDel);
    }

    tbody.appendChild(tr);
  });

  if (section.editable) section.rows.forEach(syncDT);
  section.rows.forEach((_, i) => updateResultCell(section, i));
}

function updateResultCell(section, i) {
  if (section.editable) {
    const dTCell = document.getElementById(`${section.tableId}-dm-${i}`);
    const dT = section.rows[i].dT;
    if (dTCell) dTCell.textContent = isFiniteNum(dT)
      ? dT.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: false })
      : '—';
  }
  const cell = document.getElementById(`${section.tableId}-result-${i}`);
  if (!cell) return;
  const val = computeY(section.rows[i]);
  cell.textContent = isFiniteNum(val) ? fmtResult(section, val) : '—';
}

function updateSummaryAndChart(section) {
  const values = section.rows.map(computeY).filter(isFiniteNum);
  const points = section.rows
    .map(r => ({ x: computeX(r), y: computeY(r) }))
    .filter(p => isFiniteNum(p.x) && isFiniteNum(p.y));

  const avg = mean(values);
  /* Sai số tương đối của c trung bình so với giá trị chuẩn 4200 J/kg.K */
  const relErr = isFiniteNum(avg) ? (Math.abs(avg - REF_VALUE) / REF_VALUE) * 100 : NaN;

  document.getElementById(section.summaryId).innerHTML = `
    <div class="stat">
      <span class="label">Số lần đo hợp lệ</span>
      <span class="value">${values.length}</span>
    </div>
    <div class="stat">
      <span class="label">Nhiệt dung riêng trung bình</span>
      <span class="value">${fmtTrim(avg)} <small>${RESULT_UNIT}</small></span>
    </div>
    <div class="stat">
      <span class="label">Phần trăm sai số tương đối</span>
      <span class="value">${fmtPercent(relErr)}</span>
    </div>
  `;

  renderCalc(section, avg, relErr);
  renderChart(section.canvasId, points);
}

/* ============================================================
   PHẦN TÍNH TOÁN (có công thức) — nằm giữa bảng số liệu và đồ thị
   ============================================================ */
function sumExpr(items) {
  const term = it => `<i>c</i><sub>${it.idx}</sub>`;
  if (items.length <= 6) return items.map(term).join(' + ');
  return [term(items[0]), term(items[1]), '…', term(items[items.length - 1])].join(' + ');
}

function renderCalc(section, avg, relErr) {
  const el = document.getElementById(section.calcId);
  if (!el) return;

  const items = [];
  section.rows.forEach((r, i) => {
    const c = computeY(r);
    if (isFiniteNum(c)) items.push({ idx: i + 1, P: r.P, H: r.H, m: r.m, t: r.t, dT: r.dT, c });
  });

  const refTxt = fmtInt(REF_VALUE);
  const rows = items.map(it => `
    <div class="calc-line math">
      <span class="calc-lbl">Lần ${it.idx}:</span>
      <span><i>c</i><sub>${it.idx}</sub> =</span>
      <span class="mfrac"><span>${fmtPlain(it.P)}·${fmtPlain(it.H / 100)}·${fmtPlain(it.t)}</span><span>${fmtPlain(it.m)}·${fmtDT(it.dT)}</span></span>
      <span>≈ ${fmtExact(it.c)} <span class="calc-unit">${RESULT_UNIT}</span></span>
    </div>`).join('');

  el.innerHTML = `
    <div class="calc-block">
      <h4>Nhiệt dung riêng của từng lần đo</h4>
      <div class="calc-main math">
        <i>c</i> =
        <span class="mfrac"><span><i>P</i> ·<i>H</i> ·Δ<i>t</i></span><span><i>m</i> ·Δ<i>T</i></span></span>
      </div>
      <div class="calc-list">${rows}
      </div>
    </div>

    <div class="calc-block">
      <h4>Nhiệt dung riêng trung bình</h4>
      <div class="calc-line math">
        <span><span class="ov"><i>c</i></span> =</span>
        <span class="mfrac"><span>${sumExpr(items)}</span><span>${items.length}</span></span>
        <span>≈ ${fmtTrim(avg)} <span class="calc-unit">${RESULT_UNIT}</span></span>
      </div>
    </div>

    <div class="calc-block">
      <h4>Phần trăm sai số tương đối</h4>
      <div class="calc-line math">
        <span><i>δc</i> =</span>
        <span class="mfrac">
          <span>|<span class="ov"><i>c</i></span> − <i>c</i><sub>chuẩn</sub>|</span>
          <span><i>c</i><sub>chuẩn</sub></span>
        </span>
        <span>·100% =</span>
        <span class="mfrac">
          <span>|${fmtTrim(avg)} − ${refTxt}|</span>
          <span>${refTxt}</span>
        </span>
        <span>·100% ≈ ${fmtPercent(relErr)}</span>
      </div>
    </div>`;
}

/* ============================================================
   VẼ ĐỒ THỊ BẰNG CANVAS 2D THUẦN (không phụ thuộc Chart.js)
   ============================================================ */
const CHART_COLORS = {
  point: '#C9862F',
  line: '#146B5E',
  grid: '#E7EBE2',
  axis: '#1C2B24',
  text: '#4B5D53',
  tickText: '#4B5D53'
};

function niceStep(range, targetTicks = 5) {
  if (!isFiniteNum(range) || range <= 0) return 1;
  const rough = range / targetTicks;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  let step;
  if (norm < 1.5) step = 1;
  else if (norm < 3) step = 2;
  else if (norm < 7) step = 5;
  else step = 10;
  return step * mag;
}

function setupCanvasDPR(canvas, cssW, cssH) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: cssW, h: cssH };
}

/* Tỉ lệ pixel/đơn vị của 2 trục — tính MỘT LẦN cho mỗi đồ thị (lúc vẽ đầu
   tiên hoặc khi khung đồ thị đổi kích thước), sau đó giữ CỐ ĐỊNH; số liệu
   trong bảng thay đổi chỉ được phép nới rộng thêm ô lưới, không co giãn lại. */
function computeAxisScale(points, availPlotW, availPlotH) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const baseMaxX = xs.length ? Math.max(...xs, 0) : 1;
  const baseMaxY = Math.max(...ys, 0, REF_VALUE);
  const stepX = niceStep(baseMaxX || 1, 5);
  const stepY = niceStep(baseMaxY || 1, 5);
  const stepsX = Math.max(4, Math.ceil((baseMaxX || stepX) / stepX));
  const stepsY = Math.max(4, Math.ceil((baseMaxY || stepY) / stepY));
  return {
    stepX, stepY,
    pxPerUnitX: availPlotW / (stepsX * stepX),
    pxPerUnitY: availPlotH / (stepsY * stepY)
  };
}

/* Trạng thái riêng cho mỗi đồ thị (mục 1 & mục 2 hoàn toàn độc lập) */
const chartStates = new Map();
function getChartState(canvasId) {
  if (!chartStates.has(canvasId)) {
    chartStates.set(canvasId, { points: [], axisScale: null, resizeAttached: false, hoverAttached: false });
  }
  return chartStates.get(canvasId);
}

function drawChart(canvas, state, hover) {
  const points = state.points;
  const padL = 58, padR = 22, padT = 40, padB = 44;

  const wrapRect = canvas.parentElement.getBoundingClientRect();
  const availW = Math.max(wrapRect.width, 100);
  const availH = Math.max(wrapRect.height, 100);
  const availPlotW = Math.max(availW - padL - padR, 10);
  const availPlotH = Math.max(availH - padT - padB, 10);

  if (!state.axisScale) state.axisScale = computeAxisScale(points, availPlotW, availPlotH);

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const dataMinX = xs.length ? Math.min(0, ...xs) : 0;
  const dataMaxX = xs.length ? Math.max(...xs, 0) : 1;
  const dataMinY = ys.length ? Math.min(0, ...ys) : 0;
  const dataMaxY = Math.max(...ys, 0, REF_VALUE);

  const { stepX, stepY, pxPerUnitX, pxPerUnitY } = state.axisScale;

  const domainMinX = Math.min(0, Math.floor(dataMinX / stepX) * stepX);
  const domainMinY = Math.min(0, Math.floor(dataMinY / stepY) * stepY);
  const domainMaxX = Math.max(stepX * 4, Math.ceil(dataMaxX / stepX) * stepX);
  const domainMaxY = Math.max(stepY * 4, Math.ceil(dataMaxY / stepY) * stepY);

  const plotW = (domainMaxX - domainMinX) * pxPerUnitX;
  const plotH = (domainMaxY - domainMinY) * pxPerUnitY;

  const cssW = Math.max(availW, padL + plotW + padR);
  const cssH = Math.max(availH, padT + plotH + padB);

  const { ctx, w, h } = setupCanvasDPR(canvas, cssW, cssH);
  ctx.clearRect(0, 0, w, h);

  const xt = { ticks: [] };
  for (let v = domainMinX; v <= domainMaxX + stepX * 1e-9; v += stepX) xt.ticks.push(v);
  const yt = { ticks: [] };
  for (let v = domainMinY; v <= domainMaxY + stepY * 1e-9; v += stepY) yt.ticks.push(v);

  const xScale = (x) => padL + (x - domainMinX) * pxPerUnitX;
  const yScale = (y) => padT + plotH - (y - domainMinY) * pxPerUnitY;

  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.fillStyle = CHART_COLORS.tickText;
  ctx.strokeStyle = CHART_COLORS.grid;
  ctx.lineWidth = 1;

  yt.ticks.forEach(v => {
    const y = yScale(v);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
    if (v === 0) return;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(fmt(v / 1000, 2), padL - 8, y);
  });
  xt.ticks.forEach(v => {
    const x = xScale(v);
    ctx.beginPath();
    ctx.moveTo(x, padT);
    ctx.lineTo(x, padT + plotH);
    ctx.stroke();
    ctx.textAlign = v === 0 ? 'right' : 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(fmt(v, 3), v === 0 ? x - 6 : x, padT + plotH + 8);
  });

  const ARROW = 8;
  function drawArrowhead(tipX, tipY, angle) {
    ctx.save();
    ctx.translate(tipX, tipY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-ARROW, ARROW * 0.45);
    ctx.lineTo(-ARROW, -ARROW * 0.45);
    ctx.closePath();
    ctx.fillStyle = CHART_COLORS.axis;
    ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = CHART_COLORS.axis;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(padL, padT + plotH);
  ctx.lineTo(padL, padT - ARROW * 0.6);
  ctx.stroke();
  drawArrowhead(padL, padT - ARROW * 0.6, -Math.PI / 2);

  ctx.beginPath();
  ctx.moveTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW + ARROW * 0.6, padT + plotH);
  ctx.stroke();
  drawArrowhead(padL + plotW + ARROW * 0.6, padT + plotH, 0);

  ctx.fillStyle = CHART_COLORS.text;
  ctx.font = '600 12px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(X_LABEL, padL + plotW + ARROW * 0.6, padT + plotH - 8);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${RESULT_LABEL} (${Y_AXIS_UNIT})`, padL + 6, padT - ARROW * 0.6 - 2);

  /* Đường chuẩn c = 4200 J/kg.K (nét đứt nhẹ) để so sai số tương đối */
  {
    const yRef = yScale(REF_VALUE);
    ctx.save();
    ctx.strokeStyle = 'rgba(178, 74, 60, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(padL, yRef);
    ctx.lineTo(padL + plotW, yRef);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = 'rgba(178, 74, 60, 0.95)';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${RESULT_LABEL} = ${fmt(REF_VALUE / 1000)} ${Y_AXIS_UNIT}`, padL + 8, yRef - 5);
  }

  if (points.length >= 2) {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const first = sorted[0], last = sorted[sorted.length - 1];
    ctx.strokeStyle = CHART_COLORS.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xScale(first.x), yScale(first.y));
    ctx.lineTo(xScale(last.x), yScale(last.y));
    ctx.stroke();
  }

  const pixelPoints = points.map(p => ({ ...p, px: xScale(p.x), py: yScale(p.y) }));
  pixelPoints.forEach(p => {
    const isHover = hover && hover === p;
    ctx.beginPath();
    ctx.fillStyle = CHART_COLORS.point;
    ctx.arc(p.px, p.py, isHover ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();
    if (isHover) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
  });

  if (hover) {
    const label = `1/ΔT = ${fmt(hover.x, 3)}  ·  ${RESULT_LABEL} = ${fmt(hover.y)} ${RESULT_UNIT}`;
    ctx.font = '500 11px Inter, sans-serif';
    const tw = ctx.measureText(label).width + 16;
    const th = 24;
    let tx = hover.px + 12, ty = hover.py - th - 8;
    if (tx + tw > w) tx = hover.px - tw - 12;
    if (ty < 0) ty = hover.py + 12;
    ctx.fillStyle = 'rgba(20,107,94,0.94)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(tx, ty, tw, th, 5) : ctx.rect(tx, ty, tw, th);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, tx + 8, ty + th / 2);
  }

  return pixelPoints;
}

function renderChart(canvasId, points) {
  const canvas = document.getElementById(canvasId);
  const state = getChartState(canvasId);
  state.points = points;
  drawChart(canvas, state, null);
  attachChartInteractivity(canvas, state);
}

function attachChartInteractivity(canvas, state) {
  if (!state.resizeAttached) {
    const ro = new ResizeObserver(() => {
      state.axisScale = null;
      drawChart(canvas, state, null);
    });
    ro.observe(canvas.parentElement);
    state.resizeAttached = true;
  }
  if (!state.hoverAttached) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const pixelPoints = drawChart(canvas, state, null);
      let nearest = null, bestDist = 14;
      pixelPoints.forEach(p => {
        const d = Math.hypot(p.px - mx, p.py - my);
        if (d < bestDist) { bestDist = d; nearest = p; }
      });
      drawChart(canvas, state, nearest);
    });
    canvas.addEventListener('mouseleave', () => {
      drawChart(canvas, state, null);
    });
    state.hoverAttached = true;
  }
}

function addRow() {
  sections.editable.rows.push(blankRow());
  renderTable(sections.editable);
  updateSummaryAndChart(sections.editable);
}
function loadSample() {
  sections.editable.rows = SAMPLE.map(r => ({ ...r }));
  renderTable(sections.editable);
  updateSummaryAndChart(sections.editable);
}
function clearTable() {
  sections.editable.rows = [];
  renderTable(sections.editable);
  updateSummaryAndChart(sections.editable);
}

function init() {
  document.getElementById('btn-add').addEventListener('click', addRow);
  document.getElementById('btn-sample').addEventListener('click', loadSample);
  document.getElementById('btn-clear').addEventListener('click', clearTable);

  loadSample();

  renderTable(sections.fixed);
  updateSummaryAndChart(sections.fixed);
}

document.addEventListener('DOMContentLoaded', init);
