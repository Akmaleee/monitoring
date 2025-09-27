import { cookies } from 'next/headers'; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { BackButton } from '@/components/back-button';
import { Badge } from '@/components/ui/badge';

// ... (Tipe data dan fungsi getVmDetail tetap sama) ...
type VirtualMachineDetail = { id: number; bare_metal_id: number; bare_metal_node_id: number; vmid: string; code: string; name: string; cpu: number; memory: number; disk: number; virtual_machine_config: { id: number; is_alert_status: boolean; is_alert_disk: boolean; threshold_disk: number; }; virtual_machine_status: { status: string; }; }
const formatBytes = (bytes: number, decimals = 2) => { if (!+bytes) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`; }
async function getVmDetail(token: string, id: string): Promise<VirtualMachineDetail | null> { try { const res = await fetch(`http://127.0.0.1:3000/virtual-machine/${id}`, { cache: 'no-store', headers: { 'Authorization': `Bearer ${token}` } }); if (!res.ok) return null; return (await res.json())?.data || null; } catch (error) { console.error("An error occurred while fetching VM detail data:", error); return null; } }


// -- Perubahan: Komponen DetailRow diubah menjadi 3 kolom --
const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <>
    <div className="font-semibold text-muted-foreground">{label}</div>
    <div className="font-semibold text-muted-foreground">:</div>
    <div className="font-medium break-all">{children}</div>
  </>
);

export default async function VmDetailPage({ params: { id } }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return <div className="container mx-auto py-10"><p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p></div>;
  }

  const data = await getVmDetail(token, id);

  if (!data) {
    return <div className="container mx-auto py-10"><h1 className="text-2xl font-bold">Data Not Found</h1></div>;
  }

  const status = data.virtual_machine_status?.status?.toLowerCase() || 'unknown';
  let statusColor: "green" | "red" | "gray" = "gray";
  if (status === 'running') statusColor = "green";
  if (status === 'stopped') statusColor = "red";

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto space-y-4">
        <BackButton />

        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Virtual Machine: {data.name}</h1>
                <p className="text-muted-foreground">Details for VM ID: {data.vmid} (Internal ID: {data.id})</p>
            </div>
            <div className="flex items-center gap-x-2">
                <span className={`relative flex h-3 w-3`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor}-400 opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor}-500`}></span>
                </span>
                <span className="font-semibold capitalize">{status}</span>
            </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources & Details</TabsTrigger>
            <TabsTrigger value="alerts">Alert Config</TabsTrigger>
          </TabsList>

          {/* -- Perubahan: Grid diubah menjadi 3 kolom -- */}
          <TabsContent value="overview">
            <Card>
              <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-4">
                  <DetailRow label="Name">{data.name}</DetailRow>
                  <DetailRow label="Code">{data.code || "-"}</DetailRow>
                  <DetailRow label="VM ID">{data.vmid}</DetailRow>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
                <CardHeader><CardTitle>Resources & Details</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-4">
                        <DetailRow label="Bare Metal ID">{data.bare_metal_id}</DetailRow>
                        <DetailRow label="Node ID">{data.bare_metal_node_id}</DetailRow>
                        <DetailRow label="CPU">{data.cpu} Cores</DetailRow>
                        <DetailRow label="Memory">{formatBytes(data.memory)}</DetailRow>
                        <DetailRow label="Disk">{formatBytes(data.disk)}</DetailRow>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
             <Card>
                <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
                <CardContent>
                     <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-4">
                        <DetailRow label="Status Alert">
                            {data.virtual_machine_config.is_alert_status ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge>}
                        </DetailRow>
                        <DetailRow label="Disk Alert">
                            {data.virtual_machine_config.is_alert_disk ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge>}
                        </DetailRow>
                        <DetailRow label="Disk Threshold">{data.virtual_machine_config.threshold_disk}%</DetailRow>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// import { cookies } from 'next/headers'; 
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button';
// import { Badge } from '@/components/ui/badge';

// type VirtualMachineDetail = {
//   id: number; bare_metal_id: number; bare_metal_node_id: number; vmid: string; code: string; name: string; cpu: number; memory: number; disk: number; virtual_machine_config: { id: number; is_alert_status: boolean; is_alert_disk: boolean; threshold_disk: number; }; virtual_machine_status: { status: string; };
// }

// const formatBytes = (bytes: number, decimals = 2) => { if (!+bytes) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`; }

// async function getVmDetail(token: string, id: string): Promise<VirtualMachineDetail | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/virtual-machine/${id}`, { cache: 'no-store', headers: { 'Authorization': `Bearer ${token}` } });
//     if (!res.ok) return null;
//     return (await res.json())?.data || null;
//   } catch (error) {
//     console.error("An error occurred while fetching VM detail data:", error);
//     return null;
//   }
// }

// const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
//   <>
//     <div className="text-right font-semibold text-muted-foreground">{label}:</div>
//     <div className="font-medium break-all">{children}</div>
//   </>
// );

// export default async function VmDetailPage({ params: { id } }: { params: { id: string } }) {
//   // -- PERBAIKAN DI SINI: tambahkan 'await' --
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return <div className="container mx-auto py-10"><p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p></div>;
//   }

//   const data = await getVmDetail(token, id);

//   if (!data) {
//     return <div className="container mx-auto py-10"><h1 className="text-2xl font-bold">Data Not Found</h1></div>;
//   }

//   const status = data.virtual_machine_status?.status?.toLowerCase() || 'unknown';
//   let statusColor: "green" | "red" | "gray" = "gray";
//   if (status === 'running') statusColor = "green";
//   if (status === 'stopped') statusColor = "red";

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <BackButton />

