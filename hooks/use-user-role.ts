"use client";

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getCookie('user_role');
      setRole(userRole || null);
    };

    fetchRole();
  }, []);

  return {
    role,
    isAdmin: role === 'admin',
  };
};

// "use client";

// import { useState, useEffect } from 'react';
// import { getCookie } from "cookies-next";

// export const useUserRole = () => {
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     const userRole = getCookie('user_role');
//     setRole(userRole || null);
//   }, []);

//   return {
//     role,
//     isAdmin: role === 'admin',
//   };
// };