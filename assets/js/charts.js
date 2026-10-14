/* ============================================================
   BTD.Charts — dependency-free canvas charts
   cha0smagicklabs.com · MIT
   ============================================================ */
(function () {
  "use strict";
  window.BTD = window.BTD || {};

  function prep(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(rect.width, 50), h = Math.max(rect.height, 50);
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx, w, h };
  }

  /* line chart: series = [{label, color, data:[y,...]}] */
  function line(canvas, series, opts) {
    opts = opts || {};
    const { ctx, w, h } = prep(canvas);
    const pad = { l: 46, r: 10, t: 12, b: 22 };
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    let min = opts.min !== undefined ? opts.min : Infinity;
    let max = opts.max !== undefined ? opts.max : -Infinity;
    const n = Math.max(...series.map(s => s.data.length));
    series.forEach(s => s.data.forEach(y => {
      if (min > y) min = y; if (max < y) max = y;
    }));
    if (!isFinite(min)) { min = 0; max = 1; }
    if (min === max) { min -= 1; max += 1; }
    const X = (i) => pad.l + (n <= 1 ? iw / 2 : iw * i / (n - 1));
    const Y = (y) => pad.t + ih * (1 - (y - min) / (max - min));

    ctx.strokeStyle = "rgba(212,175,55,.25)";
    ctx.fillStyle = "#cfc3a9";
    ctx.font = "10px system-ui";
    ctx.lineWidth = 1;
    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const y = min + (max - min) * t / ticks;
      const yy = Y(y);
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(w - pad.r, yy); ctx.stroke();
      ctx.textAlign = "right";
      const lbl = opts.fmt ? opts.fmt(y) : Math.round(y);
      ctx.fillText(String(lbl), pad.l - 6, yy + 3);
    }
    series.forEach(s => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      s.data.forEach((y, i) => { const x = X(i), yy = Y(y); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); });
      ctx.stroke();
    });
    if (opts.zero && min < 0 && max > 0) {
      const zy = Y(0);
      ctx.strokeStyle = "rgba(245,234,214,.5)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(pad.l, zy); ctx.lineTo(w - pad.r, zy); ctx.stroke();
      ctx.setLineDash([]);
    }
    return { X, Y, min, max, n, pad, iw, ih, w, h };
  }

  /* bar chart: values[], labels[] */
  function bars(canvas, values, labels, opts) {
    opts = opts || {};
    const { ctx, w, h } = prep(canvas);
    const pad = { l: 46, r: 10, t: 12, b: 26 };
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    const min = opts.min !== undefined ? opts.min : Math.min(0, ...values);
    const max = opts.max !== undefined ? opts.max : Math.max(...values) * 1.08;
    const Y = (y) => pad.t + ih * (1 - (y - min) / (max - min || 1));
    const bw = iw / values.length;
    ctx.strokeStyle = "rgba(212,175,55,.25)";
    ctx.fillStyle = "#cfc3a9";
    ctx.font = "10px system-ui";
    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const y = min + (max - min) * t / ticks;
      const yy = Y(y);
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(w - pad.r, yy); ctx.stroke();
      ctx.textAlign = "right";
      ctx.fillText(opts.fmt ? opts.fmt(y) : String(Math.round(y * 10) / 10), pad.l - 6, yy + 3);
    }
    values.forEach((v, i) => {
      const x = pad.l + bw * i + bw * 0.15;
      const bwidth = bw * 0.7;
      const y0 = Y(Math.max(0, min)), y1 = Y(v);
      ctx.fillStyle = (opts.colors && opts.colors[i]) || (v >= 0 ? "#58d68d" : "#e74c3c");
      ctx.fillRect(x, Math.min(y0, y1), bwidth, Math.abs(y1 - y0) || 1);
      ctx.fillStyle = "#cfc3a9";
      ctx.textAlign = "center";
      if (labels && labels[i]) ctx.fillText(labels[i], x + bwidth / 2, h - 8);
    });
  }

  window.BTD.Charts = { line, bars };
})();
