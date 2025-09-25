import { cookies } from 'next/headers'; 
import { columns } from "./columns";
import { DataTable } from "./data-table"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';

// Helper function bisa diletakkan di sini atau di file terpisah
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

async function getVmDetail(token: string, id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:3000/virtual-machine/${id}`, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error(`Failed to fetch data for VM ID ${id}, status: ${res.status}`);
      return null;
    }

    const responseData = await res.json();
    return responseData?.data || null;

  } catch (error) {
    console.error("An error occurred while fetching VM detail data:", error);
    return null;
  }
}

export default async function VmDetailPage({ params: { id } }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return (
      <div className="container mx-auto py-10">
        <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
      </div>
    );
  }

  const data = await getVmDetail(token, id);

  if (!data) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Data Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The Virtual Machine with ID <span className="font-mono">{id}</span> could not be found.
        </p>
        <Link href="/vm" className="mt-4 inline-block text-blue-500 hover:underline">
          &larr; Back to Virtual Machine List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Virtual Machine: {data.name}</CardTitle>
          <CardDescription>
            Details for VM ID: {data.vmid} (Internal ID: {data.id})
          </CardDescription>
        </CardHeader>
         <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Bare Metal ID:</span> {data.bare_metal_id}</div>
            <div><span className="font-semibold">Node ID:</span> {data.bare_metal_node_id}</div>
            <div><span className="font-semibold">CPU:</span> {data.cpu} Cores</div>
            <div><span className="font-semibold">Memory:</span> {formatBytes(data.memory)}</div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">VM Properties</h2>
        {/* Menggunakan array [data] karena DataTable mengharapkan array */}
        <DataTable columns={columns} data={[data]} />
      </div>
    </div>
  );
}