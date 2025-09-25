"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Tipe data sesuai dengan respons API
type VirtualMachineStatus = {
  status: string
}

export type VirtualMachine = {
  id: number
  bare_metal_id: number
  bare_metal_node_id: number
  vmid: string
  code: string
  name: string
  cpu: number
  memory: number
  disk: number
  virtual_machine_status: VirtualMachineStatus
}

// Helper function untuk format ukuran byte
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

// Definisi kolom tabel
export const columns: ColumnDef<VirtualMachine>[] = [
  // 1. Status
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown';
      switch (status) {
        case 'running':
          return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
        case 'stopped':
          return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
        default:
          return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
      }
    },
  },
  // 2. Bare Metal ID
  { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
  // 3. Bare Metal Node ID
  { accessorKey: "bare_metal_node_id", header: "Node ID" },
  // 4. VM ID
  { accessorKey: "vmid", header: "VM ID" },
  // 5. Code
  { accessorKey: "code", header: "Code" },
  // 6. Name
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  // 7. CPU
  { accessorKey: "cpu", header: "CPU" },
  // 8. Memory
  {
    accessorKey: "memory",
    header: () => <div className="text-right">Memory</div>,
    cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("memory"))}</div>,
  },
  // 9. Disk
  {
    accessorKey: "disk",
    header: () => <div className="text-right">Disk</div>,
    cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("disk"))}</div>,
  },
  // 10. Action
  {
    id: "actions",
    cell: ({ row }) => {
      const vm = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/vm/${vm.id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { ArrowUpDown, MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// // 1. Tipe data diubah sesuai dengan kolom-kolom baru
// export type VirtualMachine = {
//   bare_metal_id: number
//   bare_metal_node_Id: number
//   vmid: number
//   code: string
//   name: string
//   cpu: number
//   memory: number // diasumsikan dalam bytes
//   disk: number   // diasumsikan dalam bytes
// }

// // Helper function untuk format ukuran byte (GB, MB, KB)
// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// // 2. Definisi kolom diperbarui untuk tipe VirtualMachine
// export const columns: ColumnDef<VirtualMachine>[] = [
//   {
//     accessorKey: "vmid",
//     header: "VM ID",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-x-2">
//         {/* Indikator status online */}
//         <span className="relative flex size-3">
//           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//           <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//         </span>
//         {row.getValue("vmid")}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "code",
//     header: "Code",
//   },
//   {
//     accessorKey: "cpu",
//     header: () => <div className="text-center">CPU</div>,
//     cell: ({ row }) => <div className="text-center">{row.getValue("cpu")} Cores</div>,
//   },
//   {
//     accessorKey: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     cell: ({ row }) => {
//       const formattedMemory = formatBytes(row.getValue("memory"))
//       return <div className="text-right font-medium">{formattedMemory}</div>
//     },
//   },
//   {
//     accessorKey: "disk",
//     header: () => <div className="text-right">Disk</div>,
//     cell: ({ row }) => {
//       const formattedDisk = formatBytes(row.getValue("disk"))
//       return <div className="text-right font-medium">{formattedDisk}</div>
//     },
//   },
//   {
//     accessorKey: "bare_metal_node_Id",
//     header: "Node ID",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(String(vm.vmid))}
//             >
//               Copy VM ID
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]