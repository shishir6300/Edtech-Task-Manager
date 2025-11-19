import { useState, useEffect } from "react";
import { signup, getTeachers } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [msg, setMsg] = useState("");

  // Fetch teachers on component load
  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await getTeachers();
        if (res.data.success) {
          setTeachers(res.data.teachers);
        }
      } catch (err) {
        console.log("Error loading teachers", err);
      }
    }
    loadTeachers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password, role };

      if (role === "student") {
        body.teacherId = teacherId;
      }

      const res = await signup(body);

      if (res.data.success) {
        alert("Signup successful!");
        nav("/login");
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={submit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {role === "student" && (
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Select Teacher</option>

            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.email}
              </option>
            ))}
          </select>
        )}

        <button>Signup</button>
      </form>
    </div>
  );
}
