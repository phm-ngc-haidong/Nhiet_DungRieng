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
  { P: 1000, H: 95, m: 1, t: 60, t1: 28.57, t2: 42.19 },
  { P: 1000, H: 95, m: 1, t: 60, t1: 42.19, t2: 56.63 },
  { P: 1000, H: 95, m: 1, t: 60, t1: 56.63, t2: 72.04 },
  { P: 1000, H: 95, m: 1, t: 60, t1: 72.04, t2: 83.97 },
  { P: 1000, H: 95, m: 1, t: 60, t1: 83.97, t2: 97.38 },
];

/* Mục 1 — số liệu minh họa cho "bảng báo cáo" cố định (P = 600 W, H = 90%, m = 1,00 kg, Δt = 150 s, 10 lần đo).
   Thay các giá trị trong mảng này bằng số liệu thật của nhóm bạn nếu có. */
const FIXED_DATA = [
  { P: 400, H: 90, m: 1, t: 30, t1: 40.9, t2: 43.9, dT: 3.0 },
  { P: 400, H: 90, m: 1, t: 30, t1: 43.9, t2: 46.9, dT: 3.0 },
  { P: 400, H: 90, m: 1, t: 30, t1: 46.9, t2: 49.7, dT: 2.8 },
  { P: 400, H: 90, m: 1, t: 30, t1: 49.7, t2: 52.5, dT: 2.8 },
  { P: 400, H: 90, m: 1, t: 30, t1: 52.5, t2: 55.3, dT: 2.8 },
  { P: 400, H: 90, m: 1, t: 30, t1: 55.3, t2: 57.9, dT: 2.6 },
  { P: 400, H: 90, m: 1, t: 30, t1: 57.9, t2: 60.6, dT: 2.7 },
  { P: 400, H: 90, m: 1, t: 30, t1: 60.6, t2: 63.3, dT: 2.7 },
  { P: 400, H: 90, m: 1, t: 30, t1: 63.3, t2: 66.1, dT: 2.8 },
  { P: 400, H: 90, m: 1, t: 30, t1: 66.1, t2: 68.4, dT: 2.3 },
  { P: 400, H: 90, m: 1, t: 30, t1: 68.4, t2: 71.0, dT: 2.6 },
  { P: 400, H: 90, m: 1, t: 30, t1: 71.0, t2: 73.6, dT: 2.6 },
  { P: 400, H: 90, m: 1, t: 30, t1: 73.6, t2: 75.9, dT: 2.3 },
  { P: 400, H: 90, m: 1, t: 30, t1: 75.9, t2: 78.5, dT: 2.6 },
  { P: 400, H: 90, m: 1, t: 30, t1: 78.5, t2: 80.7, dT: 2.2 },
  { P: 400, H: 90, m: 1, t: 30, t1: 80.7, t2: 82.9, dT: 2.2 },
];

const RESULT_LABEL = 'c';
const RESULT_UNIT = 'J/kg.K';
const Y_AXIS_UNIT = '·10³ J/kg.K'; // đơn vị hiển thị trên trục tung (giá trị tick = J/kg.K ÷ 10³)
const Y_AXIS_DIV = 1e3;
const X_LABEL = '1/ΔT (K⁻¹)';
const REF_VALUE = 4186; // giá trị chuẩn của nhiệt dung riêng nước (J/kg.K)
/* Trục c: gốc luôn là 0. Vạch chia (đơn vị) = Y_GRID_STEP; độ giãn dọc tính bằng số px cho mỗi 10³ J/kg.K,
   giữ CỐ ĐỊNH (không ép vừa khung) → các điểm không bị dồn cục dù vạch chia thưa.
   Muốn giãn hơn: tăng Y_PX_PER_UNIT (đồ thị cao thêm). Muốn đổi vạch chia: sửa Y_GRID_STEP. */