//         <div className="flex items-center justify-between">
//             <div>
//                 <h1 className="text-2xl font-bold">Virtual Machine: {data.name}</h1>
//                 <p className="text-muted-foreground">Details for VM ID: {data.vmid} (Internal ID: {data.id})</p>
//             </div>
//             <div className="flex items-center gap-x-2">
//                 <span className={`relative flex h-3 w-3`}>
//                     <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${statusColor}-400 opacity-75`}></span>
//                     <span className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor}-500`}></span>
//                 </span>
//                 <span className="font-semibold capitalize">{status}</span>
//             </div>
//         </div>
        
//         <Tabs defaultValue="overview" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="resources">Resources & Details</TabsTrigger>
//             <TabsTrigger value="alerts">Alert Config</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview">
//             <Card>
//               <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-[140px_1fr] items-center gap-x-6 gap-y-4">
//                   <DetailRow label="Name">{data.name}</DetailRow>
//                   <DetailRow label="Code">{data.code || "-"}</DetailRow>
//                   <DetailRow label="VM ID">{data.vmid}</DetailRow>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="resources">
//             <Card>
//                 <CardHeader><CardTitle>Resources & Details</CardTitle></CardHeader>
//                 <CardContent>
//                     <div className="grid grid-cols-[140px_1fr] items-center gap-x-6 gap-y-4">
//                         <DetailRow label="Bare Metal ID">{data.bare_metal_id}</DetailRow>
//                         <DetailRow label="Node ID">{data.bare_metal_node_id}</DetailRow>
//                         <DetailRow label="CPU">{data.cpu} Cores</DetailRow>
//                         <DetailRow label="Memory">{formatBytes(data.memory)}</DetailRow>
//                         <DetailRow label="Disk">{formatBytes(data.disk)}</DetailRow>
//                     </div>
//                 </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="alerts">
//              <Card>
//                 <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
//                 <CardContent>
//                      <div className="grid grid-cols-[140px_1fr] items-center gap-x-6 gap-y-4">
//                         <DetailRow label="Status Alert">
//                             {data.virtual_machine_config.is_alert_status ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge>}
//                         </DetailRow>
//                         <DetailRow label="Disk Alert">
//                             {data.virtual_machine_config.is_alert_disk ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge>}
//                         </DetailRow>
//                         <DetailRow label="Disk Threshold">{data.virtual_machine_config.threshold_disk}%</DetailRow>
//                     </div>
//                 </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }


// import { cookies } from 'next/headers'; 
// import { columns } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';
// import { BackButton } from '@/components/back-button'; // <-- 1. Impor komponen

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// async function getVmDetail(token: string, id: string) {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/virtual-machine/${id}`, {
//       cache: 'no-store',
//       headers: { 'Authorization': `Bearer ${token}` }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for VM ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching VM detail data:", error);
//     return null;
//   }
// }

// export default async function VmDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getVmDetail(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The Virtual Machine with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/vm" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Virtual Machine List
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
//           <CardTitle>Virtual Machine: {data.name}</CardTitle>
//           <CardDescription>
//             Details for VM ID: {data.vmid} (Internal ID: {data.id})
//           </CardDescription>
//         </CardHeader>
//          <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             <div><span className="font-semibold">Bare Metal ID:</span> {data.bare_metal_id}</div>
//             <div><span className="font-semibold">Node ID:</span> {data.bare_metal_node_id}</div>
//             <div><span className="font-semibold">CPU:</span> {data.cpu} Cores</div>
//             <div><span className="font-semibold">Memory:</span> {formatBytes(data.memory)}</div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <div>
//         <h2 className="text-2xl font-bold mb-4">VM Config</h2>
//         <DataTable columns={columns} data={[data]} />
//       </div>
//     </div>
//   );
// }

// import { cookies } from 'next/headers'; 
// import { columns } from "./columns";
// import { DataTable } from "./data-table"; 
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import Link from 'next/link';

// // Helper function bisa diletakkan di sini atau di file terpisah
// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// async function getVmDetail(token: string, id: string) {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/virtual-machine/${id}`, {
//       cache: 'no-store',
//       headers: { 'Authorization': `Bearer ${token}` }
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch data for VM ID ${id}, status: ${res.status}`);
//       return null;
//     }

//     const responseData = await res.json();
//     return responseData?.data || null;

//   } catch (error) {
//     console.error("An error occurred while fetching VM detail data:", error);
//     return null;
//   }
// }

// export default async function VmDetailPage({ params: { id } }: { params: { id: string } }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const data = await getVmDetail(token, id);

//   if (!data) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <p className="mt-2 text-muted-foreground">
//           The Virtual Machine with ID <span className="font-mono">{id}</span> could not be found.
//         </p>
//         <Link href="/vm" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to Virtual Machine List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Virtual Machine: {data.name}</CardTitle>
//           <CardDescription>
//             Details for VM ID: {data.vmid} (Internal ID: {data.id})
//           </CardDescription>
//         </CardHeader>
//          <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             <div><span className="font-semibold">Bare Metal ID:</span> {data.bare_metal_id}</div>
//             <div><span className="font-semibold">Node ID:</span> {data.bare_metal_node_id}</div>
//             <div><span className="font-semibold">CPU:</span> {data.cpu} Cores</div>
//             <div><span className="font-semibold">Memory:</span> {formatBytes(data.memory)}</div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <div>
//         <h2 className="text-2xl font-bold mb-4">VM Properties</h2>
//         {/* Menggunakan array [data] karena DataTable mengharapkan array */}
//         <DataTable columns={columns} data={[data]} />
//       </div>
//     </div>
//   );
// }