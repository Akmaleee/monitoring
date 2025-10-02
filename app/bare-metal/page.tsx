"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookie, deleteCookie } from "cookies-next"; // Menggunakan cookies-next
import { getColumns, BareMetal } from "./columns"; 
import { DataTable } from "./data-table";
import { DataTableSkeleton } from "./data-table-skeleton";
import { AddBareMetalDialog } from "./add-bare-metal-dialog";
import { useUserRole } from "@/hooks/use-user-role";

async function getData(token: string): Promise<BareMetal[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/bare-metal`, {
    cache: 'no-store',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
  if (!res.ok) throw new Error('Failed to fetch data from API');
  const responseData = await res.json();
  return responseData?.data || [];
}

export default function BareMetalPage() {
  const [data, setData] = useState<BareMetal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useUserRole();

  const fetchAndSetData = useCallback(async () => {
    if (!isLoading) setIsLoading(true);
    
    // Tambahkan 'await' di sini
    const token = await getCookie('auth_token');

    if (token) {
      try {
        const fetchedData = await getData(token);
        setData(fetchedData);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        if (error.message === 'Token is invalid or expired') {
          deleteCookie('auth_token'); // Menggunakan deleteCookie
          window.location.href = '/login';
        }
      }
    } else {
      window.location.href = '/login';
    }
    setIsLoading(false);
  }, [isLoading]);

  useEffect(() => {
    fetchAndSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = getColumns(fetchAndSetData, isAdmin);

  if (isLoading && data.length === 0) return <DataTableSkeleton />;
  if (error) return <div><p className="text-red-500">Error: {error}</p></div>;

  return (
    <div>
      <DataTable 
        columns={columns} 
        data={data}
        titleComponent={<h1 className="text-2xl font-bold whitespace-nowrap">Bare Metal Servers</h1>}
        actionComponent={
          isAdmin && <AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />
        } 
      />
    </div>
  );
}


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { getCookie, deleteCookie } from "cookies-next";
// import { getColumns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "./data-table-skeleton";
// import { AddBareMetalDialog } from "./add-bare-metal-dialog";
// import { useUserRole } from "@/hooks/use-user-role";

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/bare-metal`, {
//     cache: 'no-store',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
//   if (!res.ok) throw new Error('Failed to fetch data from API');
//   const responseData = await res.json();
//   return responseData?.data || [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { isAdmin } = useUserRole();

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);
//     const token = getCookie('auth_token');
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

//   const columns = getColumns(fetchAndSetData, isAdmin);

//   if (isLoading && data.length === 0) return <DataTableSkeleton />;
//   if (error) return <div><p className="text-red-500">Error: {error}</p></div>;

//   return (
//     <div>
//       <DataTable 
//         columns={columns} 
//         data={data}
//         // -- Perubahan di sini: tambahkan 'whitespace-nowrap' --
//         titleComponent={<h1 className="text-2xl font-bold whitespace-nowrap">Bare Metal Servers</h1>}
//         actionComponent={
//           isAdmin && <AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />
//         } 
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// import { getColumns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "./data-table-skeleton";
// import { AddBareMetalDialog } from "./add-bare-metal-dialog";
// import { useUserRole } from "@/hooks/use-user-role";

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
//   if (!res.ok) throw new Error('Failed to fetch data from API');
//   const responseData = await res.json();
//   return responseData?.data || [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { isAdmin } = useUserRole();

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);
//     const token = Cookies.get('auth_token');
//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null);
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           Cookies.remove('auth_token');
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

//   const columns = getColumns(fetchAndSetData, isAdmin);

//   if (isLoading && data.length === 0) return <DataTableSkeleton />;
//   if (error) return <div><p className="text-red-500">Error: {error}</p></div>;

//   return (
//     <div>
//       {/* -- Judul <h1> dihapus dari sini dan dipindahkan ke bawah -- */}
//       <DataTable 
//         columns={columns} 
//         data={data}
//         titleComponent={<h1 className="text-2xl font-bold">Bare Metal</h1>}
//         actionComponent={
//           isAdmin && <AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />
//         } 
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// import { getColumns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "./data-table-skeleton";
// import { AddBareMetalDialog } from "./add-bare-metal-dialog";
// import { useUserRole } from "@/hooks/use-user-role";

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
//   if (!res.ok) throw new Error('Failed to fetch data from API');
//   const responseData = await res.json();
//   return responseData?.data || [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { isAdmin } = useUserRole();

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);
//     const token = Cookies.get('auth_token');
//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null);
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           Cookies.remove('auth_token');
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

