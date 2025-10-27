// Lokasi: app/user-management/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation"; // <-- Impor useRouter
import { getColumns, User } from "./columns";
import { DataTable } from "./data-table";
import { DataTableSkeleton } from "@/app/bare-metal/data-table-skeleton";
import { AddUserDialog } from "./add-user-dialog";
import { useUserRole } from "@/hooks/use-user-role";

// Set durasi validitas verifikasi (sama dengan halaman verify)
const VERIFICATION_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

async function getData(token: string): Promise<User[]> {
  // ... (fungsi getData tetap sama)
  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users`, {
    cache: 'no-store',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
  if (!res.ok) throw new Error('Failed to fetch data from API');
  const responseData = await res.json();
  return responseData?.data || [];
}

export default function UserManagementPage() {
  const router = useRouter(); // <-- Gunakan router
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading true
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false); // <-- State verifikasi
  const { isAdmin, role } = useUserRole(); // Ambil role juga untuk pengecekan awal

  // --- Pengecekan Verifikasi ---
  useEffect(() => {
    // Pastikan role sudah dimuat sebelum memeriksa verifikasi
    if (role === null) return; // Tunggu role dimuat

    // Jika bukan admin, langsung tolak akses (opsional, tergantung kebutuhan)
    if (role !== 'admin') {
      // Anda bisa redirect atau menampilkan pesan akses ditolak
      // router.replace('/dashboard'); // Contoh redirect
      // Untuk contoh ini, kita biarkan pengecekan isAdmin di bawah
    }

    const verifiedTimestamp = sessionStorage.getItem('user_management_verified_at');
    const now = Date.now();

    if (verifiedTimestamp && (now - parseInt(verifiedTimestamp, 10)) < VERIFICATION_VALIDITY_MS) {
      setIsVerified(true);
    } else {
      // Jika tidak terverifikasi atau sudah kedaluwarsa, redirect
      sessionStorage.removeItem('user_management_verified_at'); // Hapus jika kedaluwarsa
      // Redirect ke halaman verifikasi, sertakan URL saat ini untuk kembali
      router.replace(`/user-management/verify?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [router, role]); // Tambahkan 'role' sebagai dependency


  const fetchAndSetData = useCallback(async () => {
    // Jangan set loading true lagi di sini jika sudah dicek verifikasi
    // if (!isLoading) setIsLoading(true);
    setIsLoading(true); // Set loading true saat mulai fetch data
    const token = await getCookie('auth_token');

    if (token) {
      try {
        const fetchedData = await getData(token);
        setData(fetchedData);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        if (error.message === 'Token is invalid or expired') {
          deleteCookie('auth_token');
          window.location.href = '/login';
        }
      }
    } else {
      window.location.href = '/login';
    }
    setIsLoading(false);
  // Hapus isLoading dari dependency useCallback
  }, []);

  useEffect(() => {
    // Hanya fetch data jika sudah terverifikasi
    if (isVerified && isAdmin) {
      fetchAndSetData();
    } else if (isVerified && !isAdmin) {
      // Jika terverifikasi tapi bukan admin, hentikan loading
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified, isAdmin]); // Fetch data ketika isVerified atau isAdmin berubah


  const columns = getColumns(fetchAndSetData);

  // Tampilkan skeleton atau pesan loading hanya jika belum terverifikasi ATAU sedang fetching data
  if (!isVerified || isLoading) {
    return <DataTableSkeleton />;
  }

  // Tampilkan pesan error jika ada
  if (error) {
     return <div><p className="text-red-500">Error: {error}</p></div>;
   }

  // Tampilkan pesan akses ditolak jika terverifikasi tapi bukan admin
  if (!isAdmin) {
     return <div><p className="text-red-500">Access Denied: You do not have permission to view this page.</p></div>;
   }

  // Render konten utama jika sudah terverifikasi dan admin
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        titleComponent={<h1 className="text-2xl font-bold whitespace-nowrap">User Management</h1>}
        actionComponent={<AddUserDialog onUserAdded={fetchAndSetData} />}
      />
    </div>
  );
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { getCookie, deleteCookie } from "cookies-next";
// import { getColumns, User } from "./columns";
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "@/app/bare-metal/data-table-skeleton";
// import { AddUserDialog } from "./add-user-dialog";
// import { useUserRole } from "@/hooks/use-user-role";

// async function getData(token: string): Promise<User[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users`, {
//     cache: 'no-store',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
//   if (!res.ok) throw new Error('Failed to fetch data from API');
//   const responseData = await res.json();
//   return responseData?.data || [];
// }

// export default function UserManagementPage() {
//   const [data, setData] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { isAdmin } = useUserRole();

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);
//     const token = await getCookie('auth_token');

//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null);
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           deleteCookie('auth_token');
//           window.location.href = '/login';
//         }
//       }
//     } else {
//       window.location.href = '/login';
//     }
//     setIsLoading(false);
//   }, [isLoading]);

//   useEffect(() => {
//     fetchAndSetData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const columns = getColumns(fetchAndSetData);

//   if (isLoading && data.length === 0) return <DataTableSkeleton />;
//   if (error) return <div><p className="text-red-500">Error: {error}</p></div>;
//   if (!isAdmin) return <div><p className="text-red-500">Access Denied</p></div>

//   return (
//     <div>
//       <DataTable
//         columns={columns}
//         data={data}
//         titleComponent={<h1 className="text-2xl font-bold whitespace-nowrap">User Management</h1>}
//         actionComponent={<AddUserDialog onUserAdded={fetchAndSetData} />}
//       />
//     </div>
//   );
// }