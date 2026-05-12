
// ───── tweaks-panel.jsx ─────

// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', noDeckControls = false, children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(
    () => typeof document !== 'undefined' && !!document.querySelector('deck-stage'),
    [],
  );
  // Hide the toggle until the host has actually enabled the rail (the
  // __omelette_rail_enabled window message, posted only when the
  // omelette_deck_rail_enabled flag is on for this user). The initial read
  // covers TweaksPanel mounting after the message already arrived; the
  // listener covers the common case of mounting first.
  const [railEnabled, setRailEnabled] = React.useState(
    () => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled,
  );
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = (e) => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try { return localStorage.getItem('deck-stage.railVisible') !== '0'; } catch (e) { return true; }
  });
  const toggleRail = (on) => {
    setRailVisible(on);
    window.postMessage({ type: '__deck_rail_visible', on }, '*');
  };
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-noncommentable=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
          {hasDeckStage && railEnabled && !noDeckControls && (
            <TweakSection label="Deck">
              <TweakToggle label="Thumbnail rail" value={railVisible} onChange={toggleRail} />
            </TweakSection>
          )}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});


// ───── icons.jsx ─────
// icons.jsx — shared inline SVG icons. All stroke-based, 1.5px stroke for clarity.

const Icon = ({ d, size = 16, fill = 'none', stroke = 'currentColor', sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const IconMap = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
    <path d="M9 4v14" />
    <path d="M15 6v14" />
  </>} />
);
const IconCompare = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M4 6h7" /><path d="M4 12h7" /><path d="M4 18h7" />
    <path d="M16 6h4" /><path d="M16 12h4" /><path d="M16 18h4" />
  </>} />
);
const IconTrophy = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4a3 3 0 0 0 3 3" />
    <path d="M17 6h3a3 3 0 0 1-3 3" />
    <path d="M10 14h4l-1 4h-2l-1-4Z" />
    <path d="M8 20h8" />
  </>} />
);
const IconLeaf = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" />
    <path d="M5 19c4-4 8-8 14-14" />
  </>} />
);
const IconChart = ({ size = 16 }) => (
  <Icon size={size} d={<>
    <path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" />
  </>} />
);
const IconBike = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <circle cx="6" cy="17" r="3.5" />
    <circle cx="18" cy="17" r="3.5" />
    <path d="M6 17 12 7h4" />
    <path d="m12 7 6 10" />
    <path d="M8 7h4" />
  </>} />
);
const IconTrain = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <rect x="6" y="3" width="12" height="14" rx="2" />
    <path d="M6 11h12" />
    <circle cx="9" cy="14" r=".7" fill="currentColor" />
    <circle cx="15" cy="14" r=".7" fill="currentColor" />
    <path d="m7 21 2-2M17 21l-2-2" />
  </>} />
);
const IconBus = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <rect x="4" y="4" width="16" height="13" rx="2" />
    <path d="M4 11h16" />
    <circle cx="8" cy="20" r="1.4" />
    <circle cx="16" cy="20" r="1.4" />
    <path d="M7 8h3M14 8h3" />
  </>} />
);
const IconCar = ({ size = 18 }) => (
  <Icon size={size} sw={1.8} d={<>
    <path d="M4 14v3h16v-3" />
    <path d="m4 14 2-6h12l2 6" />
    <circle cx="7.5" cy="17" r="1.4" />
    <circle cx="16.5" cy="17" r="1.4" />
  </>} />
);
const IconArrow = ({ size = 16 }) => (
  <Icon size={size} d={<path d="M5 12h14M13 6l6 6-6 6" />} />
);
const IconSwap = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <path d="M7 4v16" /><path d="m3 8 4-4 4 4" />
    <path d="M17 20V4" /><path d="m21 16-4 4-4-4" />
  </>} />
);
const IconPlus = ({ size = 14 }) => <Icon size={size} d={<><path d="M12 5v14M5 12h14" /></>} />;
const IconCrosshair = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="2.5" />
  </>} />
);
const IconMinus = ({ size = 14 }) => <Icon size={size} d={<path d="M5 12h14" />} />;
const IconCheck = ({ size = 16 }) => <Icon size={size} sw={2.2} d={<path d="M4 12l5 5L20 6" />} />;
const IconClock = ({ size = 14 }) => (
  <Icon size={size} d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />
);
const IconRoute = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" />
    <path d="M8 6h8a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h8" />
  </>} />
);
const IconCo2 = ({ size = 14 }) => (
  <Icon size={size} d={<><circle cx="12" cy="12" r="9" /><path d="M16 9a4 4 0 1 0 0 6" /></>} />
);
const IconStar = ({ size = 14 }) => (
  <Icon size={size} d={<path d="m12 3 2.6 5.6 6 .9-4.4 4.2 1 6.1L12 17l-5.2 2.8 1-6.1L3.4 9.5l6-.9L12 3Z" />} />
);
const IconLock = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </>} />
);
const IconLightning = ({ size = 14 }) => (
  <Icon size={size} fill="currentColor" stroke="none"
    d={<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />} />
);
const IconFlame = ({ size = 14 }) => (
  <Icon size={size} d={<>
    <path d="M12 3c1 4 5 5 5 10a5 5 0 1 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4 0-3 0-5 0-7Z" />
  </>} />
);

Object.assign(window, {
  Icon, IconMap, IconCompare, IconTrophy, IconLeaf, IconChart,
  IconBike, IconTrain, IconBus, IconCar, IconArrow, IconSwap,
  IconPlus, IconMinus, IconCheck, IconClock, IconRoute, IconCo2,
  IconStar, IconLock, IconLightning, IconFlame, IconCrosshair,
});


// ───── map.jsx ─────
// map.jsx — Leaflet-backed real map of Merseyside.

const LIME_STREET = [53.4076, -2.9774];
const SEFTON_PARK = [53.3845, -2.9466];

const ROUTES_LL = {
  bike: [
    [53.4076, -2.9774], [53.4055, -2.9760], [53.4030, -2.9740],
    [53.4005, -2.9700], [53.3975, -2.9655], [53.3945, -2.9610],
    [53.3915, -2.9555], [53.3885, -2.9510], [53.3860, -2.9485],
    [53.3845, -2.9466],
  ],
  bus: [
    [53.4076, -2.9774], [53.4060, -2.9770], [53.4030, -2.9760],
    [53.4000, -2.9745], [53.3970, -2.9720], [53.3945, -2.9680],
    [53.3925, -2.9630], [53.3905, -2.9580], [53.3885, -2.9530],
    [53.3865, -2.9495], [53.3845, -2.9466],
  ],
  train: [
    [53.4076, -2.9774], [53.4070, -2.9740], [53.4055, -2.9700],
    [53.4030, -2.9660], [53.4000, -2.9620], [53.3960, -2.9580],
    [53.3915, -2.9540], [53.3880, -2.9510], [53.3855, -2.9485],
    [53.3845, -2.9466],
  ],
  car: [
    [53.4076, -2.9774], [53.4085, -2.9755], [53.4090, -2.9720],
    [53.4080, -2.9670], [53.4050, -2.9610], [53.4010, -2.9560],
    [53.3970, -2.9520], [53.3925, -2.9490], [53.3880, -2.9475],
    [53.3845, -2.9466],
  ],
};