//   const columns = getColumns(fetchAndSetData, isAdmin);

//   if (isLoading && data.length === 0) return <DataTableSkeleton />;
//   if (error) return <div><p className="text-red-500">Error: {error}</p></div>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Bare Metal Servers</h1>
//       <DataTable 
//         columns={columns} 
//         data={data}
//         actionComponent={
//           isAdmin && <AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />
//         } 
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// import { getColumns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "./data-table-skeleton";
// import { AddBareMetalDialog } from "./add-bare-metal-dialog";
// // Hapus impor SidebarTrigger dari sini jika ada
// import { useUserRole } from "@/hooks/use-user-role";

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
//   if (!res.ok) throw new Error('Failed to fetch data from API');
//   const responseData = await res.json();
//   return responseData?.data || [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { isAdmin } = useUserRole();

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);
//     const token = Cookies.get('auth_token');
//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null);
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           Cookies.remove('auth_token');
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

//   const columns = getColumns(fetchAndSetData, isAdmin);

//   if (isLoading && data.length === 0) return <DataTableSkeleton />;
//   if (error) return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;

//   return (
//     // -- PERUBAHAN DI SINI: Kembalikan ke struktur semula --
//     <div className="container mx-auto py-10"> 
//       <h1 className="text-2xl font-bold mb-4">Bare Metal Servers</h1>

//       <DataTable 
//         columns={columns} 
//         data={data}
//         actionComponent={
//           isAdmin && <AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />
//         } 
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// import { getColumns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "./data-table-skeleton";
// import { AddBareMetalDialog } from "./add-bare-metal-dialog";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useUserRole } from "@/hooks/use-user-role";

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
//   if (!res.ok) throw new Error('Failed to fetch data from API');
//   const responseData = await res.json();
//   return responseData?.data || [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { isAdmin } = useUserRole();

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);
//     const token = Cookies.get('auth_token');
//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null);
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           Cookies.remove('auth_token');
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

//   const columns = getColumns(fetchAndSetData, isAdmin);

//   if (isLoading && data.length === 0) return <DataTableSkeleton />;
//   if (error) return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;

//   return (
//     <div> 
//       <div className="flex items-center gap-4 mb-6">
//         <SidebarTrigger />
//         <h1 className="text-2xl font-bold">Bare Metal Servers</h1>
//       </div>

//       <DataTable 
//         columns={columns} 
//         data={data}
//         actionComponent={
//           isAdmin && <AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />
//         } 
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// // -- UBAH CARA IMPOR DARI "./columns" --
// import { getColumns, BareMetal } from "@/app/bare-metal/columns"; 
// import { DataTable } from "@/app/bare-metal/data-table";
// import { DataTableSkeleton } from "@/app/bare-metal/data-table-skeleton";
// import { AddBareMetalDialog } from "@/app/bare-metal/add-bare-metal-dialog";

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
//   if (!res.ok) throw new Error('Failed to fetch data from API');
//   const responseData = await res.json();
//   return responseData?.data || [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);
//     const token = Cookies.get('auth_token');
//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null);
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           Cookies.remove('auth_token');
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

//   // -- PANGGIL FUNGSI getColumns DI SINI --
//   const columns = getColumns(fetchAndSetData);

//   if (isLoading && data.length === 0) return <DataTableSkeleton />;
//   if (error) return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-4">Bare Metal Servers</h1>
//       <DataTable 
//         columns={columns} // <-- Gunakan columns yang sudah dibuat
//         data={data}
//         actionComponent={<AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />} 
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// import { columns, BareMetal } from "@/app/bare-metal/columns"; 
// import { DataTable } from "@/app/bare-metal/data-table";
// import { DataTableSkeleton } from "@/app/bare-metal/data-table-skeleton";
// import { AddBareMetalDialog } from "@/app/bare-metal/add-bare-metal-dialog";

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });

//   if (res.status === 401 || res.status === 403) {
//     throw new Error('Token is invalid or expired');
//   }

//   if (!res.ok) {
//     throw new Error('Failed to fetch data from API');
//   }

//   const responseData = await res.json();
//   if (responseData && responseData.data) {
//     return responseData.data;
//   }

