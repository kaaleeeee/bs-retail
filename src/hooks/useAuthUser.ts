"use client";
import { useState, useEffect } from "react";

export function useAuthUser() {
  const [user, setUser] = useState<{ role: string; name: string } | null>(null);

  useEffect(() => {
    // Parse cookies simply
    const cookies = document.cookie.split(';');
    let role = "staff";
    let name = "Budi Santoso";

    cookies.forEach(cookie => {
      const [k, v] = cookie.split('=').map(c => c.trim());
      if (k === 'auth_role') role = v;
      if (k === 'auth_name') name = v;
    });

    setUser({ role, name });
  }, []);

  return user;
}
