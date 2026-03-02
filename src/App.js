import { useState, useEffect, useRef } from "react";

const STATUS_FILTERS = ["all", "active", "done"];

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
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
    animation: "modalIn 0.2s ease",
    overflow: "hidden",
  };

  return (
    <div className="edit-modal-overlay" style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="edit-modal-card" style={card}>

        {/* Modal Header */}
        <div className="edit-modal-header" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 24px", borderBottom: "1px solid #f0f0ee",
        }}>
          <span className="edit-modal-title" style={{ fontSize: 11, letterSpacing: 2, color: "#999", textTransform: "uppercase" }}>Edit Task</span>
          <button className="edit-modal-close-btn" onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "#ccc", padding: 0, lineHeight: 1,
          }}
            onMouseOver={e => e.target.style.color = "#999"}
            onMouseOut={e => e.target.style.color = "#ccc"}
          >×</button>
        </div>

        {/* Modal Body */}
        <div className="edit-modal-body" style={{ padding: "24px" }}>

          {/* Task text */}
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
                fontSize: 15, fontFamily: "inherit", color: "#1a1a1a", fontWeight: 300,
                boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"}
              onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"}
            />
          </div>

          {/* Notes */}
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
                fontSize: 13, fontFamily: "inherit", color: "#1a1a1a", fontWeight: 300,
                resize: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"}
              onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"}
            />
          </div>

          {/* Reminder + Job row */}
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
                  fontSize: 13, fontFamily: "inherit", color: "#1a1a1a", cursor: "pointer",
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
                    fontFamily: "inherit", padding: 0, letterSpacing: 1,
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
                    fontSize: 13, fontFamily: "inherit", color: "#8d8d8d",
                    width: "100%", boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderBottomColor = "#1a1a1a"}
                  onBlur={e => e.target.style.borderBottomColor = "#e5e5e5"}
                />
              ) : (
                <p style={{ background: "transparent", border: "none", outline: "none",
                    borderBottom: "1px solid #e5e5e5", paddingBottom: 8, paddingTop: 4, fontSize: 13, fontFamily: "inherit", color: "#d6d6d6", margin: 0}}>None</p>
              )}
            </div>
          </div>

          {/* Actions */}
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
                <button
                  className="edit-confirm-yes-btn"
                  onClick={() => { onSave(null); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12, color: "#e57373", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: 0,
                  }}
                >Yes, delete</button>
                <button
                  className="edit-confirm-no-btn"
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: 0,
                  }}
                >Cancel</button>
              </div>
            )}

            <div className="edit-modal-save-group" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <button
                className="edit-cancel-btn"
                onClick={onClose}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  padding: 0, transition: "color 0.15s",
                }}
                onMouseOver={e => e.target.style.color = "#999"}
                onMouseOut={e => e.target.style.color = "#bbb"}
              >Cancel</button>
              <button
                className="edit-save-btn"
                onClick={handleSave}
                style={{
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

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setText] = useState("");
  const [reminder, setReminder] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [hasJob, setHasJob] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobSearch, setJobSearch] = useState("");
  const [clock, setClock] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [jobFocused, setJobFocused] = useState(false);
  const [editing, setEditing] = useState(null); // todo being edited

  useEffect(() => {
    try { localStorage.setItem("todos", JSON.stringify(todos)); } catch {}
  }, [todos]);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setClock(now);
      const today = now.toISOString().split("T")[0];
      setTodos(prev =>
        prev.map(todo => {
          if (todo.reminder === today && !todo.done && !todo.alerted) {
            setAlerts(a => [...a, todo]);
            return { ...todo, alerted: true };
          }
          return todo;
        })
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const add = () => {
    if (!input.trim()) return;
    setTodos([...todos, {
      id: Date.now(),
      text: input.trim(),
      notes: "",
      done: false,
      reminder,
      jobNumber: hasJob ? jobNumber.trim() : "",
      alerted: false,
    }]);
    setText("");
    setReminder("");
    setJobNumber("");
    setHasJob(false);
  };

  const toggle = id => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const dismiss = id => setAlerts(a => a.filter(t => t.id !== id));

  const handleSave = (updated) => {
    if (updated === null) {
      // delete
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

      {/* Edit Modal */}
      {editing && <EditModal todo={editing} onSave={handleSave} onClose={() => setEditing(null)} />}

      {/* Alerts */}
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

        {/* Input Area */}
        <div className="input-area" style={{ marginBottom: 32 }}>
          <div className="input-row" style={{
            borderBottom: `1px solid ${focused ? "#7E78D2" : "#e5e5e5"}`,
            paddingBottom: 16, marginBottom: 16,
            transition: "border-color 0.2s",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <input
              className="task-input"
              value={input}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && add()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Add a task"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 15, fontFamily: "inherit", color: "#1a1a1a", fontWeight: 300,
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
                fontSize: 11, color: "#000000", fontFamily: "inherit", cursor: "pointer",
                opacity: reminder ? 1 : 0.5,
              }}
            />
            <button
              className="add-btn"
              onClick={add}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontSize: 24, color: "#ccc", lineHeight: 1, padding: 0,
                fontWeight: 100, transition: "color 0.15s",
              }}
              onMouseOver={e => e.target.style.color = "#A855F7"}
              onMouseOut={e => e.target.style.color = "#ccc"}
            >+</button>
          </div>

          <div className="job-number-row" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className={`job-toggle-btn${hasJob ? " job-toggle-btn--active" : ""}`}
              onClick={() => { setHasJob(h => !h); setJobNumber(""); }}
              style={{
                background: "none", border: `1px solid ${hasJob ? "#1a1a1a" : "#e0e0e0"}`,
                borderRadius: 4, cursor: "pointer", fontSize: 11,
                color: hasJob ? "#1a1a1a" : "#bbb", fontFamily: "inherit",
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
                  fontSize: 13, fontFamily: "inherit", color: "#1a1a1a",
                  fontWeight: 300, paddingBottom: 4, width: 160,
                  transition: "border-color 0.2s",
                }}
              />
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar" style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn filter-btn--${f}${statusFilter === f ? " filter-btn--active" : ""}`}
              onClick={() => setStatusFilter(f)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, letterSpacing: 0.5, fontFamily: "inherit",
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
                borderBottom: `1px solid ${jobSearch ? "#535353" : "#e5e5e5"}`,
                fontSize: 12, fontFamily: "inherit", color: "#1a1a1a",
                fontWeight: 300, paddingBottom: 4, width: 88,
                transition: "border-color 0.2s",
                WebkitTextFillColor: "#b8b8b8",
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
              {/* Toggle */}
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

              {/* Content */}
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
                    margin: "4px 0 0", lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
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

              {/* Edit btn */}
              <button
                className="todo-edit-btn"
                onClick={() => setEditing(todo)}
                title="Edit task"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, lineHeight: 1, flexShrink: 0,
                  color: "#ddd", transition: "color 0.15s",
                  display: "flex", alignItems: "center",
                }}
                onMouseOver={e => e.currentTarget.style.color = "#A855F7"}
                onMouseOut={e => e.currentTarget.style.color = "#adadad"}
              >
                <svg className="todo-edit-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Clear Completed */}
        {todos.some(t => t.done) && (
          <button
            className="clear-completed-btn"
            onClick={() => setTodos(todos.filter(t => !t.done))}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, color: "#ccc", fontFamily: "inherit",
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
        .reminder-input::-webkit-calendar-picker-indicator { opacity: 1; cursor: pointer; filter: brightness(0); }
        .edit-reminder-input::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; filter: brightness(0); }
      `}</style>
    </div>
  );
}