const MODE_COLORS = {
  bike: '#2f8d5b', bus: '#3a7bd5', train: '#7a4ec9', car: '#d35a3a',
};

const AQ_LL = [
  { lat: 53.4500, lng: -2.9900, r: 1800, band: 'good' },
  { lat: 53.4300, lng: -2.9750, r: 1500, band: 'mid' },
  { lat: 53.4090, lng: -2.9870, r: 1300, band: 'poor' },
  { lat: 53.3950, lng: -2.9550, r: 1400, band: 'mid' },
  { lat: 53.3800, lng: -2.9300, r: 1600, band: 'good' },
  { lat: 53.3900, lng: -3.0300, r: 2000, band: 'good' },
  { lat: 53.4500, lng: -2.8900, r: 1800, band: 'good' },
];

const AQ_COLORS = { good: '#3e9c6a', mid: '#e0a83a', poor: '#cc5b48' };

// Congestion hotspots — each has a base intensity curve sampled by predicted minute offset
// Bands shift over time to suggest ML predictions.
const CONGESTION_HOTSPOTS = [
  { lat: 53.4076, lng: -2.9774, r: 800,  label: 'Lime St gyratory',  base: [0.75, 0.85, 0.92, 0.88, 0.70, 0.45] },
  { lat: 53.4032, lng: -2.9680, r: 900,  label: 'A5039 Catharine',   base: [0.55, 0.70, 0.82, 0.85, 0.78, 0.55] },
  { lat: 53.3958, lng: -2.9530, r: 1000, label: 'Smithdown Rd',      base: [0.85, 0.92, 0.95, 0.86, 0.62, 0.40] },
  { lat: 53.4140, lng: -2.9920, r: 1100, label: 'Strand / Mann Is',  base: [0.40, 0.55, 0.72, 0.80, 0.75, 0.60] },
  { lat: 53.3880, lng: -2.9410, r: 850,  label: 'Aigburth Rd / A561',base: [0.30, 0.42, 0.55, 0.68, 0.78, 0.85] },
  { lat: 53.4220, lng: -2.9580, r: 950,  label: 'Edge Lane / M62',   base: [0.65, 0.78, 0.88, 0.92, 0.85, 0.70] },
  { lat: 53.3760, lng: -2.9750, r: 1000, label: 'Otterspool prom',   base: [0.20, 0.28, 0.35, 0.42, 0.50, 0.55] },
];

const CONGESTION_COLORS = ['#3e9c6a', '#94b14f', '#e0a83a', '#e08442', '#cc5b48', '#a23a4a'];

function bandIndex(v) {
  // 0..1 → 0..5
  return Math.min(5, Math.max(0, Math.floor(v * 6)));
}

function intensityAt(spot, minuteOffset) {
  // Each base entry is at 0,15,30,45,60,75 min. Linear interpolate.
  const idx = (minuteOffset / 15);
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, spot.base.length - 1);
  const t = idx - i0;
  return spot.base[i0] * (1 - t) + spot.base[i1] * t;
}

// ── ML helpers (faux ST-GCN inference signals) ────────────────────────
// Confidence decays with horizon: ~96% at now → ~74% at +75m
function confidenceAt(minute) {
  return Math.max(0.65, 0.96 - 0.0029 * minute);
}

// Stable per-spot weekday baseline (mean of historical flow at this minute).
// Slightly below current prediction so deltas are meaningful and signed.
function baselineAt(spot, minute) {
  const v = intensityAt(spot, minute);
  const seed = Math.abs(Math.sin(spot.lat * 91.7 + spot.lng * 53.3));
  const off = 0.08 + seed * 0.18; // 0.08..0.26
  return Math.max(0.04, v - off);
}

// City-wide forecast series across the horizon.
function forecastSeries() {
  return [0, 15, 30, 45, 60, 75].map(m => {
    const mean = CONGESTION_HOTSPOTS.reduce((s, sp) => s + intensityAt(sp, m), 0) / CONGESTION_HOTSPOTS.length;
    return { m, v: mean };
  });
}

// Compact sparkline w/ a shaded confidence band. Crosshair on selected step.
function ForecastSpark({ series, conf, selected }) {
  const W = 256, H = 60, PAD_L = 6, PAD_R = 6, PAD_T = 6, PAD_B = 14;
  const N = series.length;
  const xs = series.map((_, i) => PAD_L + i * (W - PAD_L - PAD_R) / (N - 1));
  const yAt = v => PAD_T + (1 - v) * (H - PAD_T - PAD_B);
  const path = series.map((p, i) => (i ? 'L' : 'M') + xs[i].toFixed(1) + ',' + yAt(p.v).toFixed(1)).join(' ');
  const band = 0.06 + 0.14 * (1 - conf);
  const up = series.map((p, i) => xs[i].toFixed(1) + ',' + yAt(Math.min(1, p.v + band)).toFixed(1));
  const dn = series.map((p, i) => xs[i].toFixed(1) + ',' + yAt(Math.max(0, p.v - band)).toFixed(1)).reverse();
  const bandPath = 'M' + up.join(' L') + ' L' + dn.join(' L') + ' Z';
  const HORIZONS = [0, 15, 30, 45, 60, 75];
  const sel = HORIZONS.indexOf(selected);
  return (
    <svg className="cp-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Forecast sparkline">
      <path d={bandPath} fill="rgba(204,91,72,0.13)" />
      <path d={path} fill="none" stroke="#cc5b48" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {sel >= 0 && (
        <g>
          <line x1={xs[sel]} x2={xs[sel]} y1={PAD_T} y2={H - PAD_B} stroke="rgba(15,25,55,0.22)" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx={xs[sel]} cy={yAt(series[sel].v)} r="3.2" fill="#fff" stroke="#cc5b48" strokeWidth="1.6" />
        </g>
      )}
      <text x={PAD_L} y={H - 3} fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="rgba(15,25,55,0.5)">now</text>
      <text x={W - 22} y={H - 3} fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="rgba(15,25,55,0.5)">+75m</text>
    </svg>
  );
}

const TILE_PROVIDERS = {
  realistic: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© OSM · © CARTO', subdomains: 'abcd',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OSM · © CARTO', subdomains: 'abcd',
  },
  illustrated: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© OSM · © CARTO', subdomains: 'abcd',
  },
};

