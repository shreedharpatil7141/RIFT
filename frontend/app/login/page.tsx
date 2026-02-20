"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("auth");
    if (isLoggedIn === "true") {
      router.replace("/");
    }
  }, [router]);

  const handleLogin = () => {
    if (username === "admin" && password === "hackathon") {
      localStorage.setItem("auth", "true");
      router.replace("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0F303C] text-white">
      <div className="bg-[#0C2630] p-10 rounded-xl shadow-xl w-96 space-y-6">
        <h1 className="text-2xl font-bold text-center text-teal-400">
          PharmaGuard Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded bg-[#091E25] border border-slate-600 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-[#091E25] border border-slate-600 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-teal-500 hover:bg-teal-600 py-3 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </main>
  );
}