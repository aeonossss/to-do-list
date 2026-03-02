import { useState, useEffect, useRef } from "react";

const STATUS_FILTERS = ["all", "active", "done"];

// ─── Editable Alarm Time ───────────────────────────────────────────────
// Change ALARM_HOUR and ALARM_MINUTE to test different times.
// Default: fires every 30 minutes (e.g. 3:00, 3:30, 4:00, 4:30...)
const DEFAULT_ALARM_HOUR = 15;   // 3 PM  ← EDIT ME
const DEFAULT_ALARM_MINUTE = 30; // :30   ← EDIT ME

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
    onSave({
      ...todo,
      text: text.trim(),
      notes: notes.trim(),
      reminder,
      jobNumber: hasJob ? jobNumber.trim() : "",
    });
  };

  const overlay = {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(250,250,248,0.88)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px",
  };

  const card = {
    background: "#fff", border: "1px solid #e5e5e5",
    borderRadius: 8, width: "100%", maxWidth: 480,
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
    animation: "modalIn 0.2s ease",
    overflow: "hidden",
  };

  return (
    <div className="edit-modal-overlay" style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="edit-modal-card" style={card}>
        <div className="edit-modal-header" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 24px", borderBottom: "1px solid #f0f0ee",
        }}>
          <span className="edit-modal-title" style={{ fontSize: 11, letterSpacing: 2, color: "#999", textTransform: "uppercase" }}>Edit Task</span>
          <button className="edit-modal-close-btn" onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "#ccc", padding: 0, lineHeight: 1,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
            onMouseOver={e => e.target.style.color = "#999"}
            onMouseOut={e => e.target.style.color = "#ccc"}
          >×</button>
        </div>

        <div className="edit-modal-body" style={{ padding: "24px" }}>
          <div className="edit-field edit-field--task" style={{ marginBottom: 24 }}>
            <label className="edit-label" style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Task</label>
            <input
              className="edit-task-input"
              ref={textRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              style={{
                width: "100%", background: "transparent", border: "none", outline: "none",
                borderBottom: "1px solid #e5e5e5", paddingBottom: 8,
                fontSize: 15, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: "#1a1a1a", fontWeight: 300,
                boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"}
              onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"}
            />
          </div>

          <div className="edit-field edit-field--notes" style={{ marginBottom: 24 }}>
            <label className="edit-label" style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Notes</label>
            <textarea
              className="edit-notes-input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes..."
              style={{
                width: "100%", background: "transparent", border: "none", outline: "none",
                borderBottom: "1px solid #e5e5e5", paddingBottom: 8,
                fontSize: 13, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: "#1a1a1a", fontWeight: 300,
                resize: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"}
              onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"}
            />
          </div>

          <div className="edit-field-row" style={{ display: "flex", gap: 24, marginBottom: 32 }}>
            <div className="edit-field edit-field--reminder" style={{ flex: 1 }}>
              <label className="edit-label" style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Reminder</label>
              <input
                className="edit-reminder-input reminder-input"
                type="date"
                value={reminder}
                onChange={e => setReminder(e.target.value)}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  borderBottom: "1px solid #e5e5e5", paddingBottom: 8,
                  fontSize: 13, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: "#1a1a1a", cursor: "pointer",
                  width: "100%", boxSizing: "border-box",
                }}
              />
            </div>

            <div className="edit-field edit-field--job" style={{ flex: 1 }}>
              <label className="edit-label" style={{ fontSize: 10, letterSpacing: 1.5, color: "#bbb", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                <span style={{ marginRight: 8 }}>Job #</span>
                <button
                  className={`edit-job-toggle-btn${hasJob ? " edit-job-toggle-btn--active" : ""}`}
                  onClick={() => { setHasJob(h => !h); setJobNumber(""); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 10, color: hasJob ? "#DC2626" : "#16A34A",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    padding: 0, letterSpacing: 1,
                  }}
                >{hasJob ? "remove" : "add"}</button>
              </label>
              {hasJob ? (
                <input
                  className="edit-job-number-input"
                  value={jobNumber}
                  onChange={e => setJobNumber(e.target.value)}
                  placeholder="Job number"
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    borderBottom: "1px solid #e5e5e5", paddingBottom: 8,
                    fontSize: 13, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    color: "#8d8d8d",
                    width: "100%", boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"}
                  onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"}
                />
              ) : (
                <p style={{
                  background: "transparent", border: "none", outline: "none",
                  borderBottom: "1px solid #e5e5e5", paddingBottom: 8, paddingTop: 4,
                  fontSize: 13, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: "#d6d6d6", margin: 0,
                }}>None</p>
              )}
            </div>
          </div>

          <div className="edit-modal-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {!confirmDelete ? (
              <button
                className="edit-delete-btn"
                onClick={() => setConfirmDelete(true)}
                title="Delete task"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, color: "#ddd", transition: "color 0.15s",
                  display: "flex", alignItems: "center",
                }}
                onMouseOver={e => e.currentTarget.style.color = "#e57373"}
                onMouseOut={e => e.currentTarget.style.color = "#ddd"}
              >
                <svg className="edit-delete-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            ) : (
              <div className="edit-confirm-delete" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="edit-confirm-label" style={{ fontSize: 12, color: "#999" }}>Are you sure?</span>
                <button className="edit-confirm-yes-btn" onClick={() => { onSave(null); }} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: "#e57373", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: 0,
                }}>Yes, delete</button>
                <button className="edit-confirm-no-btn" onClick={() => setConfirmDelete(false)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: 0,
                }}>Cancel</button>
              </div>
            )}

            <div className="edit-modal-save-group" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <button className="edit-cancel-btn" onClick={onClose} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                padding: 0, transition: "color 0.15s",
              }}
                onMouseOver={e => e.target.style.color = "#999"}
                onMouseOut={e => e.target.style.color = "#bbb"}
              >Cancel</button>
              <button className="edit-save-btn" onClick={handleSave} style={{
                background: "#1a1a1a", color: "#fafaf8", border: "none",
                borderRadius: 4, padding: "8px 24px",
                cursor: "pointer", fontSize: 13, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                letterSpacing: 0.5, transition: "opacity 0.15s",
              }}
                onMouseOver={e => e.target.style.opacity = "0.8"}
                onMouseOut={e => e.target.style.opacity = "1"}
              >Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Alarm Bell Icon ───────────────────────────────────────────────────
