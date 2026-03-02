import { useState, useEffect } from "react";

const FILTERS = ["all", "active", "done"];

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setText] = useState("");
  const [reminder, setReminder] = useState("");
  const [filter, setFilter] = useState("all");
  const [clock, setClock] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [focused, setFocused] = useState(false);

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
    setTodos([...todos, { id: Date.now(), text: input.trim(), done: false, reminder, alerted: false }]);
    setText("");
    setReminder("");
  };

  const toggle = id => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = id => setTodos(todos.filter(t => t.id !== id));
  const dismiss = id => setAlerts(a => a.filter(t => t.id !== id));

  const visible = todos.filter(t =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true
  );
  const pending = todos.filter(t => !t.done).length;

  const today = clock.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const time = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafaf8",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#1a1a1a",
      display: "flex",
      justifyContent: "center",
      padding: "80px 24px",
    }}>
      {/* Alerts */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 99, display: "flex", flexDirection: "column", gap: 8 }}>
        {alerts.map(a => (
          <div key={a.id} style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: "12px 16px",
            minWidth: 220,
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            animation: "in 0.25s ease",
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>Reminder</div>
            <div style={{ fontSize: 14, marginBottom: 10, color: "#1a1a1a" }}>{a.text}</div>
            <button onClick={() => dismiss(a.id)} style={{
              background: "#1a1a1a", color: "#fafaf8", border: "none", borderRadius: 4,
              padding: "4px 12px", cursor: "pointer", fontSize: 11, letterSpacing: 0.5,
            }}>Dismiss</button>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Date & Time */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: "#999", letterSpacing: 1, marginBottom: 4 }}>
            {today}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 300, letterSpacing: -0.5, color: "#1a1a1a" }}>
              {pending > 0 ? `${pending} left to do` : "All done."}
            </h1>
            <span style={{ fontSize: 13, color: "#bbb", fontWeight: 300 }}>{time}</span>
          </div>
        </div>

        {/* Input */}
        <div style={{
          borderBottom: `1px solid ${focused ? "#1a1a1a" : "#e5e5e5"}`,
          paddingBottom: 12,
          marginBottom: 32,
          transition: "border-color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <input
            value={input}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Add a task"
            style={{
              flex: 1,
              background: "transparent", border: "none", outline: "none",
              fontSize: 15, fontFamily: "inherit", color: "#1a1a1a",
              fontWeight: 300,
            }}
          />
          <input
            type="date"
            value={reminder}
            onChange={e => setReminder(e.target.value)}
            title="Set reminder"
            style={{
              background: "transparent", border: "none", outline: "none",
              fontSize: 11, color: "#bbb", fontFamily: "inherit", cursor: "pointer",
              opacity: reminder ? 1 : 0.5,
            }}
          />
          <button onClick={add} style={{
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 22, color: "#ccc", lineHeight: 1, padding: 0,
            fontWeight: 200,
            transition: "color 0.15s",
          }}
            onMouseOver={e => e.target.style.color = "#1a1a1a"}
            onMouseOut={e => e.target.style.color = "#ccc"}
          >+</button>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, letterSpacing: 0.5, fontFamily: "inherit",
              color: filter === f ? "#1a1a1a" : "#bbb",
              fontWeight: filter === f ? 500 : 300,
              padding: 0,
              textTransform: "capitalize",
              transition: "color 0.15s",
              borderBottom: filter === f ? "1px solid #1a1a1a" : "1px solid transparent",
              paddingBottom: 2,
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Todos */}
        <div>
          {visible.length === 0 && (
            <div style={{ fontSize: 13, color: "#ccc", padding: "24px 0", fontWeight: 300 }}>Nothing here.</div>
          )}
          {visible.map((todo, i) => (
            <div key={todo.id} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "14px 0",
              borderBottom: "1px solid #f0f0ee",
              opacity: todo.done ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}>
              <button onClick={() => toggle(todo.id)} style={{
                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                border: `1px solid ${todo.done ? "#1a1a1a" : "#d5d5d5"}`,
                background: todo.done ? "#1a1a1a" : "transparent",
                cursor: "pointer", marginTop: 2, display: "flex",
                alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}>
                {todo.done && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fafaf8" }} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14, fontWeight: 300, lineHeight: 1.5,
                  textDecoration: todo.done ? "line-through" : "none",
                  color: "#1a1a1a",
                }}>
                  {todo.text}
                </div>
                {todo.reminder && (
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 3, letterSpacing: 0.3 }}>
                    {new Date(todo.reminder + "T00:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}
                  </div>
                )}
              </div>

              <button onClick={() => remove(todo.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 16, color: "#ddd", padding: 0, lineHeight: 1,
                transition: "color 0.15s",
              }}
                onMouseOver={e => e.target.style.color = "#999"}
                onMouseOut={e => e.target.style.color = "#ddd"}
              >×</button>
            </div>
          ))}
        </div>

        {todos.some(t => t.done) && (
          <button onClick={() => setTodos(todos.filter(t => !t.done))} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 11, color: "#ccc", fontFamily: "inherit",
            letterSpacing: 0.5, marginTop: 24, padding: 0,
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
        @keyframes in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.3; cursor: pointer; }
      `}</style>
    </div>
  );
}