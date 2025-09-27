"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = Cookies.get('user_role');
    setRole(userRole || null);
  }, []);

  return {
    role,
    isAdmin: role === 'admin',
  };
};