function BellIcon({ active }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={active ? "#A855F7" : "none"} stroke={active ? "#A855F7" : "#bbb"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setText] = useState("");
  const [inputNotes, setInputNotes] = useState("");
  const [reminder, setReminder] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [hasJob, setHasJob] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobSearch, setJobSearch] = useState("");
  const [clock, setClock] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [jobFocused, setJobFocused] = useState(false);
  const [editing, setEditing] = useState(null);

  // ── Alarm state ──────────────────────────────────────────────────────
  const [alarmHour, setAlarmHour] = useState(DEFAULT_ALARM_HOUR);
  const [alarmMinute, setAlarmMinute] = useState(DEFAULT_ALARM_MINUTE);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmEditingHour, setAlarmEditingHour] = useState(false);
  const [alarmEditingMin, setAlarmEditingMin] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const lastAlarmFired = useRef(null);
  const [alarmBanner, setAlarmBanner] = useState(null); // { label: "15:30" } when firing

  // Request notification permission
  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  useEffect(() => {
    try { localStorage.setItem("todos", JSON.stringify(todos)); } catch {}
  }, [todos]);

  // ── Main clock tick ──────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setClock(now);
      const today = now.toISOString().split("T")[0];

      // Task reminder check
      setTodos(prev =>
        prev.map(todo => {
          if (todo.reminder === today && !todo.done && !todo.alerted) {
            setAlerts(a => [...a, todo]);
            return { ...todo, alerted: true };
          }
          return todo;
        })
      );

      // Alarm check — fires once at exact alarmHour:alarmMinute
      if (alarmEnabled) {
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const alarmKey = `${h}:${m}`;

        if (s === 0 && h === alarmHour && m === alarmMinute && lastAlarmFired.current !== alarmKey) {
          lastAlarmFired.current = alarmKey;
          const displayHour = h % 12 === 0 ? 12 : h % 12;
          const ampm = h >= 12 ? "PM" : "AM";
          const label = `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;

          // 1. In-app banner (always)
          setAlarmBanner(label);

          // 2. Ding sound (always)
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Two-tone ding: high then slightly lower
            const playTone = (freq, startAt, duration) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = freq;
              osc.type = "sine";
              gain.gain.setValueAtTime(0.3, ctx.currentTime + startAt);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
              osc.start(ctx.currentTime + startAt);
              osc.stop(ctx.currentTime + startAt + duration);
            };
            playTone(1046, 0, 0.5);    // C6
            playTone(880, 0.18, 0.7);  // A5
          } catch {}

          // 3. Browser notification (only if permitted)
          if (notifPermission === "granted") {
            try {
              new Notification("⏰ Alarm", {
                body: `It's ${label}`,
                requireInteraction: true,
              });
            } catch {}
          }
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [alarmEnabled, alarmHour, alarmMinute, notifPermission]);

  const add = () => {
    if (!input.trim()) return;
    setTodos([...todos, {
      id: Date.now(), text: input.trim(), notes: inputNotes.trim(),
      done: false, reminder,
      jobNumber: hasJob ? jobNumber.trim() : "",
      alerted: false,
    }]);
    setText(""); setInputNotes(""); setReminder(""); setJobNumber(""); setHasJob(false);
  };

  const toggle = id => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const dismiss = id => setAlerts(a => a.filter(t => t.id !== id));

  const handleSave = (updated) => {
    if (updated === null) {
      setTodos(todos.filter(t => t.id !== editing.id));
    } else {
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
    }
    setEditing(null);
  };

  const visible = todos.filter(t => {
    const matchesStatus =
      statusFilter === "active" ? !t.done :
      statusFilter === "done" ? t.done : true;
    const matchesJob = jobSearch.trim()
      ? t.jobNumber?.toLowerCase().includes(jobSearch.trim().toLowerCase())
      : true;
    return matchesStatus && matchesJob;
  });

  const pending = todos.filter(t => !t.done).length;
  const today = clock.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const time = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="app-wrapper" style={{
      minHeight: "100vh",
      background: "#fafaf8",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#1a1a1a",
      display: "flex",
      justifyContent: "center",
      padding: "80px 24px",
    }}>

      {editing && <EditModal todo={editing} onSave={handleSave} onClose={() => setEditing(null)} />}

      {/* In-app Alarm Banner */}
      {alarmBanner && (
        <div className="alarm-banner" style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 300,
          background: "#fff",
          border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: 10,
          padding: "16px 24px",
          boxShadow: "0 4px 8px rgba(168,85,247,0.18)",
          display: "flex", alignItems: "center", gap: 16,
          animation: "bannerIn 0.25s ease",
          minWidth: 240,
        }}>
          <span style={{ fontSize: 20 }}>⏰</span>
          <div style={{ flex: 1 }}>
            <p className="alarm-banner-time" style={{
              margin: 0, fontSize: 22, fontWeight: 500,
              color: "#A855F7", letterSpacing: -0.5,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}>{alarmBanner}</p>
            <p className="alarm-banner-label" style={{
              margin: "2px 0 0", fontSize: 11, color: "#bbb", letterSpacing: 0.5,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}>Alarm</p>
          </div>
          <button
            className="alarm-banner-dismiss"
            onClick={() => setAlarmBanner(null)}
            style={{
              background: "none", border: "1px solid #e5e5e5", borderRadius: 6,
              cursor: "pointer", fontSize: 11, color: "#999", padding: "6px 12px",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              letterSpacing: 0.5, transition: "all 0.15s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#A855F7"; e.currentTarget.style.color = "#A855F7"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#999"; }}
          >Dismiss</button>
        </div>
      )}

      {/* Task Alerts */}
      <div className="alerts-container" style={{
        position: "fixed", top: 24, right: 24,
        zIndex: 99, display: "flex", flexDirection: "column", gap: 8,
      }}>
        {alerts.map(a => (
          <div key={a.id} className="alert-card" style={{
            background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8,
            padding: "16px", minWidth: 224,
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)", animation: "in 0.25s ease",
          }}>
            <p className="alert-label" style={{ fontSize: 10, letterSpacing: 2, color: "#999", textTransform: "uppercase", margin: "0 0 8px" }}>Reminder</p>
            <p className="alert-text" style={{ fontSize: 14, color: "#1a1a1a", margin: "0 0 16px" }}>{a.text}</p>
            <button className="alert-dismiss-btn" onClick={() => dismiss(a.id)} style={{
              background: "#1a1a1a", color: "#fafaf8", border: "none", borderRadius: 4,
              padding: "8px 16px", cursor: "pointer", fontSize: 11, letterSpacing: 0.5,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}>Dismiss</button>
          </div>
        ))}
      </div>

      <div className="app-container" style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div className="header" style={{ marginBottom: 48 }}>
          <p className="header-date" style={{ fontSize: 12, color: "#999", letterSpacing: 1, margin: "0 0 8px" }}>{today}</p>
          <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h1 className="header-title" style={{ margin: 0, fontSize: 28, fontWeight: 300, letterSpacing: -0.5, color: "#1a1a1a" }}>
              {pending > 0 ? `${pending} left to do` : "All done."}
            </h1>
            <span className="header-clock" style={{ fontSize: 16, color: "#A855F7", fontWeight: 300 }}>{time}</span>
          </div>
        </div>

        {/* ── Alarm Strip ─────────────────────────────────────────────── */}
        <div className="alarm-strip" style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 32,
          padding: "12px 16px",
          borderRadius: 8,
          background: alarmEnabled ? "rgba(168,85,247,0.05)" : "#f7f7f5",
          border: `1px solid ${alarmEnabled ? "rgba(168,85,247,0.2)" : "#ececea"}`,
          transition: "all 0.2s",
        }}>
          {/* Bell toggle */}
          <button
            className="alarm-toggle-btn"
            onClick={async () => {
              if (!alarmEnabled && notifPermission !== "granted") {
                await requestPermission();
              }
              const turningOn = !alarmEnabled;
              setAlarmEnabled(e => !e);
              if (turningOn) {
                try {
                  const ctx = new (window.AudioContext || window.webkitAudioContext)();
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.frequency.value = 880;
                  osc.type = "sine";
                  gain.gain.setValueAtTime(0.25, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                  osc.start(ctx.currentTime);
                  osc.stop(ctx.currentTime + 0.6);
                } catch {}
              }
            }}
            title={alarmEnabled ? "Disable alarm" : "Enable alarm"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 0, display: "flex", alignItems: "center", flexShrink: 0,
            }}
          >
            <BellIcon active={alarmEnabled} />
          </button>

          {/* Editable HH:MM AM/PM */}
          <div className="alarm-time-group" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              className="alarm-hour-input"
              type="number"
              min={1} max={12}
              value={String(alarmHour > 12 ? alarmHour - 12 : alarmHour === 0 ? 12 : alarmHour).padStart(2, "0")}
              onChange={e => {
                let v = Math.min(12, Math.max(1, parseInt(e.target.value) || 1));
                const ispm = alarmHour >= 12;
                setAlarmHour(ispm ? (v === 12 ? 12 : v + 12) : (v === 12 ? 0 : v));
              }}
              onFocus={() => setAlarmEditingHour(true)}
              onBlur={() => setAlarmEditingHour(false)}
              style={{
                width: 28, background: "transparent", border: "none", outline: "none",
                fontSize: 14, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: alarmEnabled ? "#A855F7" : "#bbb",
                fontWeight: 500, textAlign: "center",
                borderBottom: `1px solid ${alarmEditingHour ? "#A855F7" : "transparent"}`,
                padding: "0 0 2px", MozAppearance: "textfield",
                transition: "border-color 0.15s",
              }}
            />
            <span style={{ color: alarmEnabled ? "#A855F7" : "#ccc", fontSize: 13, fontWeight: 500, lineHeight: 1 }}>:</span>
            <input
              className="alarm-minute-input"
              type="number"
              min={0} max={59}
              value={String(alarmMinute).padStart(2, "0")}
              onChange={e => setAlarmMinute(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              onFocus={() => setAlarmEditingMin(true)}
              onBlur={() => setAlarmEditingMin(false)}
              style={{
                width: 28, background: "transparent", border: "none", outline: "none",
                fontSize: 13, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: alarmEnabled ? "#A855F7" : "#bbb",
                fontWeight: 500, textAlign: "center",
                borderBottom: `1px solid ${alarmEditingMin ? "#A855F7" : "transparent"}`,
                padding: "0 0 2px", MozAppearance: "textfield",
                transition: "border-color 0.15s",
              }}
            />
            {/* AM/PM toggle */}
            <button
              className="alarm-ampm-btn"
              onClick={() => setAlarmHour(h => h >= 12 ? h - 12 : h + 12)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 10, fontWeight: 500, letterSpacing: 0.5,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: alarmEnabled ? "#A855F7" : "#bbb",
                padding: "0 0 2px", marginLeft: 2,
                transition: "color 0.15s",
              }}
            >{alarmHour >= 12 ? "PM" : "AM"}</button>
          </div>

          {notifPermission === "denied" && (
            <span className="alarm-permission-warning" style={{ fontSize: 10, color: "#e57373", letterSpacing: 0.3, marginLeft: "auto" }}>
              Notifications blocked
            </span>
          )}
          {notifPermission === "default" && (
            <button className="alarm-permission-btn" onClick={requestPermission} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 10, color: "#A855F7", letterSpacing: 0.3,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              marginLeft: "auto", padding: 0, textDecoration: "underline",
            }}>Allow notifications</button>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area" style={{ marginBottom: 32 }}>
          <div className="input-row" style={{
            borderBottom: `1px solid ${focused ? "#A855F7" : "#e5e5e5"}`,
            paddingBottom: 16, marginBottom: 16,
            transition: "border-color 0.2s",
          }}>
            {/* Task + date + add button row */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: inputNotes || input ? 10 : 0 }}>
              <input
                className="task-input"
                value={input}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && add()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Add a task"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 15, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: "#1a1a1a", fontWeight: 300,
                }}
              />
              <input
                className="reminder-input"
                type="date"
                value={reminder}
                onChange={e => setReminder(e.target.value)}
                title="Set reminder"
                style={{
                  background: "transparent", border: "none", outline: "none",
                  fontSize: 11, color: "#000000",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  cursor: "pointer", opacity: reminder ? 1 : 0.5,
                }}
              />
              {/* Add button */}
              <button
                className="add-btn"
                onClick={add}
                style={{
                  background: input.trim() ? "#A855F7" : "#ececea",
                  border: "none", cursor: input.trim() ? "pointer" : "default",
                  borderRadius: 6, padding: "2px 8px",
                  fontSize: 18, fontWeight: 300, letterSpacing: 0.4,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: input.trim() ? "#fff" : "#bbb",
                  flexShrink: 0, transition: "background 0.15s, color 0.15s",
                  lineHeight: 1.4,
                }}
                onMouseOver={e => { if (input.trim()) e.currentTarget.style.background = "#9333EA"; }}
                onMouseOut={e => { if (input.trim()) e.currentTarget.style.background = "#A855F7"; }}
              >+</button>
            </div>

            {/* Inline notes — only shows once task has text */}
            {input.trim() && (
              <textarea
                className="task-notes-input"
                value={inputNotes}
                onChange={e => setInputNotes(e.target.value)}
                rows={2}
                placeholder="Add a note... (optional)"
                style={{
                  width: "100%", background: "transparent", border: "none", outline: "none",
                  fontSize: 12, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: "#999", fontWeight: 300, resize: "none",
                  boxSizing: "border-box", lineHeight: 1.6,
                  paddingLeft: 0,
                }}
              />
            )}
          </div>

          <div className="job-number-row" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className={`job-toggle-btn${hasJob ? " job-toggle-btn--active" : ""}`}
              onClick={() => { setHasJob(h => !h); setJobNumber(""); }}
              style={{
                background: "none", border: `1px solid ${hasJob ? "#1a1a1a" : "#e0e0e0"}`,
                borderRadius: 4, cursor: "pointer", fontSize: 11,
                color: hasJob ? "#1a1a1a" : "#bbb",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                padding: "4px 8px", letterSpacing: 0.5, transition: "all 0.15s",
              }}
            >
              {hasJob ? "− Job #" : "+ Job #"}
            </button>
            {hasJob && (
              <input
                className="job-number-input"
                value={jobNumber}
                onChange={e => setJobNumber(e.target.value)}
                onFocus={() => setJobFocused(true)}
                onBlur={() => setJobFocused(false)}
                placeholder="Enter job number"
                style={{
                  background: "transparent", outline: "none",
                  border: "none", borderBottom: `1px solid ${jobFocused ? "#1a1a1a" : "#e5e5e5"}`,
                  fontSize: 13, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  color: "#1a1a1a", fontWeight: 300, paddingBottom: 4, width: 160,
                  transition: "border-color 0.2s",
                }}
              />
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar" style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap", marginTop: 56, }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn filter-btn--${f}${statusFilter === f ? " filter-btn--active" : ""}`}
              onClick={() => setStatusFilter(f)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, letterSpacing: 0.5,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: statusFilter === f ? "#1a1a1a" : "#bbb",
                fontWeight: statusFilter === f ? 500 : 300,
                padding: "0 0 4px", textTransform: "capitalize", transition: "color 0.15s",
                borderBottom: statusFilter === f ? "1px solid #A855F7" : "1px solid transparent",
              }}
            >
              {f}
            </button>
          ))}

          <div className="job-search-wrapper" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span className="job-search-label" style={{ fontSize: 11, color: "#777777", letterSpacing: 0.5 }}>Job #</span>
            <input
              className="job-search-input"
              value={jobSearch}
              onChange={e => setJobSearch(e.target.value)}
              placeholder="Search JN.."
              style={{
                background: "transparent", border: "none", outline: "none",
                borderBottom: `1px solid ${
                    focused
                    ? "#A855F7"
                  : jobSearch
                    ? "#A855F7"
                    : "#9e9e9e"
                }`,
                fontSize: 12, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: "#1a1a1a", WebkitTextFillColor: "#b8b8b8",
                fontWeight: 300, paddingBottom: 4, width: 88,
                transition: "border-color 0.2s",
              }}
            />
            {jobSearch && (
              <button className="job-search-clear-btn" onClick={() => setJobSearch("")} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 16, color: "#ccc", padding: 0, lineHeight: 1,
              }}>×</button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {visible.length === 0 && (
            <p className="todo-empty" style={{ fontSize: 13, color: "#ccc", padding: "24px 0", fontWeight: 300, margin: 0 }}>
              Nothing here.
            </p>
          )}
          {visible.map(todo => (
            <div
              key={todo.id}
              className={`todo-item${todo.done ? " todo-item--done" : ""}${todo.jobNumber ? " todo-item--has-job" : ""}`}
              data-id={todo.id}
              data-job={todo.jobNumber || ""}
              style={{
                display: "flex", alignItems: "flex-start",
                gap: 16, padding: "16px 0",
                borderBottom: "1px solid #f0f0ee",
                opacity: todo.done ? 0.4 : 1, transition: "opacity 0.2s",
              }}
            >
              <button
                className="todo-toggle-btn"
                onClick={() => toggle(todo.id)}
                style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                  border: `1px solid ${todo.done ? "#1a1a1a" : "#d5d5d5"}`,
                  background: todo.done ? "#1a1a1a" : "transparent",
                  cursor: "pointer", marginTop: 2, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                {todo.done && <span className="todo-toggle-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#fafaf8", display: "block" }} />}
              </button>

              <div className="todo-content" style={{ flex: 1, minWidth: 0 }}>
                <p className="todo-text" style={{
                  fontSize: 14, fontWeight: 300, lineHeight: 1.5, margin: 0,
                  textDecoration: todo.done ? "line-through" : "none", color: "#1a1a1a",
                }}>
                  {todo.text}
                </p>
                {todo.notes && (
                  <p className="todo-notes" style={{
                    fontSize: 12, color: "#aaa", fontWeight: 300,
                    margin: "4px 0 0", lineHeight: 1.5, whiteSpace: "pre-wrap",
                  }}>{todo.notes}</p>
                )}
                <div className="todo-meta" style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                  {todo.jobNumber && (
                    <span className="todo-job-badge" style={{
                      fontSize: 10, color: "#999", letterSpacing: 0.5,
                      background: "#f0f0ee", borderRadius: 4, padding: "2px 8px",
                    }}>#{todo.jobNumber}</span>
                  )}
                  {todo.reminder && (
                    <span className="todo-reminder-date" style={{ fontSize: 11, color: "#A855F7", letterSpacing: 0.3 }}>
                      {new Date(todo.reminder + "T00:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="todo-edit-btn"
                onClick={() => setEditing(todo)}
                title="Edit task"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, lineHeight: 1, flexShrink: 0,
                  color: "#919191", transition: "color 0.15s",
                  display: "flex", alignItems: "center",
                }}
                onMouseOver={e => e.currentTarget.style.color = "#A855F7"}
                onMouseOut={e => e.currentTarget.style.color = "#919191"}
              >
                <svg className="todo-edit-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {todos.some(t => t.done) && (
          <button
            className="clear-completed-btn"
            onClick={() => setTodos(todos.filter(t => !t.done))}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, color: "#ccc", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              letterSpacing: 0.5, marginTop: 32, padding: 0,
              transition: "color 0.15s",
            }}
            onMouseOver={e => e.target.style.color = "#999"}
            onMouseOut={e => e.target.style.color = "#ccc"}
          >
            Clear completed
          </button>
        )}
      </div>

      <style>{`
        @keyframes in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes bannerIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .reminder-input::-webkit-calendar-picker-indicator { opacity: 1; cursor: pointer; filter: brightness(0); }
        .edit-reminder-input::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; filter: brightness(0); }
        .alarm-hour-input::-webkit-inner-spin-button,
        .alarm-hour-input::-webkit-outer-spin-button,
        .alarm-minute-input::-webkit-inner-spin-button,
        .alarm-minute-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}