const Y_GRID_STEP = 1000;          // vạch chia trục c: 1·10³ J/kg.K
const Y_PX_PER_UNIT = 221;         // số px ứng với 1·10³ J/kg.K trên màn hình rộng (nhỏ → trục ngắn lại)
const Y_PX_PER_UNIT_SMALL = 121;   // ... trên điện thoại
const Y_TOP_MARGIN = 1111;          // chừa phía trên điểm cao nhất (J/kg.K)
const LINE_EXTEND_RATIO = 0.25;      // đường kéo dài thêm mỗi phía = 25% độ rộng trục x (không bao giờ về gốc)
const LINE_WIDTH = 2.8;              // độ dày đường đồ thị (px)
const POINT_RADIUS = 3.5;             // bán kính chấm điểm trên đồ thị (px)

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
  if (!isFiniteNum(v)) return '-';
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('en-US').replace(/,/g, ' ');
  return v.toLocaleString('vi-VN', { maximumFractionDigits: digits });
}
/* Hiển thị KHÔNG làm tròn phần nguyên: 4 200,1234 */
function fmtExact(v, digits = 4) {
  if (!isFiniteNum(v)) return '-';
  const [intPart, decPart] = Math.abs(v).toFixed(digits).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return (v < 0 ? '-' : '') + grouped + ',' + decPart;
}
/* Phần trăm: luôn làm tròn đến 11 chữ số thập phân (giữ cả số 0 cuối), dấu phẩy kiểu Việt */
const PERCENT_DIGITS = 11;
function fmtPercent(v) {
  return isFiniteNum(v) ? fmtExact(v, PERCENT_DIGITS) + '%' : '- %';
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
        input.placeholder = '-';
        /* H nhập theo % · t1, t2 hiện 1 chữ số thập phân, như mục 1 */
        if (field === 'H' && isFiniteNum(row[field])) {
          input.value = row[field];
        } else if (field === 'm' && isFiniteNum(row[field])) {
          /* m hiện 2 chữ số thập phân (nếu số nhập có nhiều hơn 2 chữ số thì giữ nguyên) */
          input.value = (Math.round(row[field] * 100) / 100 === row[field]) ? row[field].toFixed(2) : String(row[field]);
        } else if ((field === 't1' || field === 't2') && isFiniteNum(row[field])) {
          input.value = row[field].toFixed(1);
        } else {
          input.value = isFiniteNum(row[field]) ? row[field] : '';
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
          : '-';
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
      : '-';
  }
  const cell = document.getElementById(`${section.tableId}-result-${i}`);
  if (!cell) return;
  const val = computeY(section.rows[i]);
  cell.textContent = isFiniteNum(val) ? fmtResult(section, val) : '-';
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
  if (!items.length) return '<i>c</i><sub>1</sub> + <i>c</i><sub>2</sub> + … + <i>c</i><sub><i>n</i></sub>';
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
  const has = items.length > 0;   // chưa có số nào -> chỉ hiện công thức, không thế số, không đơn vị

  const refTxt = fmtInt(REF_VALUE);
  const rows = items.map(it => `
    <div class="calc-line math">
      <span class="calc-lbl">Lần ${it.idx}:</span>
      <span><i>c</i><sub>${it.idx}</sub> =</span>
      <span class="mfrac"><span>${fmtPlain(it.P)}·${fmtPlain(it.H / 100)}·${fmtPlain(it.t)}</span><span>${fmtPlain(it.m)}·${fmtDT(it.dT)}</span></span>
      <span>≈ ${fmtExact(it.c)} <span class="calc-unit">${RESULT_UNIT}</span></span>
    </div>`).join('');

  /* Trung bình: công thức tổng quát → thế đủ giá trị từng lần đo → kết quả */
  const avgNum = has ? `
        <span>=</span>
        <span class="mfrac mfrac-wrap"><span>${items.map(it => fmtExact(it.c)).join(' + ')}</span><span>${items.length}</span></span>
        <span>≈ ${fmtTrim(avg)} <span class="calc-unit">${RESULT_UNIT}</span></span>` : '';

  /* Sai số tương đối: công thức → thế số → kết quả */
  const errNum = has ? `
        <span>=</span>
        <span class="mfrac">
          <span>|${fmtTrim(avg)} − ${refTxt}|</span>
          <span>${refTxt}</span>
        </span>
        <span>·100% ≈ ${fmtPercent(relErr)}</span>` : '';

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
        <span class="mfrac"><span>${sumExpr(items)}</span><span>${has ? items.length : '<i>n</i>'}</span></span>${avgNum}
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
        <span>·100%</span>${errNum}
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

/* Nhãn số trên trục c (đơn vị ·10³ J/kg.K): số chữ số thập phân tự theo bước lưới (1,0 · 0,5 · 0,25 · …) */
function fmtAxisL(v, stepY) {
  const dec = Math.min(4, Math.max(1, Math.ceil(-Math.log10(stepY / Y_AXIS_DIV) - 1e-9)));
  return (v / Y_AXIS_DIV).toLocaleString('vi-VN', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

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
/* Khi bảng còn trống (chưa có điểm nào), lấy dữ liệu mẫu làm chuẩn để chia trục — giống bản gốc
   (bản gốc luôn khởi động với dữ liệu mẫu). Nhờ vậy trục không bị chia theo miền [0; 1] rồi
   khóa cứng, làm các điểm bị dồn sát gốc khi người dùng nhập số liệu hoặc bấm "Điền dữ liệu mẫu". */
function seedPoints() {
  return SAMPLE.map(r => {
    const row = { ...r };
    syncDT(row);
    return { x: computeX(row), y: computeY(row) };
  }).filter(p => isFiniteNum(p.x) && isFiniteNum(p.y));
}

function computeAxisScale(points, availPlotW) {
  if (!points.length) points = seedPoints();
  const xs = points.map(p => p.x);
  const baseMaxX = xs.length ? Math.max(...xs, 0) : 1;
  const stepX = niceStep(baseMaxX || 1, 5);
  const stepsX = Math.max(4, Math.ceil((baseMaxX || stepX) / stepX));

  /* Trục c: gốc 0, vạch chia cố định, độ giãn dọc cố định (không ép vừa khung) */
  const maxY = Math.max(...points.map(p => p.y), REF_VALUE);
  const stepY = Y_GRID_STEP;
  const pxPerUnit = availPlotW < 600 ? Y_PX_PER_UNIT_SMALL : Y_PX_PER_UNIT;
  const baseMaxY = Math.ceil((maxY + Y_TOP_MARGIN) / stepY) * stepY;
  return {
    stepX, stepY, baseMaxY,
    pxPerUnitX: availPlotW / (stepsX * stepX),
    pxPerUnitY: pxPerUnit / Y_AXIS_DIV
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
  const availPlotW = Math.max(availW - padL - padR, 10);

  if (!state.axisScale) state.axisScale = computeAxisScale(points, availPlotW);

  /* Miền hiển thị của trục tính theo dữ liệu đang có; nếu bảng còn trống thì tính theo dữ liệu mẫu
     (cùng cơ sở với thang chia trục ở trên) để đồ thị trống và đồ thị có số vừa vặn như nhau. */
  const basis = points.length ? points : seedPoints();
  const xs = basis.map(p => p.x);
  const ys = basis.map(p => p.y);
  const dataMinX = xs.length ? Math.min(0, ...xs) : 0;
  const dataMaxX = xs.length ? Math.max(...xs, 0) : 1;
  const dataMaxY = Math.max(...ys, REF_VALUE);

  const { stepX, stepY, baseMaxY, pxPerUnitX, pxPerUnitY } = state.axisScale;

  const domainMinX = Math.min(0, Math.floor(dataMinX / stepX) * stepX);
  const domainMaxX = Math.max(stepX * 4, Math.ceil(dataMaxX / stepX) * stepX);
  /* Trục c luôn bắt đầu từ 0; miền chỉ được NỚI RỘNG thêm khi có điểm nằm ngoài, không co giãn lại */
  const domainMinY = 0;
  const domainMaxY = Math.max(stepY * 4, baseMaxY, Math.ceil((dataMaxY + Y_TOP_MARGIN) / stepY) * stepY);

  /* Nếu số liệu nằm xa miền của dữ liệu mẫu khiến đồ thị dài vượt khung (phải cuộn ngang),
     chia lại trục x theo chính số liệu đó cho vừa khung. Số liệu gần dữ liệu mẫu thì giữ nguyên thang cũ. */
  if (points.length && padL + (domainMaxX - domainMinX) * pxPerUnitX + padR > availW + 1) {
    state.axisScale = computeAxisScale(points, availPlotW);
    return drawChart(canvas, state, hover);
  }

  const plotW = (domainMaxX - domainMinX) * pxPerUnitX;
  const plotH = (domainMaxY - domainMinY) * pxPerUnitY;

  const cssW = Math.max(availW, padL + plotW + padR);
  const cssH = padT + plotH + padB;   // chiều cao đồ thị do số ô lưới quyết định (khung tự cao theo)

  const { ctx, w, h } = setupCanvasDPR(canvas, cssW, cssH);
  ctx.clearRect(0, 0, w, h);

  const xt = { ticks: [] };
  for (let v = domainMinX; v <= domainMaxX + stepX * 1e-9; v += stepX) xt.ticks.push(v);
  const yt = { ticks: [] };
  const nStepsY = Math.round((domainMaxY - domainMinY) / stepY);
  for (let i = 0; i <= nStepsY; i++) yt.ticks.push(domainMinY + i * stepY);

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
    ctx.fillText(fmtAxisL(v, stepY), padL - 8, y);
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

  /* Đường chuẩn c = 4 200 J/kg.K (nét đứt nhẹ) để so sai số tương đối */
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
    ctx.fillText(`${RESULT_LABEL} = ${fmt(REF_VALUE / Y_AXIS_DIV, 2)} ${Y_AXIS_UNIT}`, padL + 8, yRef - 5);

    /* Vạch 4,2·10³ trên trục c: gạch nhỏ + nhãn đỏ đậm để đọc thẳng giá trị chuẩn */
    const refTxt = fmt(REF_VALUE / Y_AXIS_DIV, 2);
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    const rw = ctx.measureText(refTxt).width + 8;
    ctx.fillStyle = '#fff';
    ctx.fillRect(padL - 8 - rw + 4, yRef - 8, rw, 16);
    ctx.fillStyle = 'rgba(178, 74, 60, 1)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(refTxt, padL - 8, yRef);
    ctx.strokeStyle = 'rgba(178, 74, 60, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL - 5, yRef);
    ctx.lineTo(padL + 5, yRef);
    ctx.stroke();
  }

  /* Đường đồ thị: đi qua điểm đầu và điểm cuối (theo 1/ΔT) rồi KÉO DÀI thêm về hai phía
     → thấy rõ xu hướng. Vì 1/ΔT không bao giờ bằng 0 nên đường KHÔNG được kéo về gốc tọa độ:
     phía trái chỉ kéo dài thêm một đoạn (LINE_EXTEND_RATIO × độ rộng trục x) và luôn dừng
     trước x = 0; phía phải kéo dài đến hết khung. */
  if (points.length >= 2) {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const first = sorted[0], last = sorted[sorted.length - 1];
    if (last.x - first.x > 1e-9) {
      const m = (last.y - first.y) / (last.x - first.x);
      const yAt = (x) => first.y + m * (x - first.x);
      ctx.save();
      ctx.beginPath();
      ctx.rect(padL, padT, plotW, plotH);   // cắt phần đường vượt ra ngoài khung
      ctx.clip();
      ctx.strokeStyle = CHART_COLORS.line;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const ext = LINE_EXTEND_RATIO * (domainMaxX - domainMinX);
      const xFrom = Math.max(first.x - ext, first.x * 0.5);   // không bao giờ chạm x = 0
      const xTo = Math.min(last.x + ext, domainMaxX);
      ctx.moveTo(xScale(xFrom), yScale(yAt(xFrom)));
      ctx.lineTo(xScale(xTo), yScale(yAt(xTo)));
      ctx.stroke();
      ctx.restore();
    }
  }

  const pixelPoints = points.map(p => ({ ...p, px: xScale(p.x), py: yScale(p.y) }));
  /* Đếm số lần đo trùng đúng một vị trí (các điểm trùng nhau chỉ hiện thành 1 chấm) */
  pixelPoints.forEach(p => {
    p.count = pixelPoints.filter(q => Math.hypot(q.px - p.px, q.py - p.py) < 1).length;
  });
  pixelPoints.forEach(p => {
    const isHover = hover && hover === p;
    ctx.beginPath();
    ctx.fillStyle = CHART_COLORS.point;
    ctx.arc(p.px, p.py, isHover ? POINT_RADIUS + 2 : POINT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = isHover ? 1.5 : 1;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  });

  /* Nhãn ×n cạnh những chấm do nhiều lần đo trùng nhau.
     Mỗi nhãn thử lần lượt các vị trí (dưới-phải → trên-trái); nhãn nào đè lên nhãn/chấm khác thì bỏ qua
     (số lần trùng vẫn xem được khi rê chuột vào điểm). */
  {
    const labelled = [];
    const boxes = [];
    ctx.font = '700 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    pixelPoints.forEach(p => {
      if (p.count < 2 || labelled.some(q => Math.hypot(q.px - p.px, q.py - p.py) < 1)) return;
      labelled.push(p);
      const txt = `×${p.count}`;
      const tw = ctx.measureText(txt).width, th = 12;
      const candidates = [
        { x: p.px + 7,       y: p.py + 3 },
        { x: p.px - 7 - tw,  y: p.py - 3 - th }
      ];
      const spot = candidates.find(c => {
        const box = { x: c.x, y: c.y, w: tw, h: th };
        const clashLabel = boxes.some(b => hit(box, b));
        const clashPoint = pixelPoints.some(q => q !== p && hit(box, { x: q.px - POINT_RADIUS, y: q.py - POINT_RADIUS, w: POINT_RADIUS * 2, h: POINT_RADIUS * 2 }));
        return !clashLabel && !clashPoint;
      });
      if (!spot) return;
      boxes.push({ x: spot.x, y: spot.y, w: tw, h: th });
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#fff';
      ctx.strokeText(txt, spot.x, spot.y);
      ctx.fillStyle = CHART_COLORS.line;
      ctx.fillText(txt, spot.x, spot.y);
    });
  }

  if (hover) {
    const label = `1/ΔT = ${fmt(hover.x, 5)}  ·  ${RESULT_LABEL} = ${fmt(hover.y)} ${RESULT_UNIT}` + (hover.count > 1 ? `  ·  ${hover.count} lần đo trùng` : '');
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
  getChartState(sections.editable.canvasId).axisScale = null;   // thang trục về như lúc mở trang
  sections.editable.rows = SAMPLE.map(r => ({ ...r }));
  renderTable(sections.editable);
  updateSummaryAndChart(sections.editable);
}
function clearTable() {
  getChartState(sections.editable.canvasId).axisScale = null;   // thang trục về như lúc mở trang
  /* Bảng trống: giữ nguyên số dòng như dữ liệu mẫu, mọi ô để trống (hiện "-") */
  sections.editable.rows = SAMPLE.map(() => blankRow());
  renderTable(sections.editable);
  updateSummaryAndChart(sections.editable);
}

function init() {
  document.getElementById('btn-add').addEventListener('click', addRow);
  document.getElementById('btn-sample').addEventListener('click', loadSample);
  document.getElementById('btn-clear').addEventListener('click', clearTable);

  clearTable();   // ban đầu: các lần đo để trống, hiện "-" ở mọi cột

  renderTable(sections.fixed);
  updateSummaryAndChart(sections.fixed);
}

document.addEventListener('DOMContentLoaded', init);
