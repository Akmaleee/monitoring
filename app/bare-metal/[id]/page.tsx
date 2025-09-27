import { cookies } from 'next/headers'; 
import { columns, BareMetalNode } from "./columns";
import { DataTable } from "./data-table"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { BackButton } from '@/components/back-button';
import { Separator } from '@/components/ui/separator';

interface BareMetalDetail {
  id: number;
  name: string;
  type: string;
  url: string;
  api_token: string;
  bare_metal_node: BareMetalNode[];
}

async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
  try {
    const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) { return null; }
    const responseData = await res.json();
    return responseData?.data || null;
  } catch (error) {
    console.error("An error occurred while fetching detail data:", error);
    return null;
  }
}

export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const userRole = cookieStore.get('user_role')?.value;
  const isAdmin = userRole === 'admin';

  if (!token) {
    return (
      <div className="container mx-auto py-10">
        <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
      </div>
    );
  }

  const data = await getDetailData(token, id);

  if (!data) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Data Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
        </p>
        <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
          &larr; Back to Bare Metal List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto space-y-4">
        <BackButton />

        <Card className="w-fit">
          <CardHeader>
            <CardTitle>Bare Metal: {data.name}</CardTitle>
            <CardDescription>
              Details for server ID: {data.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* -- Perubahan: Gunakan grid 3 kolom untuk perataan presisi -- */}
            <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-3">
              <div className="font-semibold text-muted-foreground">Type</div>
              <div className="font-semibold text-muted-foreground">:</div>
              <div className="font-medium">{data.type}</div>

              <div className="font-semibold text-muted-foreground">URL</div>
              <div className="font-semibold text-muted-foreground">:</div>
              <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                {data.url}
              </a>

              {isAdmin && (
                <>
                  <div className="font-semibold text-muted-foreground">API Token</div>
                  <div className="font-semibold text-muted-foreground">:</div>
                  <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">
                    {data.api_token}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-6" />

        {data.type.toUpperCase() === 'PROXMOX' && (
          <DataTable
            columns={columns}
            data={data.bare_metal_node}
            titleComponent={<h2 className="text-2xl font-bold whitespace-nowrap m-0">Bare Metal Nodes</h2>}
          />
        )}
      </div>
    </div>
  );
}

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';
// import { Separator } from '@/components/ui/separator';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     if (!res.ok) { return null; }
//     const responseData = await res.json();
//     return responseData?.data || null;
//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;
//   const userRole = cookieStore.get('user_role')?.value;
//   const isAdmin = userRole === 'admin';

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />
//         <Card className="w-fit">
//           <CardHeader>
//             <CardTitle>Bare Metal: {data.name}</CardTitle>
//             <CardDescription>Details for server ID: {data.id}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
//               <div className="text-right font-semibold text-muted-foreground">Type:</div>
//               <div className="font-medium">{data.type}</div>
//               <div className="text-right font-semibold text-muted-foreground">URL:</div>
//               <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{data.url}</a>
//               {isAdmin && (
//                 <>
//                   <div className="text-right font-semibold text-muted-foreground">API Token:</div>
//                   <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">{data.api_token}</div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//         <Separator className="my-6" />
//         {data.type.toUpperCase() === 'PROXMOX' && (
//           <DataTable
//             columns={columns}
//             data={data.bare_metal_node}
//             // -- Tambahkan kelas 'm-0' untuk menghapus margin --
//             titleComponent={<h2 className="text-2xl font-bold whitespace-nowrap m-0">Bare Metal Nodes</h2>}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';
// import { Separator } from '@/components/ui/separator'; // <-- 1. Impor Separator

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;
//   const userRole = cookieStore.get('user_role')?.value;
//   const isAdmin = userRole === 'admin';

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />

//         <Card className="w-fit">
//           <CardHeader>
//             <CardTitle>Bare Metal: {data.name}</CardTitle>
//             <CardDescription>
//               Details for server ID: {data.id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
//               <div className="text-right font-semibold text-muted-foreground">Type:</div>
//               <div className="font-medium">{data.type}</div>

//               <div className="text-right font-semibold text-muted-foreground">URL:</div>
//               <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
//                 {data.url}
//               </a>

