"use client";

import Link from "next/link"; // <-- Impor Link
import { useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie';
import { columns, VirtualMachine } from "./columns";
import { DataTable } from "./data-table";
// Hapus import AddVmDialog
import { DataTableSkeleton } from "@/app/bare-metal/data-table-skeleton";
import { Button } from "@/components/ui/button"; // <-- Impor Button
import { PlusCircle } from "lucide-react";

async function getData(token: string): Promise<VirtualMachine[]> {
  const res = await fetch('http://127.0.0.1:3000/virtual-machine', {
    cache: 'no-store',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
  if (!res.ok) throw new Error('Failed to fetch data from API');
  const responseData = await res.json();
  return responseData.data || []; 
}

export default function VmPage() {
  const [data, setData] = useState<VirtualMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi fetchAndSetData tetap sama, tidak perlu diubah
  const fetchAndSetData = useCallback(async () => {
    if (!isLoading) setIsLoading(true);
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const fetchedData = await getData(token);
        setData(fetchedData);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        if (error.message === 'Token is invalid or expired') {
          Cookies.remove('auth_token');
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

  if (isLoading && data.length === 0) {
    return <div className="container mx-auto py-10"><DataTableSkeleton /></div>;
  }
  if (error) {
    return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Virtual Machines</h1>
      <DataTable 
        columns={columns} 
        data={data}
        // -- UBAH TOMBOL MENJADI LINK KE HALAMAN BARU --
        actionComponent={
          <Button asChild>
            <Link href="/vm/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Virtual Machine
            </Link>
          </Button>
        }
      />
    </div>
  );
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Cookies from 'js-cookie';
// import { columns, VirtualMachine } from "./columns";
// import { DataTable } from "./data-table";
// import { AddVmDialog } from "./add-vm-dialog";
// import { DataTableSkeleton } from "@/app/bare-metal/data-table-skeleton"; // Kita bisa pakai ulang skeleton dari bare-metal

// async function getData(token: string): Promise<VirtualMachine[]> {
//   const res = await fetch('http://127.0.0.1:3000/virtual-machine', {
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
//   // Pastikan kita mengembalikan array dari properti 'data'
//   return responseData.data || []; 
// }

// export default function VmPage() {
//   const [data, setData] = useState<VirtualMachine[]>([]);
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

//   if (isLoading && data.length === 0) {
//     return <div className="container mx-auto py-10"><DataTableSkeleton /></div>;
//   }

//   if (error) {
//     return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-4">Virtual Machines</h1>
//       <DataTable 
//         columns={columns} 
//         data={data}
//         actionComponent={<AddVmDialog onVmAdded={fetchAndSetData} />}
//       />
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
// import { columns, VirtualMachine } from "./columns";
// import { DataTable } from "./data-table";

// async function getData(token: string): Promise<VirtualMachine[]> {
//   const res = await fetch('http://localhost:5000/api/vm', {
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

// export default function VmPage() {
//   const [data, setData] = useState<VirtualMachine[]>([]);
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
// import { columns, VirtualMachine } from "./columns";
// import { DataTable } from "./data-table";

// async function getData(token: string): Promise<VirtualMachine[]> {
//   try {
//     const res = await fetch('http://localhost:5000/api/vm', {
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

// export default function VmPage() {
//   const [data, setData] = useState<VirtualMachine[]>([]);
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



// import { columns, VirtualMachine } from "./columns"
// import { DataTable } from "./data-table"

// async function getData(): Promise<VirtualMachine[]> {
//   try {
//     const res = await fetch('http://localhost:5000/api/vm', {
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

// export default async function vmPage() {
//   const data = await getData()

//   return (
//     <div className="container mx-auto ">
//       <DataTable columns={columns} data={data} />
//     </div>
//   )
// }

// export default function vm(){
//     return(
//         <div>Halaman VM</div>
//     )
// }