function RouteMap({
  showRoute = "none",
  mapLayer = "streets", // streets | aq | congestion
  predictedMinutes = 0,
  selected = null,
  style = "realistic",
  userLocation = null,
}) {
  const hostRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const tileRef = React.useRef(null);
  const layerRef = React.useRef(null);

  React.useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    if (typeof L === 'undefined') return;
    const map = L.map(hostRef.current, {
      center: [53.397, -2.962], zoom: 13,
      zoomControl: false, attributionControl: false,
      scrollWheelZoom: false, dragging: true,
      doubleClickZoom: true, preferCanvas: true,
    });
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    window.__erMap = {
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      fitRoute: () => map.fitBounds([LIME_STREET, SEFTON_PARK], { padding: [40, 40] }),
    };
    return () => { map.remove(); mapRef.current = null; tileRef.current = null; layerRef.current = null; };
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileRef.current) map.removeLayer(tileRef.current);
    const p = TILE_PROVIDERS[style] || TILE_PROVIDERS.realistic;
    tileRef.current = L.tileLayer(p.url, {
      attribution: p.attribution, subdomains: p.subdomains,
      maxZoom: 19, detectRetina: true,
    }).addTo(map);
  }, [style]);

  React.useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    // AQ layer
    if (mapLayer === 'aq') {
      AQ_LL.forEach(p => {
        L.circle([p.lat, p.lng], { radius: p.r, color: AQ_COLORS[p.band], fillColor: AQ_COLORS[p.band], fillOpacity: 0.22, weight: 0, interactive: false }).addTo(layer);
        L.circle([p.lat, p.lng], { radius: p.r * 0.55, color: AQ_COLORS[p.band], fillColor: AQ_COLORS[p.band], fillOpacity: 0.18, weight: 0, interactive: false }).addTo(layer);
      });
    }

    // Congestion layer — smooth radial gradient via concentric falloff rings
    if (mapLayer === 'congestion') {
      CONGESTION_HOTSPOTS.forEach((spot) => {
        const v = intensityAt(spot, predictedMinutes);
        if (v < 0.18) return; // skip near-empty spots so the map breathes
        const color = CONGESTION_COLORS[bandIndex(v)];
        const baseRadius = spot.r * (0.8 + v * 0.7);
        // 6 concentric rings from large+faint outer to small+strong core
        const RINGS = 6;
        for (let i = 0; i < RINGS; i++) {
          const t = i / (RINGS - 1);          // 0 outer → 1 inner
          const radius = baseRadius * (1 - t * 0.85);
          const fillOpacity = (0.05 + t * 0.18) * (0.4 + v * 0.6);
          L.circle([spot.lat, spot.lng], {
            radius, color, fillColor: color,
            fillOpacity, weight: 0, interactive: false,
          }).addTo(layer);
        }
      });
    }

    // Route polylines
    const modes =
      showRoute === 'none' ? [] :
      showRoute === 'all' ? ['car', 'bus', 'train', 'bike'] :
      [showRoute];

    modes.forEach((mode) => {
      const isSelected = selected === mode;
      const isDimmed = selected && selected !== mode;
      const coords = ROUTES_LL[mode];
      L.polyline(coords, { color: '#fff', weight: isSelected ? 9 : 7, opacity: isDimmed ? 0.4 : 0.95, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(layer);
      L.polyline(coords, { color: MODE_COLORS[mode], weight: isSelected ? 5.5 : 4, opacity: isDimmed ? 0.5 : 1, lineCap: 'round', lineJoin: 'round', interactive: false, dashArray: mode === 'train' ? '1, 9' : null }).addTo(layer);
    });

    if (showRoute !== 'none') {
      const fromIcon = L.divIcon({ className: '', html: '<div class="er-pin er-pin-from"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      const toIcon = L.divIcon({ className: '', html: '<div class="er-pin er-pin-to"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      L.marker(LIME_STREET, { icon: fromIcon, interactive: false }).addTo(layer);
      L.marker(SEFTON_PARK, { icon: toIcon, interactive: false }).addTo(layer);
    }

    if (userLocation) {
      const userIcon = L.divIcon({ className: '', html: '<div class="er-pin er-pin-user"><span class="er-pulse"></span><span class="er-dot"></span></div>', iconSize: [28, 28], iconAnchor: [14, 14] });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, interactive: false }).addTo(layer);
    }

    if (modes.length > 0) {
      map.fitBounds([LIME_STREET, SEFTON_PARK], { padding: [40, 40], maxZoom: 14 });
    }
  }, [showRoute, mapLayer, predictedMinutes, selected, userLocation]);

  return <div ref={hostRef} className="leaflet-host" />;
}