//               {isAdmin && (
//                 <>
//                   <div className="text-right font-semibold text-muted-foreground">API Token:</div>
//                   <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">
//                     {data.api_token}
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
        
//         {/* -- 2. Tambahkan Separator di sini -- */}
//         <Separator className="my-6" />

//         {data.type.toUpperCase() === 'PROXMOX' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//             <DataTable columns={columns} data={data.bare_metal_node} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;
//   const userRole = cookieStore.get('user_role')?.value;
//   const isAdmin = userRole === 'admin';

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />

//         <Card className="w-fit">
//           <CardHeader>
//             <CardTitle>Bare Metal: {data.name}</CardTitle>
//             <CardDescription>
//               Details for server ID: {data.id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2 gap-y-3">
//               <div className="font-semibold text-muted-foreground">Type</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <div className="font-medium">{data.type}</div>

//               <div className="font-semibold text-muted-foreground">URL</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
//                 {data.url}
//               </a>

//               {isAdmin && (
//                 <>
//                   <div className="font-semibold text-muted-foreground">API Token</div>
//                   <div className="font-semibold text-muted-foreground">:</div>
//                   <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">
//                     {data.api_token}
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
        
//         {data.type.toUpperCase() === 'PROXMOX' && (
//           // Judul <h2> dihapus dari sini dan dipindahkan ke bawah
//           <DataTable
//             columns={columns}
//             data={data.bare_metal_node}
//             titleComponent={<h2 className="text-2xl font-bold whitespace-nowrap">Bare Metal Nodes</h2>}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;
//   const userRole = cookieStore.get('user_role')?.value;
//   const isAdmin = userRole === 'admin';

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />

//         <Card className="w-fit">
//           <CardHeader>
//             <CardTitle>Bare Metal: {data.name}</CardTitle>
//             <CardDescription>
//               Details for server ID: {data.id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2 gap-y-3">
//               <div className="font-semibold text-muted-foreground">Type</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <div className="font-medium">{data.type}</div>

//               <div className="font-semibold text-muted-foreground">URL</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
//                 {data.url}
//               </a>
              
//               {isAdmin && (
//                 <>
//                   <div className="font-semibold text-muted-foreground">API Token</div>
//                   <div className="font-semibold text-muted-foreground">:</div>
//                   <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">
//                     {data.api_token}
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
        
//         {data.type.toUpperCase() === 'PROXMOX' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//             <DataTable columns={columns} data={data.bare_metal_node} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;
//   // 1. Baca cookie 'user_role' di server
//   const userRole = cookieStore.get('user_role')?.value;
  
//   // 2. Tentukan apakah pengguna adalah admin
//   const isAdmin = userRole === 'admin';

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />

//         <Card className="w-fit">
//           <CardHeader>
//             <CardTitle>Bare Metal: {data.name}</CardTitle>
//             <CardDescription>
//               Details for server ID: {data.id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2 gap-y-3">
//               <div className="font-semibold text-muted-foreground">Type</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <div className="font-medium">{data.type}</div>

//               <div className="font-semibold text-muted-foreground">URL</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
//                 {data.url}
//               </a>

//               {/* -- 3. Tampilkan API Token hanya jika pengguna adalah admin -- */}
//               {isAdmin && (
//                 <>
//                   <div className="font-semibold text-muted-foreground">API Token</div>
//                   <div className="font-semibold text-muted-foreground">:</div>
//                   <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">
//                     {data.api_token}
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
        
//         {data.type.toUpperCase() === 'PROXMOX' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//             <DataTable columns={columns} data={data.bare_metal_node} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />

//         <Card className="w-fit">
//           <CardHeader>
//             <CardTitle>Bare Metal: {data.name}</CardTitle>
//             <CardDescription>
//               Details for server ID: {data.id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* -- PERBAIKAN: Gunakan grid 3 kolom untuk perataan presisi -- */}
//             <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-3">
//               <div className="font-semibold text-muted-foreground">Type</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <div className="font-medium">{data.type}</div>

//               <div className="font-semibold text-muted-foreground">URL</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
//                 {data.url}
//               </a>

