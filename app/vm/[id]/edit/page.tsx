import { cookies } from 'next/headers'; 
import Link from 'next/link';
import { EditVmForm } from './edit-vm-form';
import { BackButton } from '@/components/back-button'; // <-- 1. Impor komponen baru

async function getVmDetail(token: string, id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/virtual-machine/${id}`, {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const responseData = await res.json();
    return responseData?.data || null;
  } catch (error) {
    console.error("Failed to fetch VM detail:", error);
    return null;
  }
}

export default async function EditVmPage({ params: { id } }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return (
      <div className="container mx-auto py-10">
        <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
      </div>
    );
  }

  const vmData = await getVmDetail(token, id);

  if (!vmData) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Data Not Found</h1>
        <Link href="/vm" className="mt-4 inline-block text-blue-500 hover:underline">
          &larr; Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Virtual Machine: {vmData.name}</h1>
          <p className="text-muted-foreground">
            Update the VM details and configuration below.
          </p>
        </div>

        {/* -- 2. Tambahkan tombol di sini -- */}
        <BackButton />

        <EditVmForm initialData={vmData} />
      </div>
    </div>
  );
}

// import { cookies } from 'next/headers'; 
// import Link from 'next/link';
// import { EditVmForm } from './edit-vm-form';

// async function getVmDetail(token: string, id: string) {
//   try {
//     const res = await fetch(`http://127.0.0.1:3000/virtual-machine/${id}`, {
//       cache: 'no-store',
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
//     if (!res.ok) return null;
//     const responseData = await res.json();
//     return responseData?.data || null;
//   } catch (error) {
//     console.error("Failed to fetch VM detail:", error);
//     return null;
//   }
// }

// export default async function EditVmPage({ params: { id } }: { params: { id: string } }) {
//   // -- PERBAIKAN DI SINI: tambahkan 'await' --
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;

//   if (!token) {
//     return (
//       <div className="container mx-auto py-10">
//         <p>Authentication required. Please <Link href="/login" className="text-blue-500">login</Link>.</p>
//       </div>
//     );
//   }

//   const vmData = await getVmDetail(token, id);

//   if (!vmData) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-2xl font-bold">Data Not Found</h1>
//         <Link href="/vm" className="mt-4 inline-block text-blue-500 hover:underline">
//           &larr; Back to List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <div className="max-w-3xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold">Edit Virtual Machine: {vmData.name}</h1>
//           <p className="text-muted-foreground">
//             Update the VM details and configuration below.
//           </p>
//         </div>
//         <EditVmForm initialData={vmData} />
//       </div>
//     </div>
//   );
// }