// Traffic forecast widget — ST-GCN spatio-temporal model w/ confidence band,
// per-segment risk + anomaly flags, and SHAP-style driver attribution.
function CongestionPanel({ predictedMinutes, setPredictedMinutes }) {
  const simpleLevel = (v) => v < 0.4 ? 0 : v < 0.7 ? 1 : 2;
  const LEVEL = [
    { label: 'Clear', color: '#3e9c6a' },
    { label: 'Slow',  color: '#e0a83a' },
    { label: 'Heavy', color: '#cc5b48' },
  ];

  const ranked = CONGESTION_HOTSPOTS
    .map(s => ({ name: s.label, v: intensityAt(s, predictedMinutes), b: baselineAt(s, predictedMinutes) }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 3);

  const overall = simpleLevel(ranked[0].v);
  const headline =
    overall === 0 ? 'Traffic is light' :
    overall === 1 ? 'Some slow spots' :
                    'Heavy in places';

  const conf = confidenceAt(predictedMinutes);
  const series = forecastSeries();
  const latencyMs = Math.round(34 + (predictedMinutes / 15) * 2.6);

  const CHOICES = [
    { v: 0,  label: 'Now' },
    { v: 30, label: '+30 min' },
    { v: 60, label: '+1 hr' },
  ];

  return (
    <div className="congest-panel cp-ml">
      <div className="congest-head">
        <div className="cp-head-l">
          <div className="congest-title">Predictive Congestion ML</div>
          <div className="congest-headline" style={{ color: LEVEL[overall].color }}>
            <span className="hl-dot" style={{ background: LEVEL[overall].color }} />
            {headline}
          </div>
        </div>
        <div className="cp-conf">
          <div className="cp-conf-v">{Math.round(conf * 100)}%</div>
          <div className="cp-conf-l">conf.</div>
        </div>
      </div>

      <div className="cp-submeta">
        <span className="cp-model">ST-GCN v2.4</span>
        <span className="cp-sep">·</span>
        <span className="cp-mono">{latencyMs} ms</span>
      </div>

      <div className="congest-seg" role="tablist">
        {CHOICES.map(c => (
          <button
            key={c.v}
            role="tab"
            aria-selected={predictedMinutes === c.v}
            className={predictedMinutes === c.v ? 'on' : ''}
            onClick={() => setPredictedMinutes(c.v)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ForecastSpark series={series} conf={conf} selected={predictedMinutes} />

      <ul className="congest-list cp-list-ml">
        {ranked.map((r) => {
          const lvl = simpleLevel(r.v);
          const deltaPct = Math.round(((r.v - r.b) / Math.max(r.b, 0.05)) * 100);
          return (
            <li key={r.name}>
              <span className="cl-dot" style={{ background: LEVEL[lvl].color }} />
              <span className="cl-name">{r.name}</span>
              <span className="cp-delta" style={{ color: deltaPct >= 0 ? '#cc5b48' : '#3e9c6a' }}>
                {deltaPct >= 0 ? '+' : ''}{deltaPct}%
              </span>
              <span className="cl-tag" style={{ color: LEVEL[lvl].color }}>{LEVEL[lvl].label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

Object.assign(window, { RouteMap, CongestionPanel, CONGESTION_HOTSPOTS, intensityAt, bandIndex, CONGESTION_COLORS });


// ───── screen-home.jsx ─────
// screens.jsx — Home, Compare, Confirm, Stats screens

// ── Demo data ──────────────────────────────────────────────────────────
const DEMO_ROUTE = {
  from: "Liverpool Lime Street",
  fromMeta: "L1 1JD",
  to: "Sefton Park",
  toMeta: "Lark Lane, L17",
};

const MODES = [
  {
    key: "bike",
    label: "Bike",
    sublabel: "via Hope St & Princes Park",
    Icon: window.IconBike,
    co2: 0.00,
    time: 16,
    distance: 3.8,
    points: 50,
    cal: 142,
    badges: [
      { kind: "green", text: "Greenest" },
      { kind: "amber", text: "Most points" },
    ],
    steps: [
      { t: "Start at Lime Street", m: "Cycle south on Lime St", time: "0 min" },
      { t: "Right onto Hope Street", m: "Pass Liverpool Cathedral", time: "4 min" },
      { t: "Princes Avenue cycle lane", m: "Segregated path, 1.2 km", time: "8 min" },
      { t: "Arrive Sefton Park", m: "Park entry at Aigburth Dr", time: "16 min" },
    ],
  },
  {
    key: "train",
    label: "Train + walk",
    sublabel: "Merseyrail to St Michaels",
    Icon: window.IconTrain,
    co2: 0.18,
    time: 28,
    distance: 4.2,
    points: 35,
    cal: 38,
    badges: [
      { kind: "navy", text: "Cleanest motorised" },
    ],
    steps: [
      { t: "Walk to Lime Street", m: "Concourse, platform 4", time: "0 min" },
      { t: "Northern Line to St Michaels", m: "3 stops · Merseyrail", time: "9 min" },
      { t: "Walk along Aigburth Rd", m: "0.7 km", time: "20 min" },
      { t: "Arrive Sefton Park", m: "via Lark Lane", time: "28 min" },
    ],
  },
  {
    key: "bus",
    label: "Bus",
    sublabel: "Arriva 80A",
    Icon: window.IconBus,
    co2: 0.31,
    time: 22,
    distance: 4.5,
    points: 25,
    cal: 12,
    badges: [
      { kind: "gray", text: "Fewest changes" },
    ],
    steps: [
      { t: "Lime Street stop LS3", m: "Bus 80A · 3 min wait", time: "0 min" },
      { t: "Ride to Smithdown Rd", m: "13 stops", time: "18 min" },
      { t: "Short walk to Lark Lane", m: "0.3 km", time: "22 min" },
    ],
  },
  {
    key: "car",
    label: "Solo car",
    sublabel: "via A561",
    Icon: window.IconCar,
    co2: 0.94,
    time: 12,
    distance: 4.6,
    points: 0,
    cal: 0,
    badges: [
      { kind: "amber", text: "Fastest" },
    ],
    steps: [
      { t: "Pull out of Lime St", m: "Onto Lime Street southbound", time: "0 min" },
      { t: "A562 Catharine St", m: "1.8 km", time: "6 min" },
      { t: "Right onto A561", m: "2.4 km", time: "10 min" },
      { t: "Arrive Sefton Park", m: "Aigburth Dr", time: "12 min" },
    ],
  },
];

const RECENTS = [
  { from: "Albert Dock", to: "University of Liverpool", meta: "2.1 km · 3 days ago", mode: "bike" },
  { from: "Birkenhead", to: "Pier Head", meta: "Ferry · 1 week ago", mode: "train" },
  { from: "Anfield", to: "Liverpool ONE", meta: "5.4 km · 2 weeks ago", mode: "bus" },
];

const LEADERBOARD = [
  { name: "Jamie O.", pts: 1840, av: "JO" },
  { name: "Priya K.", pts: 1632, av: "PK" },
  { name: "Marcus T.", pts: 1488, av: "MT" },
  { name: "You", pts: 1245, av: "AS", you: true },
  { name: "Sam W.", pts: 1180, av: "SW" },
  { name: "Reece B.", pts: 1062, av: "RB" },
];

const ACHIEVEMENTS = [
  { name: "First Ride", desc: "Logged your first green trip", earned: true, Ico: window.IconStar },
  { name: "Week Streak", desc: "7 days in a row", earned: true, Ico: window.IconFlame },
  { name: "Half a tonne", desc: "Save 500kg CO₂ lifetime", earned: false, Ico: window.IconLeaf, prog: "318 / 500 kg" },
  { name: "Mersey Loop", desc: "Cross the river by ferry", earned: true, Ico: window.IconRoute },
  { name: "Off-peak Pro", desc: "30 trips outside rush", earned: false, Ico: window.IconClock, prog: "22 / 30" },
  { name: "Cathedral Climb", desc: "Bike up Hope Street", earned: false, Ico: window.IconLightning, prog: "Locked" },
];

const WEEK = [
  { d: "Mon", v: 0.72, mode: "bike" },
  { d: "Tue", v: 0.34, mode: "bus" },
  { d: "Wed", v: 0.00, mode: "off" },
  { d: "Thu", v: 0.88, mode: "bike" },
  { d: "Fri", v: 0.42, mode: "train" },
  { d: "Sat", v: 1.10, mode: "bike" },
  { d: "Sun", v: 0.18, mode: "train" },
];

Object.assign(window, { DEMO_ROUTE, MODES, RECENTS, LEADERBOARD, ACHIEVEMENTS, WEEK });

// ── Confetti generator ─────────────────────────────────────────────────
function Confetti({ count = 36, run = true }) {
  const pieces = React.useMemo(() => {
    if (!run) return [];
    const colors = ['var(--amber)', 'var(--navy)', 'var(--mode-bike)', 'var(--amber-deep)', '#fff'];
    return Array.from({ length: count }, (_, i) => ({
      i,
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 240,
      rot: 200 + Math.random() * 800,
      color: colors[i % colors.length],
      delay: Math.random() * 200,
      duration: 1800 + Math.random() * 1200,
    }));
  }, [run, count]);
  if (!run) return null;
  return (
    <div className="confetti-stage">
      {pieces.map((p) => {
        const s = {
          left: p.left + '%',
          background: p.color,
          animationDelay: p.delay + 'ms',
          animationDuration: p.duration + 'ms',
        };
        s['--dx'] = p.dx + 'px';
        s['--rot'] = p.rot + 'deg';
        return <span key={p.i} className="confetti" style={s} />;
      })}
    </div>
  );
}

// ── Animated counter ───────────────────────────────────────────────────
function useTickingNumber(target, { stepMs = 60, increment = 0.001 } = {}) {
  const [v, setV] = React.useState(target);
  React.useEffect(() => {
    const id = setInterval(() => {
      setV((cur) => cur + increment * (0.6 + Math.random() * 0.9));
    }, stepMs);
    return () => clearInterval(id);
  }, [stepMs, increment]);
  return v;
}

// ── HOME ───────────────────────────────────────────────────────────────
function HomeScreen({ from, to, onChangeFrom, onChangeTo, onPlan, onSelectRecent, mapLayer, setMapLayer, predictedMinutes, setPredictedMinutes, mapStyle, communityCO2, userLocation, locating, locateError, onUseMyLocation, locationLabel }) {
  const live = useTickingNumber(communityCO2, { stepMs: 800, increment: 0.012 });

  return (
    <div className="home-grid">
      {/* Left panel: route entry */}
      <div className="card card-pad rise" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="tag tag-amber" style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
          Plan a journey
        </div>
        <h1 className="panel-h1">Where are you off to?</h1>
        <p className="panel-sub">We'll compare four ways across Merseyside — and the greener you choose, the more you earn.</p>

        <div className="input-stack">
          <div className="input-row">
            <div className="input-pin from"><span /></div>
            <input value={from} onChange={(e) => onChangeFrom(e.target.value)} placeholder="From" />
            <button className="swap" onClick={() => { onChangeFrom(to); onChangeTo(from); }} aria-label="Swap">
              <window.IconSwap />
            </button>
          </div>
          <div className="input-connector" />
          <div className="input-row">
            <div className="input-pin to"><span /></div>
            <input value={to} onChange={(e) => onChangeTo(e.target.value)} placeholder="To" />
          </div>
        </div>

        <button
          className={`btn btn-locate ${locating ? 'is-locating' : ''} ${userLocation ? 'is-located' : ''}`}
          onClick={onUseMyLocation}
          disabled={locating}
          style={{ marginTop: 10, width: '100%' }}>
          {locating ? (
            <><span className="locate-spinner" /> Locating you…</>
          ) : userLocation ? (
            <>
              <span className="locate-dot" />
              Using your location
              {locationLabel && <span className="locate-meta">· {locationLabel}</span>}
            </>
          ) : (
            <>
              <window.IconCrosshair size={14} />
              Use my location
            </>
          )}
        </button>
        {locateError && (
          <div className="locate-err">{locateError}</div>
        )}

        <button className="btn btn-primary" style={{ marginTop: 10, width: '100%' }} onClick={onPlan}>
          Compare routes
          <window.IconArrow />
        </button>

        <div className="section-h" style={{ marginTop: 22 }}>Recent</div>
        <div className="recents">
          {RECENTS.map((r, i) => (
            <button key={i} className="recent-item" onClick={() => onSelectRecent(r)}>
              <div className="recent-ico">
                <window.IconRoute />
              </div>
              <div className="recent-text">
                <div className="recent-title">{r.from} → {r.to}</div>
                <div className="recent-meta">{r.meta}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mini-grid">
          <div className="mini-card">
            <div className="l">Your savings</div>
            <div className="v">318<span style={{ fontSize: 11, opacity: 0.6, marginLeft: 3, fontWeight: 500 }}>kg</span></div>
            <div className="d">+1.2kg this week</div>
          </div>
          <div className="mini-card">
            <div className="l">Streak</div>
            <div className="v">12<span style={{ fontSize: 11, opacity: 0.6, marginLeft: 3, fontWeight: 500 }}>days</span></div>
            <div className="d">Personal best</div>
          </div>
        </div>
      </div>

      {/* Right panel: map */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        <div className="map-panel rise rise-1" style={{ flex: 1 }}>
          <div className="map-shell">
            <window.RouteMap showRoute="none" mapLayer={mapLayer} predictedMinutes={predictedMinutes} style={mapStyle} userLocation={userLocation} />
            <div className="map-overlay">
              <button className={mapLayer === 'streets' ? 'on' : ''} onClick={() => setMapLayer('streets')}>Streets</button>
              <button className={mapLayer === 'aq' ? 'on' : ''} onClick={() => setMapLayer('aq')}>Air quality</button>
              <button className={mapLayer === 'congestion' ? 'on' : ''} onClick={() => setMapLayer('congestion')}>
                Traffic
              </button>
            </div>
            <div className="map-zoom">
              <button aria-label="Zoom in" onClick={() => window.__erMap?.zoomIn?.()}><window.IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out" onClick={() => window.__erMap?.zoomOut?.()}><window.IconMinus size={14} /></button>
            </div>
            {mapLayer === 'aq' && (
              <div className="map-legend">
                <div className="legend-title">PM₂.₅ (μg/m³)</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: 'var(--aq-good)' }} />Good · 0–10</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: 'var(--aq-mid)' }} />Moderate · 11–20</div>
                <div className="legend-row"><span className="legend-swatch" style={{ background: 'var(--aq-poor)' }} />Poor · 21+</div>
              </div>
            )}
            {mapLayer === 'congestion' && (
              <window.CongestionPanel
                predictedMinutes={predictedMinutes}
                setPredictedMinutes={setPredictedMinutes}
                active={true}
                onToggle={() => setMapLayer('streets')}
              />
            )}
            {!userLocation && mapLayer !== 'congestion' && (
              <div className="map-empty-cta">
                <window.IconRoute size={14} /> Enter a destination to see routes
              </div>
            )}
            <div className="map-attrib">© OpenStreetMap · © CARTO</div>
          </div>
        </div>

        <div className="ticker rise rise-2">
          <div className="ticker-ico"><window.IconLeaf size={22} /></div>
          <div className="ticker-body">
            <div className="ticker-label">Merseyside saved together · today</div>
            <div className="ticker-value num">
              <span className="tick-up" key={Math.floor(live * 100)}>{live.toFixed(2)}</span>
              <span className="unit">tonnes CO₂</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, paddingRight: 8 }}>
            <div>
              <div className="ticker-label">Trips today</div>
              <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>4,182</div>
            </div>
            <div>
              <div className="ticker-label">Active users</div>
              <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>2,310</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, Confetti, useTickingNumber });


// ───── screen-compare.jsx ─────
// screen-compare.jsx — Side-by-side mode comparison

function ModeIcon({ mode, size = 18 }) {
  const I = mode.Icon;
  return <I size={size} />;
}

function ModeCard({ mode, selected, dimmed, onSelect, onChoose, layout }) {
  return (
    <div
      className={`mode-card ${selected ? 'selected' : ''} ${dimmed ? 'dimmed' : ''}`}
      onClick={onSelect}
    >
      <div className="points-pill">
        {mode.points > 0 ? `+${mode.points} pts` : '0 pts'}
      </div>
      <div className="mode-card-h">
        <div className={`mode-ico ${mode.key}`}><ModeIcon mode={mode} /></div>
        <div>
          <div className="label">{mode.label}</div>
          <div className="sublabel">{mode.sublabel}</div>
        </div>
      </div>
      <div className="mode-card-stats">
        <div className="stat">
          <div className="stat-l">CO₂</div>
          <div className="stat-v">
            {mode.co2.toFixed(2)}<span className="stat-u">kg</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-l">Time</div>
          <div className="stat-v">{mode.time}<span className="stat-u">min</span></div>
        </div>
        <div className="stat">
          <div className="stat-l">Distance</div>
          <div className="stat-v">{mode.distance.toFixed(1)}<span className="stat-u">km</span></div>
        </div>
      </div>
      <div className="mode-badges">
        {mode.badges.map((b, i) => (
          <span key={i} className={`badge badge-${b.kind}`}>{b.text}</span>
        ))}
      </div>
      {selected && (
        <button
          className="btn btn-accent btn-sm"
          style={{ width: '100%', marginTop: 12 }}
          onClick={(e) => { e.stopPropagation(); onChoose(); }}
        >
          <window.IconCheck size={14} /> Choose this route
        </button>
      )}
    </div>
  );
}

function CompareScreen({ from, to, modes, selected, setSelected, onChoose, mapLayer, setMapLayer, predictedMinutes, setPredictedMinutes, mapStyle, cardLayout }) {
  return (
    <div className="compare">
      <div className="compare-map">
        <div className="summary-bar">
          <div className="summary-route">
            <span className="summary-pin from" />
            <span className="name">{from}</span>
            <span className="arrow">→</span>
            <span className="summary-pin to" />
            <span className="name">{to}</span>
          </div>
          <div className="summary-meta">4 ways · planned now</div>
        </div>
        <div className="map-panel" style={{ flex: 1 }}>
          <div className="map-shell">
            <window.RouteMap showRoute="all" mapLayer={mapLayer} predictedMinutes={predictedMinutes} selected={selected} style={mapStyle} />
            <div className="map-overlay">
              <button className={mapLayer === 'streets' ? 'on' : ''} onClick={() => setMapLayer('streets')}>Streets</button>
              <button className={mapLayer === 'aq' ? 'on' : ''} onClick={() => setMapLayer('aq')}>Air quality</button>
              <button className={mapLayer === 'congestion' ? 'on' : ''} onClick={() => setMapLayer('congestion')}>
                Traffic
              </button>
            </div>
            {mapLayer === 'congestion' && (
              <window.CongestionPanel
                predictedMinutes={predictedMinutes}
                setPredictedMinutes={setPredictedMinutes}
                active={true}
                onToggle={() => setMapLayer('streets')}
              />
            )}
            <div className="map-zoom">
              <button aria-label="Zoom in"><window.IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out"><window.IconMinus size={14} /></button>
            </div>
            <div className="map-legend" style={{ minWidth: 140 }}>
              <div className="legend-title">Modes</div>
              {modes.map((m) => (
                <div key={m.key} className="legend-row" style={{ opacity: selected && selected !== m.key ? 0.45 : 1 }}>
                  <span className="legend-swatch" style={{ background: `var(--mode-${m.key})` }} />
                  {m.label}
                </div>
              ))}
            </div>
            <div className="map-attrib">© EcoRoute Tiles · OpenRouteService</div>
          </div>
        </div>
      </div>

      <div className="compare-rail">
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Pick your way</h2>
            <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
              {modes.length} options
            </span>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 12.5, color: 'var(--ink-soft)' }}>
            Lower CO₂ earns more points. <strong style={{ color: 'var(--mode-bike)' }}>Greenest</strong> saves <span className="num" style={{ fontWeight: 600 }}>0.94 kg</span> vs solo car.
          </p>
        </div>

        {cardLayout === 'table' ? (
          <div className="compare-table">
            <table>
              <thead>
                <tr>
                  <th>Mode</th>
                  <th style={{ textAlign: 'right' }}>CO₂</th>
                  <th style={{ textAlign: 'right' }}>Time</th>
                  <th style={{ textAlign: 'right' }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {modes.map((m) => (
                  <tr key={m.key}
                      className={selected === m.key ? 'selected' : ''}
                      onClick={() => setSelected(m.key)}>
                    <td>
                      <div className="td-mode">
                        <div className={`mode-ico ${m.key}`} style={{ width: 26, height: 26, borderRadius: 7 }}>
                          <ModeIcon mode={m} size={14} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{m.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>{m.distance.toFixed(1)} km</div>
                        </div>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{m.co2.toFixed(2)} kg</td>
                    <td className="num" style={{ textAlign: 'right' }}>{m.time} min</td>
                    <td className="num" style={{ textAlign: 'right', fontWeight: 600, color: m.points > 0 ? 'var(--mode-bike)' : 'var(--ink-faint)' }}>
                      {m.points > 0 ? `+${m.points}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selected && (
              <div style={{ padding: 14, borderTop: '1px solid var(--hairline-soft)' }}>
                <button className="btn btn-accent" style={{ width: '100%' }} onClick={onChoose}>
                  <window.IconCheck size={14} /> Choose {modes.find(m => m.key === selected).label}
                </button>
              </div>
            )}
          </div>
        ) : (
          modes.map((m, i) => (
            <div key={m.key} className={`rise rise-${Math.min(i + 1, 4)}`}>
              <ModeCard
                mode={m}
                selected={selected === m.key}
                dimmed={selected && selected !== m.key}
                onSelect={() => setSelected(m.key)}
                onChoose={onChoose}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

Object.assign(window, { CompareScreen, ModeCard });


// ───── screen-confirm.jsx ─────
// screen-confirm.jsx — celebration after picking a mode + route steps

function ConfirmScreen({ from, to, mode, totalSaved, totalPoints, onStart, onBack, mapLayer, mapStyle }) {
  const co2Saved = (0.94 - mode.co2); // vs solo car baseline
  return (
    <div className="confirm">
      {/* Left: map view of selected route */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        <div className="summary-bar">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Change</button>
          <div className="summary-route" style={{ marginLeft: 4 }}>
            <span className="summary-pin from" />
            <span className="name">{from}</span>
            <span className="arrow">→</span>
            <span className="summary-pin to" />
            <span className="name">{to}</span>
          </div>
          {(() => {
            const ModeIco = window['Icon' + mode.key.charAt(0).toUpperCase() + mode.key.slice(1)];
            return (
              <div className={`mode-ico ${mode.key}`} style={{ width: 30, height: 30, borderRadius: 8 }}>
                {ModeIco && <ModeIco size={16} />}
              </div>
            );
          })()}
        </div>

        <div className="map-panel" style={{ flex: 1, position: 'relative' }}>
          <div className="map-shell">
            <window.RouteMap showRoute={mode.key} mapLayer={mapLayer} selected={mode.key} style={mapStyle} />
            <div className="map-zoom">
              <button aria-label="Zoom in"><window.IconPlus size={14} /></button>
              <div className="sep" />
              <button aria-label="Zoom out"><window.IconMinus size={14} /></button>
            </div>
            <div className="map-legend">
              <div className="legend-title">Selected</div>
              <div className="legend-row">
                <span className="legend-swatch" style={{ background: `var(--mode-${mode.key})` }} />
                {mode.label} · {mode.distance.toFixed(1)} km
              </div>
            </div>
            <div className="map-attrib">© EcoRoute Tiles · OpenRouteService</div>
          </div>
        </div>
      </div>

      {/* Right: celebration + steps */}
      <div className="confirm-detail">
        <div className="celebration rise">
          <Confetti run={true} count={42} />
          <div className="cel-label">Nice one</div>
          <div className="cel-title">+{mode.points} points<br/>added to your total.</div>
          <div className="points-burst">
            <window.IconLightning size={14} /> Streak +1 · 13 days
          </div>
          <div className="cel-row">
            <div className="cel-stat">
              <div className="l">CO₂ saved vs car</div>
              <div className="v amber">{co2Saved.toFixed(2)}<span style={{ fontSize: 13, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span></div>
            </div>
            <div className="cel-stat">
              <div className="l">Your lifetime</div>
              <div className="v">{(totalSaved + co2Saved).toFixed(1)}<span style={{ fontSize: 13, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span></div>
            </div>
            <div className="cel-stat">
              <div className="l">Points balance</div>
              <div className="v amber">{(totalPoints + mode.points).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="card card-pad rise rise-1">
          <div className="section-h">Step by step</div>
          <div className="steplist">
            {mode.steps.map((s, i) => (
              <div key={i} className="step">
                <div className="step-pin">
                  <div className={`dot ${i === mode.steps.length - 1 ? 'dest' : ''}`} />
                  {i < mode.steps.length - 1 && <div className="line" />}
                </div>
                <div className="step-body">
                  <div className="step-title">{s.t}</div>
                  <div className="step-meta">{s.m}</div>
                </div>
                <div className="step-time num">{s.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onStart}>
            Start trip
            <window.IconArrow />
          </button>
          <button className="btn btn-ghost" onClick={onBack}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConfirmScreen });


// ───── screen-stats.jsx ─────
// screen-stats.jsx — Personal dashboard with weekly chart, leaderboard, achievements

function StatsScreen({ totalSaved, totalPoints, totalTrips }) {
  const maxWeek = Math.max(...window.WEEK.map(w => w.v), 0.1);
  const weekSum = window.WEEK.reduce((a, b) => a + b.v, 0);

  return (
    <div className="stats">
      <div className="stats-hero rise">
        <div>
          <div className="hero-title">Hi Alex — week 18 of 2026</div>
          <div className="hero-sub">You're in the top 12% of Merseyside this week.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <span className="tag" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
              <window.IconFlame size={12} /> 13 day streak
            </span>
            <span className="tag" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
              <window.IconStar size={12} /> Level 4 · Commuter
            </span>
          </div>
        </div>
        <div className="hero-stat">
          <div className="l">CO₂ saved</div>
          <div className="v amber">{totalSaved.toFixed(1)}<span style={{ fontSize: 14, opacity: 0.7, marginLeft: 2, fontWeight: 500 }}>kg</span></div>
          <div className="delta">+{weekSum.toFixed(2)} kg this week</div>
        </div>
        <div className="hero-stat">
          <div className="l">Points</div>
          <div className="v">{totalPoints.toLocaleString()}</div>
          <div className="delta">+185 this week</div>
        </div>
        <div className="hero-stat">
          <div className="l">Trips</div>
          <div className="v">{totalTrips}</div>
          <div className="delta">+7 this week</div>
        </div>
      </div>

      <div className="chart-card rise rise-1" style={{ gridColumn: '1' }}>
        <h3>This week's CO₂ saved</h3>
        <p className="sub">vs solo car baseline · kg CO₂e</p>
        <div className="chart-bars">
          {window.WEEK.map((w, i) => {
            const h = (w.v / maxWeek) * 100;
            const cls = w.mode === 'bike' ? 'green' : w.mode === 'off' ? 'muted' : w.mode === 'bus' ? '' : 'amber';
            return (
              <div key={i} className="chart-bar-col">
                <div style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>
                  {w.v > 0 ? w.v.toFixed(2) : '—'}
                </div>
                <div className={`chart-bar ${cls}`} style={{ height: `${h}%` }} />
                <div className="chart-bar-label">{w.d}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--hairline-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span className="legend-swatch" style={{ background: 'var(--mode-bike)' }} />Bike
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span className="legend-swatch" style={{ background: 'var(--amber)' }} />Train / bus
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)' }}>
            <span className="legend-swatch" style={{ background: 'var(--hairline)' }} />Rest day
          </div>
        </div>
      </div>

      <div className="leaderboard rise rise-2">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3>Merseyside leaderboard</h3>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>This week</span>
        </div>
        <div style={{ marginTop: 4 }}>
          {window.LEADERBOARD.map((l, i) => (
            <div key={i} className={`leader-row ${l.you ? 'you' : ''}`}>
              <div className="leader-rank">{(i + 1).toString().padStart(2, '0')}</div>
              <div className="leader-avatar" style={l.you ? { background: 'var(--navy)', color: '#fff' } : {}}>{l.av}</div>
              <div className="leader-name">{l.name}</div>
              <div className="leader-pts">{l.pts.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>

      <div className="achievements rise rise-3" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3>Achievements</h3>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
            {window.ACHIEVEMENTS.filter(a => a.earned).length} / {window.ACHIEVEMENTS.length} earned
          </span>
        </div>
        <div className="achievement-grid">
          {window.ACHIEVEMENTS.map((a, i) => (
            <div key={i} className={`achievement ${a.earned ? 'earned' : 'locked'}`}>
              <div className="ach-ico">
                {a.earned ? <a.Ico size={16} /> : <window.IconLock size={14} />}
              </div>
              <div className="ach-name">{a.name}</div>
              <div className="ach-desc">{a.desc}</div>
              {a.prog && !a.earned && (
                <div style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {a.prog}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StatsScreen });


// ───── app.jsx ─────
// app.jsx — Root app: sidebar + screen router + state + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": ["#1c2a52","#e3a634","#fafaf7"],
  "mapStyle": "realistic",
  "cardLayout": "cards",
  "pointsStyle": "celebratory"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const [screen, setScreen] = React.useState('home'); // home | compare | confirm | stats
  const [from, setFrom] = React.useState(window.DEMO_ROUTE.from);
  const [to, setTo] = React.useState(window.DEMO_ROUTE.to);
  const [mapLayer, setMapLayer] = React.useState('streets'); // streets | aq | congestion
  const [predictedMinutes, setPredictedMinutes] = React.useState(0);
  const [selectedMode, setSelectedMode] = React.useState('bike');
  const [chosenMode, setChosenMode] = React.useState(null);
  const [planning, setPlanning] = React.useState(false);

  // user totals
  const [totalSaved, setTotalSaved] = React.useState(318.0);
  const [totalPoints, setTotalPoints] = React.useState(1245);
  const [totalTrips, setTotalTrips] = React.useState(47);

  const [communityCO2, setCommunityCO2] = React.useState(8.42); // tonnes today

  // geolocation
  const [userLocation, setUserLocation] = React.useState(null); // {lat, lng}
  const [locating, setLocating] = React.useState(false);
  const [locateError, setLocateError] = React.useState(null);
  const [locationLabel, setLocationLabel] = React.useState(null);

  const handleUseMyLocation = React.useCallback(() => {
    setLocateError(null);
    setLocating(true);
    const finish = (loc, label) => {
      setUserLocation(loc);
      setLocationLabel(label);
      setFrom(label || 'My location');
      setLocating(false);
    };
    const fallback = () => {
      // Liverpool city centre fallback for demo reliability
      finish({ lat: 53.4084, lng: -2.9916 }, 'Liverpool city centre');
    };
    if (!navigator.geolocation) { setLocateError('Geolocation unsupported'); fallback(); return; }
    let done = false;
    const timer = setTimeout(() => {
      if (done) return; done = true;
      setLocateError('Using approximate location');
      fallback();
    }, 4000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (done) return; done = true; clearTimeout(timer);
        finish({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'Current location');
      },
      (err) => {
        if (done) return; done = true; clearTimeout(timer);
        setLocateError(err.code === 1 ? 'Permission denied — using demo location' : 'Couldn\'t locate — using demo location');
        fallback();
      },
      { enableHighAccuracy: false, timeout: 3500, maximumAge: 60000 }
    );
  }, []);

  // Apply theme tweaks via CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    if (Array.isArray(tweaks.theme)) {
      // Convert hex to oklch-ish for primary navy
      root.style.setProperty('--navy', tweaks.theme[0]);
      root.style.setProperty('--navy-deep', tweaks.theme[0]);
      root.style.setProperty('--amber', tweaks.theme[1]);
      root.style.setProperty('--paper', tweaks.theme[2]);
    }
  }, [tweaks.theme]);

  const handlePlan = () => {
    setPlanning(true);
    setTimeout(() => {
      setPlanning(false);
      setScreen('compare');
      setSelectedMode('bike');
    }, 700);
  };

  const handleChoose = () => {
    const mode = window.MODES.find(m => m.key === selectedMode);
    setChosenMode(mode);
    setScreen('confirm');
  };

  const handleStart = () => {
    if (chosenMode) {
      setTotalSaved((v) => v + (0.94 - chosenMode.co2));
      setTotalPoints((v) => v + chosenMode.points);
      setTotalTrips((v) => v + 1);
      setCommunityCO2((v) => v + (0.94 - chosenMode.co2) / 1000);
    }
    setScreen('stats');
  };

  // Reset to home with a tap
  const goHome = () => { setScreen('home'); setChosenMode(null); };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar" data-screen-label="Sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M5 19c4-4 8-8 14-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="brand-name">EcoRoute</div>
            <div className="brand-sub">Merseyside</div>
          </div>
        </div>

        <div>
          <div className="nav-section">Travel</div>
          <nav className="nav">
            <button className={`nav-item ${screen === 'home' ? 'active' : ''}`} onClick={goHome}>
              <window.IconMap /> Plan a trip
            </button>
            <button className={`nav-item ${screen === 'compare' ? 'active' : ''}`}
                    onClick={() => screen !== 'home' && setScreen('compare')}
                    disabled={screen === 'home'} style={screen === 'home' ? { opacity: 0.5, cursor: 'default' } : {}}>
              <window.IconCompare /> Compare
            </button>
            <button className="nav-item">
              <window.IconRoute size={16} /> Saved routes
            </button>
          </nav>
        </div>

        <div>
          <div className="nav-section">You</div>
          <nav className="nav">
            <button className={`nav-item ${screen === 'stats' ? 'active' : ''}`}
                    onClick={() => setScreen('stats')}>
              <window.IconChart /> Stats
            </button>
            <button className="nav-item">
              <window.IconTrophy /> Achievements
            </button>
            <button className="nav-item">
              <window.IconLeaf /> Community
            </button>
          </nav>
        </div>

        <div className="sidebar-foot">
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', padding: '0 4px 6px' }}>
            Lifetime
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 4px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                {totalSaved.toFixed(0)}<span style={{ fontSize: 10, opacity: 0.55, fontWeight: 500, marginLeft: 2 }}>kg</span>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>CO₂ saved</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', color: 'var(--amber)' }}>
                {totalPoints.toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Points</div>
            </div>
          </div>
          <div className="user-chip">
            <div className="user-avatar">AS</div>
            <div>
              <div className="user-name">Alex S.</div>
              <div className="user-meta">L17 · Level 4</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main pane */}
      <main className="main">
        <div className="topbar">
          <div className="crumb">
            {screen === 'home' && <>EcoRoute / <b>Plan</b></>}
            {screen === 'compare' && <>EcoRoute / Plan / <b>Compare</b></>}
            {screen === 'confirm' && <>EcoRoute / Plan / Compare / <b>{chosenMode?.label}</b></>}
            {screen === 'stats' && <>EcoRoute / <b>Stats</b></>}
          </div>
          <div className="topbar-right">
            <span className="live-dot" />
            <span>Live · Merseyside</span>
            <span style={{ color: 'var(--hairline)', margin: '0 4px' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>

        <div className="screen" data-screen-label={`Screen / ${screen}`}>
          {screen === 'home' && (
            <window.HomeScreen
              from={from} to={to}
              onChangeFrom={setFrom} onChangeTo={setTo}
              onPlan={handlePlan}
              onSelectRecent={(r) => { setFrom(r.from); setTo(r.to); handlePlan(); }}
              mapLayer={mapLayer} setMapLayer={setMapLayer}
              predictedMinutes={predictedMinutes} setPredictedMinutes={setPredictedMinutes}
              mapStyle={tweaks.mapStyle}
              communityCO2={communityCO2}
              userLocation={userLocation}
              locating={locating}
              locateError={locateError}
              onUseMyLocation={handleUseMyLocation}
              locationLabel={locationLabel}
            />
          )}
          {screen === 'compare' && (
            <window.CompareScreen
              from={from} to={to}
              modes={window.MODES}
              selected={selectedMode} setSelected={setSelectedMode}
              onChoose={handleChoose}
              mapLayer={mapLayer} setMapLayer={setMapLayer}
              predictedMinutes={predictedMinutes} setPredictedMinutes={setPredictedMinutes}
              mapStyle={tweaks.mapStyle}
              cardLayout={tweaks.cardLayout}
            />
          )}
          {screen === 'confirm' && chosenMode && (
            <window.ConfirmScreen
              from={from} to={to}
              mode={chosenMode}
              totalSaved={totalSaved} totalPoints={totalPoints}
              onStart={handleStart}
              onBack={() => setScreen('compare')}
              mapLayer={mapLayer} mapStyle={tweaks.mapStyle}
            />
          )}
          {screen === 'stats' && (
            <window.StatsScreen
              totalSaved={totalSaved} totalPoints={totalPoints} totalTrips={totalTrips}
            />
          )}
        </div>

        {planning && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,30,60,0.18)', display: 'grid', placeItems: 'center', zIndex: 100 }}>
            <div className="loader">
              <div className="spinner" />
              <div>Routing via OpenRouteService…</div>
            </div>
          </div>
        )}
      </main>

      {/* Tweaks */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Theme">
          <window.TweakColor label="Palette" value={tweaks.theme}
            options={[
              ["#1c2a52", "#e3a634", "#fafaf7"], /* civic navy + amber */
              ["#0f3d2e", "#d9a441", "#f7f4ec"], /* forest + brass */
              ["#3a2a4a", "#f4a259", "#faf6f0"], /* aubergine + sunset */
              ["#1a1a1a", "#ff6b35", "#f5f5f4"], /* mono + ember */
            ]}
            onChange={(v) => setTweak('theme', v)} />
        </window.TweakSection>

        <window.TweakSection label="Map">
          <window.TweakRadio label="Style" value={tweaks.mapStyle}
            options={['realistic', 'dark', 'illustrated']}
            onChange={(v) => setTweak('mapStyle', v)} />
        </window.TweakSection>

        <window.TweakSection label="Compare layout">
          <window.TweakRadio label="Modes" value={tweaks.cardLayout}
            options={['cards', 'table']}
            onChange={(v) => setTweak('cardLayout', v)} />
        </window.TweakSection>

        <window.TweakSection label="Demo">
          <window.TweakButton label="Reset to home" onClick={() => { setScreen('home'); setChosenMode(null); setSelectedMode('bike'); }} />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