//               <div className="font-semibold text-muted-foreground">API Token</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">
//                 {data.api_token}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         {data.type.toUpperCase() === 'PROXMOX' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//             <DataTable columns={columns} data={data.bare_metal_node} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />

//         <Card className="w-fit">
//           <CardHeader>
//             <CardTitle>Bare Metal: {data.name}</CardTitle>
//             <CardDescription>
//               Details for server ID: {data.id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* -- Perubahan: Gunakan grid 3 kolom untuk perataan presisi -- */}
//             <div className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2 gap-y-3">
//               <div className="font-semibold text-muted-foreground">Type</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <div className="font-medium">{data.type}</div>

//               <div className="font-semibold text-muted-foreground">URL</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
//                 {data.url}
//               </a>

//               <div className="font-semibold text-muted-foreground">API Token</div>
//               <div className="font-semibold text-muted-foreground">:</div>
//               <div className="font-mono text-sm break-all p-2 bg-muted rounded-md">
//                 {data.api_token}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         {data.type.toUpperCase() === 'PROXMOX' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//             <DataTable columns={columns} data={data.bare_metal_node} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10 space-y-4">
//       <BackButton />

//       <Card>
//         <CardHeader>
//           <CardTitle>Bare Metal: {data.name}</CardTitle>
//           <CardDescription>
//             Details for server ID: {data.id}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div><span className="font-semibold">Type:</span> {data.type}</div>
//             <div><span className="font-semibold">URL:</span> <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.url}</a></div>
//           </div>
//           <div className="space-y-2">
//             <div className="font-semibold">API Token:</div>
//             <div className="p-2 bg-muted rounded-md font-mono text-sm break-all">
//               {data.api_token}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* -- KONDISI DITAMBAHKAN DI SINI -- */}
//       {/* Bagian ini hanya akan ditampilkan jika data.type adalah "PROXMOX" */}
//       {data.type.toUpperCase() === 'PROXMOX' && (
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//           <DataTable columns={columns} data={data.bare_metal_node} />
//         </div>
//       )}
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button'; // <-- 1. Impor komponen

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10 space-y-4">
//       {/* -- 2. Tambahkan tombol di sini -- */}
//       <BackButton />

//       <Card>
//         <CardHeader>
//           <CardTitle>Bare Metal: {data.name}</CardTitle>
//           <CardDescription>
//             Details for server ID: {data.id}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div><span className="font-semibold">Type:</span> {data.type}</div>
//             <div><span className="font-semibold">URL:</span> <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.url}</a></div>
//           </div>
//           <div className="space-y-2">
//             <div className="font-semibold">API Token:</div>
//             <div className="p-2 bg-muted rounded-md font-mono text-sm break-all">
//               {data.api_token}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//         <DataTable columns={columns} data={data.bare_metal_node} />
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';

// // -- 1. Perbarui tipe data untuk menyertakan api_token --
// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   api_token: string; // <-- Tambahkan ini
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// export default async function BareMetalDetailPage({ params: { id } }: { params: { id:string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Bare Metal: {data.name}</CardTitle>
//           <CardDescription>
//             Details for server ID: {data.id}
//           </CardDescription>
//         </CardHeader>
//         {/* -- 2. Perbarui CardContent untuk menampilkan token -- */}
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div><span className="font-semibold">Type:</span> {data.type}</div>
//             <div><span className="font-semibold">URL:</span> <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.url}</a></div>
//           </div>
//           <div className="space-y-2">
//             <div className="font-semibold">API Token:</div>
//             <div className="p-2 bg-muted rounded-md font-mono text-sm break-all">
//               {data.api_token}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//         <DataTable columns={columns} data={data.bare_metal_node} />
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';

// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//       cache: 'no-store',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     if (responseData && responseData.data) {
//       return responseData.data;
//     }
    
//     console.error(`Data format from API is incorrect for ID ${id}`);
//     return null;

//   } catch (error) {
//     console.error("An error occurred while fetching detail data:", error);
//     return null;
//   }
// }