//   return [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAndSetData = useCallback(async () => {
//     if (!isLoading) setIsLoading(true);

//     const token = Cookies.get('auth_token');
//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null);
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           Cookies.remove('auth_token');
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
//     // eslint-disable-next-line react-hooks-exhaustive-deps
//   }, []);

//   if (isLoading && data.length === 0) {
//     return <DataTableSkeleton />;
//   }

//   if (error) {
//      return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       {/* -- TOMBOL DIPINDAHKAN DARI SINI -- */}
//       <h1 className="text-2xl font-bold mb-4">Bare Metal Servers</h1>

//       {/* -- TOMBOL DIBERIKAN SEBAGAI PROPERTI DI SINI -- */}
//       <DataTable 
//         columns={columns} 
//         data={data}
//         actionComponent={<AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />} 
//       />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// import { columns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "./data-table-skeleton";
// import { AddBareMetalDialog } from "./add-bare-metal-dialog"; // <-- IMPORT KOMPONEN BARU

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });

//   if (res.status === 401 || res.status === 403) {
//     throw new Error('Token is invalid or expired');
//   }

//   if (!res.ok) {
//     throw new Error('Failed to fetch data from API');
//   }

//   const responseData = await res.json();
//   if (responseData && responseData.data) {
//     return responseData.data;
//   }

//   return [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // <-- KITA BUAT FUNGSI FETCH DATA YANG BISA DIPANGGIL ULANG
//   const fetchAndSetData = useCallback(async () => {
//     // Set loading ke true saat me-refresh data, kecuali saat load pertama
//     if (!isLoading) setIsLoading(true);

//     const token = Cookies.get('auth_token');
//     if (token) {
//       try {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//         setError(null); // Reset error jika fetch berhasil
//       } catch (error: any) {
//         setError(error.message);
//         if (error.message === 'Token is invalid or expired') {
//           Cookies.remove('auth_token');
//           window.location.href = '/login';
//         }
//       }
//     } else {
//       window.location.href = '/login';
//     }
//     setIsLoading(false);
//   }, [isLoading]); // Tambahkan isLoading sebagai dependensi

//   useEffect(() => {
//     fetchAndSetData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // Dijalankan hanya sekali saat komponen mount

//   if (isLoading && data.length === 0) {
//     return <DataTableSkeleton />;
//   }

//   if (error) {
//      return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Bare Metal Servers</h1>
//         {/* <-- TOMBOL DIALOG DITEMPATKAN DI SINI --> */}
//         <AddBareMetalDialog onBareMetalAdded={fetchAndSetData} />
//       </div>
//       {/* Kita pindahkan data-table ke komponen terpisah agar lebih rapi */}
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
// import { columns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";
// import { DataTableSkeleton } from "./data-table-skeleton"; // Import komponen skeleton

// async function getData(token: string): Promise<BareMetal[]> {
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });

//   if (res.status === 401 || res.status === 403) {
//     throw new Error('Token is invalid or expired');
//   }

//   if (!res.ok) {
//     throw new Error('Failed to fetch data from API');
//   }

//   const responseData = await res.json();
//   if (responseData && responseData.data) {
//     return responseData.data;
//   }

//   return [];
// }

// export default function BareMetalPage() {
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Simulate a longer loading time for demo purposes
//       // await new Promise(resolve => setTimeout(resolve, 1500)); 

//       const token = Cookies.get('auth_token');
//       if (token) {
//         try {
//           const fetchedData = await getData(token);
//           setData(fetchedData);
//         } catch (error: any) {
//           setError(error.message);
//           if (error.message === 'Token is invalid or expired') {
//             Cookies.remove('auth_token');
//             window.location.href = '/login';
//           }
//         }
//       } else {
//         window.location.href = '/login';
//       }
//       setIsLoading(false);
//     };

//     fetchData();
//   }, []);

//   // PERUBAHAN UTAMA DI SINI
//   if (isLoading) {
//     return <DataTableSkeleton />;
//   }

//   if (error) {
//      return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-4">Bare Metal Servers</h1>
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }

// // Lokasi: app/bare-metal/page.tsx

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
// // PERUBAHAN 1: Import tipe BareMetal yang baru
// import { columns, BareMetal } from "./columns"; 
// import { DataTable } from "./data-table";

// // PERUBAHAN 2: Fungsi getData disesuaikan
// async function getData(token: string): Promise<BareMetal[]> {
//   // PERUBAHAN 3: URL API diubah ke /bare-metal
//   const res = await fetch('http://127.0.0.1:3000/bare-metal', {
//     cache: 'no-store',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });

