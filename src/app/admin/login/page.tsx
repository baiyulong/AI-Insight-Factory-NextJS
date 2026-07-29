"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("密码错误");
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={login} className="bg-white rounded-lg border p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">管理后台登录</h1>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="输入管理密码"
          className="w-full rounded-md border px-3 py-2 text-sm mb-4"
          required
        />
        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          登录
        </button>
      </form>
    </div>
  );
}