// // --- PERUBAHAN UTAMA ADA DI BARIS DI BAWAH INI ---
// export default async function BareMetalDetailPage({ params: { id } }: { params: { id: string } }) {
  
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   // Sekarang kita gunakan 'id' yang sudah di-destructure
//   const data = await getDetailData(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The bare metal server with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/bare-metal" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Bare Metal List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Bare Metal: {data.name}</CardTitle>
//           <CardDescription>
//             Details for server ID: {data.id}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-2 gap-4">
//           <div><span className="font-semibold">Type:</span> {data.type}</div>
//           <div><span className="font-semibold">URL:</span> <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.url}</a></div>
//         </CardContent>
//       </Card>
      
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//         <DataTable columns={columns} data={data.bare_metal_node} />
//       </div>
//     </div>
//   );
// }

// // Lokasi: app/bare-metal/[id]/page.tsx

// // PERUBAHAN 1: Hapus import 'js-cookie' karena tidak digunakan di Server Component
// import { cookies } from 'next/headers'; 
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';

// // Tipe untuk data detail lengkap
// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   bare_metal_node: BareMetalNode[];
// }

// // Fungsi get data tetap sama
// async function getDetailData(token: string, id: string): Promise<BareMetalDetail> {
//   const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
//     cache: 'no-store',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch data or token is invalid');
//   }

//   const responseData = await res.json();
//   if (responseData && responseData.data) {
//     return responseData.data;
//   }
  
//   throw new Error('Data format from API is incorrect');
// }


// export default async function BareMetalDetailPage({ params }: { params: { id: string } }) {
  
//   // PERUBAHAN 2 (UTAMA): Tambahkan 'await' di sini
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   // Ambil data langsung di server
//   const data = await getDetailData(token, params.id);

//   return (
//     <div className="container mx-auto py-10 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Bare Metal: {data.name}</CardTitle>
//           <CardDescription>
//             Details for server ID: {data.id}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-2 gap-4">
//           <div><span className="font-semibold">Type:</span> {data.type}</div>
//           <div><span className="font-semibold">URL:</span> <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.url}</a></div>
//         </CardContent>
//       </Card>
      
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Bare Metal Nodes</h2>
//         <DataTable columns={columns} data={data.bare_metal_node} />
//       </div>
//     </div>
//   );
// }


// // Lokasi: app/bare-metal/[id]/page.tsx

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
// import { columns, BareMetalNode } from "./columns";
// import { DataTable } from "./data-table"; // Pastikan path ini benar
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// // Tipe untuk data detail lengkap
// interface BareMetalDetail {
//   id: number;
//   name: string;
//   type: string;
//   url: string;
//   bare_metal_node: BareMetalNode[];
// }

// async function getDetailData(token: string, id: string): Promise<BareMetalDetail> {
//   const res = await fetch(`http://127.0.0.1:3000/bare-metal/${id}`, {
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
  
//   throw new Error('Data format from API is incorrect');
// }

// export default function BareMetalDetailPage({ params }: { params: { id: string } }) {
//   const [data, setData] = useState<BareMetalDetail | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = Cookies.get('auth_token');
//       if (token) {
//         try {
//           const fetchedData = await getDetailData(token, params.id);
//           setData(fetchedData);
//         } catch (err: any) {
//           setError(err.message);
//           if (err.message === 'Token is invalid or expired') {
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
//   }, [params.id]);

//   if (isLoading) {
//     return <div className="container mx-auto py-10"><p>Loading details...</p></div>;
//   }

//   if (error) {
//     return <div className="container mx-auto py-10"><p className="text-red-500">Error: {error}</p></div>;
//   }

//   if (!data) {
//     return <div className="container mx-auto py-10"><p>No data found.</p></div>;
//   }

//   return (
//     <div className="container mx-auto py-10 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Bare Metal: {data.name}</CardTitle>
//           <CardDescription>
//             Details for server ID: {data.id}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-2 gap-4">
//           <div><span className="font-semibold">Type:</span> {data.type}</div>
//           <div><span className="font-semibold">URL:</span> <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{data.url}</a></div>
//         </CardContent>
//       </Card>
      
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Nodes</h2>
//         <DataTable columns={columns} data={data.bare_metal_node} />
//       </div>
//     </div>
//   );
// }