//   if (res.status === 401 || res.status === 403) {
//     throw new Error('Token is invalid or expired');
//   }

//   if (!res.ok) {
//     throw new Error('Failed to fetch data from API');
//   }

//   // PERUBAHAN 4: Ambil data dari dalam objek `data`
//   const responseData = await res.json();
//   if (responseData && responseData.data) {
//     return responseData.data;
//   }

//   return []; // Kembalikan array kosong jika data tidak ditemukan
// }

// export default function BareMetalPage() {
//   // PERUBAHAN 5: Gunakan tipe BareMetal[] untuk state
//   const [data, setData] = useState<BareMetal[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = Cookies.get('auth_token');
//       if (token) {
//         try {
//           const fetchedData = await getData(token);
//           setData(fetchedData);
//         } catch (error: any) {
//           setError(error.message);
//           if (error.message === 'Token is invalid or expired') {
//             Cookies.remove('auth_token');
//             window.location.href = '/login';
//           } else {
//             console.error(error);
//           }
//         }
//       } else {
//         window.location.href = '/login';
//       }
//       setIsLoading(false);
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <div className="container mx-auto py-10"><p>Loading data...</p></div>;
//   }

//   if (error) {
//      return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-4">Bare Metal Servers</h1>
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table";

// async function getData(token: string): Promise<BareMetalNode[]> {
//   const res = await fetch('http://localhost:5000/api/nodes', {
//     cache: 'no-store',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });

//   if (res.status === 401 || res.status === 403) {
//     throw new Error('Token is invalid or expired');
//   }

//   if (!res.ok) {
//     throw new Error('Failed to fetch data from API');
//   }

//   return res.json();
// }

// export default function MonitoringPage() {
//   const [data, setData] = useState<BareMetalNode[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = Cookies.get('auth_token');
//       if (token) {
//         try {
//           const fetchedData = await getData(token);
//           setData(fetchedData);
//         } catch (error: any) {
//           if (error.message === 'Token is invalid or expired') {
//             Cookies.remove('auth_token');
//             window.location.href = '/login';
//           } else {
//             console.error(error);
//           }
//         }
//       } else {
//         window.location.href = '/login';
//       }
//       setIsLoading(false);
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <div className="container mx-auto"><p>Loading data...</p></div>;
//   }

//   return (
//     <div className="container mx-auto ">
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table";

// async function getData(token: string): Promise<BareMetalNode[]> {
//   try {
//     const res = await fetch('http://localhost:5000/api/nodes', {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error('Failed to fetch data from API:', res.statusText);
//       return [];
//     }

//     return res.json();
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export default function MonitoringPage() {
//   const [data, setData] = useState<BareMetalNode[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = Cookies.get('auth_token');
//       if (token) {
//         const fetchedData = await getData(token);
//         setData(fetchedData);
//       }
//       setIsLoading(false);
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <div className="container mx-auto"><p>Loading data...</p></div>;
//   }

//   return (
//     <div className="container mx-auto ">
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }



// import { columns, BareMetalNode } from "./columns"
// import { DataTable } from "./data-table"

// async function getData(): Promise<BareMetalNode[]> {
//   try {
//     const res = await fetch('http://localhost:5000/api/nodes', {
//       cache: 'no-store', // Memastikan data selalu baru
//     });

//     if (!res.ok) {
//       throw new Error('Failed to fetch data from API');
//     }

//     return res.json();
//   } catch (error) {
//     console.error(error);
//     return []; // Kembalikan array kosong jika terjadi error
//   }
// }

// export default async function MonitoringPage() {
//   const data = await getData()

//   return (
//     <div className="container mx-auto ">
//       <DataTable columns={columns} data={data} />
//     </div>
//   )
// }

// import { columns, Payment } from "./columns"
// import { DataTable } from "./data-table"

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       wayaw: "akmal",
//       email: "m@example.com",
//     },
//      {
//       id: "728ed52f",
//       amount: 200,
//       status: "pending",
//       wayaw: "waduh",
//       email: "m@example.com",
//     },
//     // ...
//   ]
// }

// export default async function MonitoringPage() {
//   const data = await getData()

//   return (
//     <div className="container mx-auto py-10">
//       <DataTable columns={columns} data={data} />
//     </div>
//   )
// }