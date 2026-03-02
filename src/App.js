import { useState, useEffect, useRef } from "react";

// ─── 8pt grid tokens ──────────────────────────────────────────────────
// Only use: 4, 8, 16, 24, 32, 40, 48, 56, 64, 80
// 4 is the half-unit for tight micro-spacing (badges, icon padding)

const STATUS_FILTERS = ["all", "active", "done"];
const DEFAULT_ALARM_HOUR = 15;
const DEFAULT_ALARM_MINUTE = 30;

const ACCENT = "#A855F7";
const ACCENT_HOVER = "#9333EA";
const F = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// ─── Edit Modal ────────────────────────────────────────────────────────
function EditModal({ todo, onSave, onClose }) {
  const [text, setText] = useState(todo.text);
  const [notes, setNotes] = useState(todo.notes || "");
  const [reminder, setReminder] = useState(todo.reminder || "");
  const [jobNumber, setJobNumber] = useState(todo.jobNumber || "");
  const [hasJob, setHasJob] = useState(!!todo.jobNumber);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textRef = useRef(null);

  useEffect(() => { textRef.current?.focus(); }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ ...todo, text: text.trim(), notes: notes.trim(), reminder, jobNumber: hasJob ? jobNumber.trim() : "" });
  };

  return (
    <div
      className="edit-modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(250,250,248,0.9)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, // 3×8
      }}
    >
      <div
        className="edit-modal-card"
        style={{
          background: "#fff", border: "1px solid #e5e5e5",
          borderRadius: 8, width: "100%", maxWidth: 480,
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          animation: "modalIn 0.2s ease", overflow: "hidden",
        }}
      >
        {/* Header — 16px top/bottom, 24px sides */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 24px", borderBottom: "1px solid #f0f0ee",
        }}>
          <span style={{ fontSize: 11, letterSpacing: 2, color: "#999", textTransform: "uppercase", fontFamily: F }}>Edit Task</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#ccc", padding: 0, lineHeight: 1, fontFamily: F }}
            onMouseOver={e => e.target.style.color = "#999"} onMouseOut={e => e.target.style.color = "#ccc"}>×</button>
        </div>

        {/* Body — 24px padding */}
        <div style={{ padding: 24 }}>

          {/* Task — mb 24 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: F }}>Task</label>
            <input ref={textRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSave()}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", borderBottom: "1px solid #e5e5e5", paddingBottom: 8, fontSize: 15, fontFamily: F, color: "#1a1a1a", fontWeight: 300, boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"} onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"} />
          </div>

          {/* Notes — mb 24 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: F }}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add notes..."
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", borderBottom: "1px solid #e5e5e5", paddingBottom: 8, fontSize: 13, fontFamily: F, color: "#1a1a1a", fontWeight: 300, resize: "none", boxSizing: "border-box", transition: "border-color 0.2s", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"} onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"} />
          </div>

          {/* Reminder + Job — gap 24, mb 32 */}
          <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: F }}>Reminder</label>
              <input className="edit-reminder-input" type="date" value={reminder} onChange={e => setReminder(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", borderBottom: "1px solid #e5e5e5", paddingBottom: 8, fontSize: 13, fontFamily: F, color: "#1a1a1a", cursor: "pointer", width: "100%", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: F }}>
                <span style={{ marginRight: 8 }}>Job #</span>
                <button onClick={() => { setHasJob(h => !h); setJobNumber(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: hasJob ? "#DC2626" : "#16A34A", fontFamily: F, padding: 0, letterSpacing: 1 }}>
                  {hasJob ? "remove" : "add"}
                </button>
              </label>
              {hasJob ? (
                <input value={jobNumber} onChange={e => setJobNumber(e.target.value)} placeholder="Job number"
                  style={{ background: "transparent", border: "none", outline: "none", borderBottom: "1px solid #e5e5e5", paddingBottom: 8, fontSize: 13, fontFamily: F, color: "#8d8d8d", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"} onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"} />
              ) : (
                <p style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: 8, paddingTop: 4, fontSize: 13, fontFamily: F, color: "#d6d6d6", margin: 0 }}>None</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#ddd", transition: "color 0.15s", display: "flex", alignItems: "center" }}
                onMouseOver={e => e.currentTarget.style.color = "#e57373"} onMouseOut={e => e.currentTarget.style.color = "#ddd"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 12, color: "#999", fontFamily: F }}>Are you sure?</span>
                <button onClick={() => onSave(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#e57373", fontFamily: F, padding: 0 }}>Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#bbb", fontFamily: F, padding: 0 }}>Cancel</button>
              </div>
            )}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#bbb", fontFamily: F, padding: 0, transition: "color 0.15s" }}
                onMouseOver={e => e.target.style.color = "#999"} onMouseOut={e => e.target.style.color = "#bbb"}>Cancel</button>
              <button onClick={handleSave}
                style={{ background: "#1a1a1a", color: "#fafaf8", border: "none", borderRadius: 4, padding: "8px 24px", cursor: "pointer", fontSize: 13, fontFamily: F, letterSpacing: 0.5, transition: "opacity 0.15s" }}
                onMouseOver={e => e.target.style.opacity = "0.8"} onMouseOut={e => e.target.style.opacity = "1"}>Save</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Bell Icon ─────────────────────────────────────────────────────────
function BellIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? ACCENT : "none"} stroke={active ? ACCENT : "#ccc"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

// ─── App ───────────────────────────────────────────────────────────────
export default function App() {
  const [todos, setTodos] = useState(() => {
    try { const s = localStorage.getItem("todos"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [input, setText] = useState("");
  const [inputNotes, setInputNotes] = useState("");
  const [reminder, setReminder] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [hasJob, setHasJob] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [jobSearch, setJobSearch] = useState("");
  const [clock, setClock] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [jobFocused, setJobFocused] = useState(false);
  const [editing, setEditing] = useState(null);

  const [alarmHour, setAlarmHour] = useState(DEFAULT_ALARM_HOUR);
  const [alarmMinute, setAlarmMinute] = useState(DEFAULT_ALARM_MINUTE);
  const [alarmSecond, setAlarmSecond] = useState(0);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmEditingHour, setAlarmEditingHour] = useState(false);
  const [alarmEditingMin, setAlarmEditingMin] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const lastAlarmFired = useRef(null);
  const [alarmBanner, setAlarmBanner] = useState(null);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    setNotifPermission(await Notification.requestPermission());
  };

  useEffect(() => {
    try { localStorage.setItem("todos", JSON.stringify(todos)); } catch {}
  }, [todos]);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setClock(now);
      const today = now.toISOString().split("T")[0];
      setTodos(prev => prev.map(todo => {
        if (todo.reminder === today && !todo.done && !todo.alerted) {
          setAlerts(a => [...a, todo]);
          return { ...todo, alerted: true };
        }
        return todo;
      }));

      if (alarmEnabled) {
        const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
        const key = `${h}:${m}`;
        if (s === 0 && h === alarmHour && m === alarmMinute && lastAlarmFired.current !== key) {
          lastAlarmFired.current = key;
          const dh = h % 12 === 0 ? 12 : h % 12;
          const label = `${String(dh).padStart(2,"0")}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
          setAlarmBanner(label);
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const play = (freq, start, dur) => {
              const o = ctx.createOscillator(), g = ctx.createGain();
              o.connect(g); g.connect(ctx.destination);
              o.frequency.value = freq; o.type = "sine";
              g.gain.setValueAtTime(0.3, ctx.currentTime + start);
              g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
              o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur);
            };
            play(1046, 0, 0.5); play(880, 0.18, 0.7);
          } catch {}
          if (notifPermission === "granted") {
            try { new Notification("Timesheet time!", { body: `It's ${label}`, requireInteraction: true }); } catch {}
          }
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [alarmEnabled, alarmHour, alarmMinute, notifPermission]);

  const add = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input.trim(), notes: inputNotes.trim(), done: false, reminder, jobNumber: hasJob ? jobNumber.trim() : "", alerted: false }]);
    setText(""); setInputNotes(""); setReminder(""); setJobNumber(""); setHasJob(false);
  };

  const toggle = id => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const dismiss = id => setAlerts(a => a.filter(t => t.id !== id));
  const handleSave = updated => {
    if (updated === null) setTodos(todos.filter(t => t.id !== editing.id));
    else setTodos(todos.map(t => t.id === updated.id ? updated : t));
    setEditing(null);
  };

  const visible = todos.filter(t => {
    const ms = statusFilter === "active" ? !t.done : statusFilter === "done" ? t.done : true;
    const mj = jobSearch.trim() ? t.jobNumber?.toLowerCase().includes(jobSearch.trim().toLowerCase()) : true;
    return ms && mj;
  }).sort((a, b) => {
    if (sortBy === "name") return a.text.localeCompare(b.text);
    if (sortBy === "date") {
      if (!a.reminder && !b.reminder) return 0;
      if (!a.reminder) return 1;
      if (!b.reminder) return -1;
      return a.reminder.localeCompare(b.reminder);
    }
    return 0;
  });

  const pending = todos.filter(t => !t.done).length;
  const todayStr = clock.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const displayHour = alarmHour > 12 ? alarmHour - 12 : alarmHour === 0 ? 12 : alarmHour;

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", fontFamily: F, color: "#1a1a1a", display: "flex", justifyContent: "center", padding: "80px 24px" }}>

      {editing && <EditModal todo={editing} onSave={handleSave} onClose={() => setEditing(null)} />}

      {/* Alarm Banner */}
      {alarmBanner && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 300, background: "#fff", border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: 8, padding: "16px 24px", // 16 top/bot, 24 sides
          boxShadow: "0 8px 32px rgba(168,85,247,0.15)",
          display: "flex", alignItems: "center", gap: 16,
          animation: "bannerIn 0.25s ease", minWidth: 240,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: ACCENT, letterSpacing: -0.5, fontFamily: F }}>{alarmBanner}</p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb", letterSpacing: 0.5, fontFamily: F }}>Alarm</p>
          </div>
          <button onClick={() => setAlarmBanner(null)}
            style={{ background: "none", border: "1px solid #e5e5e5", borderRadius: 4, cursor: "pointer", fontSize: 11, color: "#999", padding: "8px 16px", fontFamily: F, letterSpacing: 0.5, transition: "all 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#999"; }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Task Alerts */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 99, display: "flex", flexDirection: "column", gap: 8 }}>
        {alerts.map(a => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8, padding: 16, minWidth: 224, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", animation: "in 0.25s ease" }}>
            <p style={{ fontSize: 10, letterSpacing: 2, color: "#999", textTransform: "uppercase", margin: "0 0 8px", fontFamily: F }}>Reminder</p>
            <p style={{ fontSize: 14, color: "#1a1a1a", margin: "0 0 16px", fontFamily: F }}>{a.text}</p>
            <button onClick={() => dismiss(a.id)} style={{ background: "#1a1a1a", color: "#fafaf8", border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", fontSize: 11, letterSpacing: 0.5, fontFamily: F }}>Dismiss</button>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* ── Header — mb 48 ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, color: "#999", letterSpacing: 1, margin: "0 0 8px", fontFamily: F }}>{todayStr}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 300, letterSpacing: -0.5, color: "#1a1a1a", fontFamily: F }}>
              {pending > 0 ? `${pending} left to do` : "All done."}
            </h1>
            <span style={{ fontSize: 16, color: ACCENT, fontWeight: 300, fontFamily: F }}>{timeStr}</span>
          </div>
        </div>

        {/* ── Alarm Strip — p 16, gap 8, mb 32 ───────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginBottom: 32, padding: "16px",
          borderRadius: 8,
          background: alarmEnabled ? "rgba(168,85,247,0.05)" : "#f7f7f5",
          border: `1px solid ${alarmEnabled ? "rgba(168,85,247,0.2)" : "#ececea"}`,
          transition: "all 0.2s",
        }}>
          <button
            onClick={async () => {
              if (!alarmEnabled && notifPermission !== "granted") await requestPermission();
              const on = !alarmEnabled;
              setAlarmEnabled(e => !e);
              if (on) {
                try {
                  const ctx = new (window.AudioContext || window.webkitAudioContext)();
                  const o = ctx.createOscillator(), g = ctx.createGain();
                  o.connect(g); g.connect(ctx.destination);
                  o.frequency.value = 880; o.type = "sine";
                  g.gain.setValueAtTime(0.25, ctx.currentTime);
                  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                  o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.6);
                } catch {}
              }
            }}
            title={alarmEnabled ? "Disable alarm" : "Enable alarm"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <BellIcon active={alarmEnabled} />
          </button>

          {/* HH:MM AM/PM — gap 4 between parts */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
            <input type="number" min={1} max={12}
              value={String(displayHour).padStart(2, "0")}
              onChange={e => {
                const v = Math.min(12, Math.max(1, parseInt(e.target.value) || 1));
                const pm = alarmHour >= 12;
                setAlarmHour(pm ? (v === 12 ? 12 : v + 12) : (v === 12 ? 0 : v));
              }}
              onFocus={() => setAlarmEditingHour(true)}
              onBlur={() => setAlarmEditingHour(false)}
              style={{ width: 32, background: "transparent", border: "none", outline: "none", fontSize: 14, fontFamily: F, color: alarmEnabled ? ACCENT : "#bbb", fontWeight: 500, textAlign: "center", borderBottom: `1px solid ${alarmEditingHour ? ACCENT : "transparent"}`, padding: "0 0 4px", MozAppearance: "textfield", transition: "border-color 0.15s" }}
            />
            <span style={{ color: alarmEnabled ? ACCENT : "#ccc", fontSize: 14, fontWeight: 500, lineHeight: 1 }}>:</span>
            <input type="number" min={0} max={59}
              value={String(alarmMinute).padStart(2, "0")}
              onChange={e => setAlarmMinute(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              onFocus={() => setAlarmEditingMin(true)}
              onBlur={() => setAlarmEditingMin(false)}
              style={{ width: 32, background: "transparent", border: "none", outline: "none", fontSize: 14, fontFamily: F, color: alarmEnabled ? ACCENT : "#bbb", fontWeight: 500, textAlign: "center", borderBottom: `1px solid ${alarmEditingMin ? ACCENT : "transparent"}`, padding: "0 0 4px", MozAppearance: "textfield", transition: "border-color 0.15s" }}
            />
            <button onClick={() => setAlarmHour(h => h >= 12 ? h - 12 : h + 12)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, letterSpacing: 0.5, fontFamily: F, color: alarmEnabled ? ACCENT : "#bbb", padding: "0 0 4px", marginLeft: 4, transition: "color 0.15s" }}>
              {alarmHour >= 12 ? "PM" : "AM"}
            </button>
          </div>

          {notifPermission === "denied" && (
            <span style={{ fontSize: 10, color: "#e57373", letterSpacing: 0.3, marginLeft: "auto", fontFamily: F }}>Notifications blocked</span>
          )}
          {notifPermission === "default" && (
            <button onClick={requestPermission} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: ACCENT, letterSpacing: 0.3, fontFamily: F, marginLeft: "auto", padding: 0, textDecoration: "underline" }}>Allow notifications</button>
          )}
        </div>

        {/* ── Input Area — mb 32 ──────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            borderBottom: `1px solid ${focused ? ACCENT : "#e5e5e5"}`,
            paddingBottom: 16, marginBottom: 16,
            transition: "border-color 0.2s",
          }}>
            {/* Task row — gap 16 */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: input.trim() ? 8 : 0 }}>
              <input
                value={input}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && add()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Add a task"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, fontFamily: F, color: "#1a1a1a", fontWeight: 300 }}
              />
              <input type="date" value={reminder} onChange={e => setReminder(e.target.value)} title="Set reminder"
                className="reminder-input"
                style={{ background: "transparent", border: "none", outline: "none", fontSize: 11, color: "#1a1a1a", fontFamily: F, cursor: "pointer", opacity: reminder ? 1 : 0.5 }} />
              <button onClick={add}
                style={{ background: input.trim() ? ACCENT : "#ececea", border: "none", cursor: input.trim() ? "pointer" : "default", borderRadius: 6, padding: "4px 12px", fontSize: 20, fontWeight: 300, fontFamily: F, color: input.trim() ? "#fff" : "#bbb", flexShrink: 0, transition: "background 0.15s", lineHeight: 1.4 }}
                onMouseOver={e => { if (input.trim()) e.currentTarget.style.background = ACCENT_HOVER; }}
                onMouseOut={e => { if (input.trim()) e.currentTarget.style.background = ACCENT; }}>+</button>
            </div>

            {/* Inline notes */}
            {input.trim() && (
              <textarea value={inputNotes} onChange={e => setInputNotes(e.target.value)} rows={2} placeholder="Add a note... (optional)"
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 12, fontFamily: F, color: "#999", fontWeight: 300, resize: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
            )}
          </div>

          {/* Job # toggle row — gap 16 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => { setHasJob(h => !h); setJobNumber(""); }}
              style={{ background: "none", border: `1px solid ${hasJob ? "#1a1a1a" : "#e0e0e0"}`, borderRadius: 4, cursor: "pointer", fontSize: 11, color: hasJob ? "#1a1a1a" : "#bbb", fontFamily: F, padding: "4px 8px", letterSpacing: 0.5, transition: "all 0.15s" }}>
              {hasJob ? "− Job #" : "+ Job #"}
            </button>
            {hasJob && (
              <input value={jobNumber} onChange={e => setJobNumber(e.target.value)}
                onFocus={() => setJobFocused(true)} onBlur={() => setJobFocused(false)}
                placeholder="Enter job number"
                style={{ background: "transparent", outline: "none", border: "none", borderBottom: `1px solid ${jobFocused ? "#1a1a1a" : "#e5e5e5"}`, fontSize: 13, fontFamily: F, color: "#1a1a1a", fontWeight: 300, paddingBottom: 4, width: 160, transition: "border-color 0.2s" }} />
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>

          {/* Status filters */}
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, letterSpacing: 0.5, fontFamily: F, color: statusFilter === f ? "#1a1a1a" : "#bbb", fontWeight: statusFilter === f ? 500 : 300, padding: "0 0 4px", textTransform: "capitalize", transition: "color 0.15s", borderBottom: statusFilter === f ? `1px solid ${ACCENT}` : "1px solid transparent" }}>
              {f}
            </button>
          ))}

          {/* Sort — gap 8 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
            style={{ marginRight: 10, color: "#ececec"}}> | </span>
            {[{ key: "name", label: "A–Z" }, { key: "date", label: "Date" }].map(s => (
              <button key={s.key} onClick={() => setSortBy(p => p === s.key ? "none" : s.key)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, letterSpacing: 0.5, fontFamily: F, color: sortBy === s.key ? ACCENT : "#bbb", fontWeight: sortBy === s.key ? 500 : 300, padding: "0 0 4px", borderBottom: sortBy === s.key ? `1px solid ${ACCENT}` : "1px solid transparent", transition: "color 0.15s" }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Job search — ml auto, gap 8 */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#bbb", letterSpacing: 0.5, fontFamily: F }}>Job #</span>
            <input value={jobSearch} onChange={e => setJobSearch(e.target.value)} placeholder="Search..."
              style={{ background: "transparent", border: "none", outline: "none", borderBottom: `1px solid ${jobSearch ? ACCENT : "#e5e5e5"}`, fontSize: 12, fontFamily: F, color: "#1a1a1a", WebkitTextFillColor: "#b8b8b8", fontWeight: 300, paddingBottom: 4, width: 80, transition: "border-color 0.2s" }} />
            {jobSearch && (
              <button onClick={() => setJobSearch("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#ccc", padding: 0, lineHeight: 1 }}>×</button>
            )}
          </div>
        </div>

        {/* ── Todo List ────────────────────────────────────────────────── */}
        <div>
          {visible.length === 0 && (
            <p style={{ fontSize: 13, color: "#ccc", padding: "24px 0", fontWeight: 300, margin: 0, fontFamily: F }}>Nothing here.</p>
          )}
          {visible.map(todo => (
            <div key={todo.id}
              style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 0", borderBottom: "1px solid #f0f0ee", opacity: todo.done ? 0.4 : 1, transition: "opacity 0.2s" }}>

              {/* Checkbox — 16×16 */}
              <button onClick={() => toggle(todo.id)}
                style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `1px solid ${todo.done ? "#1a1a1a" : "#d5d5d5"}`, background: todo.done ? "#1a1a1a" : "transparent", cursor: "pointer", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                {todo.done && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#fafaf8", display: "block" }} />}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.5, margin: 0, textDecoration: todo.done ? "line-through" : "none", color: "#1a1a1a", fontFamily: F }}>
                  {todo.text}
                </p>
                {todo.notes && (
                  <p style={{ fontSize: 12, color: "#aaa", fontWeight: 300, margin: "4px 0 0", lineHeight: 1.5, whiteSpace: "pre-wrap", fontFamily: F }}>{todo.notes}</p>
                )}
                {/* Meta row — gap 8, mt 4 */}
                <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                  {todo.jobNumber && (
                    <span style={{ fontSize: 10, color: "#999", letterSpacing: 0.5, background: "#f0f0ee", borderRadius: 4, padding: "2px 8px", fontFamily: F }}>#{todo.jobNumber}</span>
                  )}
                  {todo.reminder && (
                    <span style={{ fontSize: 11, color: ACCENT, letterSpacing: 0.3, fontFamily: F }}>
                      {new Date(todo.reminder + "T00:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit icon */}
              <button onClick={() => setEditing(todo)} title="Edit task"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, flexShrink: 0, color: "#ccc", transition: "color 0.15s", display: "flex", alignItems: "center" }}
                onMouseOver={e => e.currentTarget.style.color = ACCENT}
                onMouseOut={e => e.currentTarget.style.color = "#ccc"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Clear completed — mt 32 */}
        {todos.some(t => t.done) && (
          <button onClick={() => setTodos(todos.filter(t => !t.done))}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#ccc", fontFamily: F, letterSpacing: 0.5, marginTop: 32, padding: 0, transition: "color 0.15s" }}
            onMouseOver={e => e.target.style.color = "#999"} onMouseOut={e => e.target.style.color = "#ccc"}>
            Clear completed
          </button>
        )}

      </div>

      <style>{`
        @keyframes in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes bannerIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .reminder-input::-webkit-calendar-picker-indicator { opacity: 0.6; cursor: pointer; filter: brightness(0); }
        .edit-reminder-input::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; filter: brightness(0); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}