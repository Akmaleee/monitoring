"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

// Tipe data untuk detail VM
export type VirtualMachineDetail = {
  id: number;
  virtual_machine_config: {
    id: number; // <-- PERBAIKAN DI SINI
    is_alert_status: boolean;
    is_alert_disk: boolean;
    threshold_disk: number;
  };
  // Properti lain masih ada di data, tapi tidak kita gunakan di kolom
  [key: string]: any; 
}

// Definisi kolom yang sudah disederhanakan
export const columns: ColumnDef<VirtualMachineDetail>[] = [
  { 
    header: "Status Alert", 
    cell: ({ row }) => row.original.virtual_machine_config.is_alert_status 
      ? <Badge>Enabled</Badge> 
      : <Badge variant="secondary">Disabled</Badge> 
  },
  { 
    header: "Disk Alert", 
    cell: ({ row }) => row.original.virtual_machine_config.is_alert_disk 
      ? <Badge>Enabled</Badge> 
      : <Badge variant="secondary">Disabled</Badge> 
  },
  { 
    header: "Disk Threshold", 
    cell: ({ row }) => `${row.original.virtual_machine_config.threshold_disk}%` 
  },
]


// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { Badge } from "@/components/ui/badge"

// // Tipe data untuk detail VM
// export type VirtualMachineDetail = {
//   id: number;
//   virtual_machine_config: {
//     is_alert_status: boolean;
//     is_alert_disk: boolean;
//     threshold_disk: number;
//   };
//   // Properti lain masih ada di data, tapi tidak kita gunakan di kolom
//   [key: string]: any; 
// }

// // Definisi kolom yang sudah disederhanakan
// export const columns: ColumnDef<VirtualMachineDetail>[] = [
//   { 
//     header: "Status Alert", 
//     cell: ({ row }) => row.original.virtual_machine_config.is_alert_status 
//       ? <Badge>Enabled</Badge> 
//       : <Badge variant="secondary">Disabled</Badge> 
//   },
//   { 
//     header: "Disk Alert", 
//     cell: ({ row }) => row.original.virtual_machine_config.is_alert_disk 
//       ? <Badge>Enabled</Badge> 
//       : <Badge variant="secondary">Disabled</Badge> 
//   },
//   { 
//     header: "Disk Threshold", 
//     cell: ({ row }) => `${row.original.virtual_machine_config.threshold_disk}%` 
//   },
// ]

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link"
// // Hapus import HistoryDialog

// export type VirtualMachineDetail = {
//   // ... (definisi tipe tetap sama) ...
//   id: number; bare_metal_id: number; bare_metal_node_id: number; vmid: string; code: string; name: string; cpu: number; memory: number; disk: number; virtual_machine_config: { id: number; is_alert_status: boolean; is_alert_disk: boolean; threshold_disk: number; }; virtual_machine_status: { status: string; };
// }

// const formatBytes = (bytes: number, decimals = 2) => { if (!+bytes) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`; }

// export const columns: ColumnDef<VirtualMachineDetail>[] = [
//   // ... (semua kolom lain tetap sama) ...
//   { id: "status", header: "Status", cell: ({ row }) => { const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown'; let colorClass = "bg-gray-500"; if (status === 'running') colorClass = "bg-green-500"; if (status === 'stopped') colorClass = "bg-red-500"; return <div className="flex items-center gap-x-2"><span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span><span className="capitalize">{status}</span></div>; }},
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" }, { accessorKey: "bare_metal_node_id", header: "Node ID" }, { accessorKey: "vmid", header: "VM ID" }, { accessorKey: "code", header: "Code" }, { accessorKey: "name", header: "Name" }, { accessorKey: "cpu", header: "CPU" }, { accessorKey: "memory", header: "Memory", cell: ({ row }) => formatBytes(row.original.memory) }, { accessorKey: "disk", header: "Disk", cell: ({ row }) => formatBytes(row.original.disk) }, { header: "Status Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_status ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> }, { header: "Disk Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_disk ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> }, { header: "Disk Threshold", cell: ({ row }) => `${row.original.virtual_machine_config.threshold_disk}%` },

//   {
//     id: "actions",
//     cell: ({ row }) => {
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             {/* -- OPSI VIEW HISTORY DIHAPUS DARI SINI -- */}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import { HistoryDialog } from "../history-dialog"

// export type VirtualMachineDetail = {
//   id: number; bare_metal_id: number; bare_metal_node_id: number; vmid: string; code: string; name: string; cpu: number; memory: number; disk: number; virtual_machine_config: { id: number; is_alert_status: boolean; is_alert_disk: boolean; threshold_disk: number; }; virtual_machine_status: { status: string; };
// }

// const formatBytes = (bytes: number, decimals = 2) => { if (!+bytes) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`; }

// export const columns: ColumnDef<VirtualMachineDetail>[] = [
//   { id: "status", header: "Status", cell: ({ row }) => { const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown'; let colorClass = "bg-gray-500"; if (status === 'running') colorClass = "bg-green-500"; if (status === 'stopped') colorClass = "bg-red-500"; return <div className="flex items-center gap-x-2"><span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span><span className="capitalize">{status}</span></div>; }},
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
//   { accessorKey: "bare_metal_node_id", header: "Node ID" },
//   { accessorKey: "vmid", header: "VM ID" },
//   { accessorKey: "code", header: "Code" },
//   { accessorKey: "name", header: "Name" },
//   { accessorKey: "cpu", header: "CPU" },
//   { accessorKey: "memory", header: "Memory", cell: ({ row }) => formatBytes(row.original.memory) },
//   { accessorKey: "disk", header: "Disk", cell: ({ row }) => formatBytes(row.original.disk) },
//   { header: "Status Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_status ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> },
//   { header: "Disk Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_disk ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> },
//   { header: "Disk Threshold", cell: ({ row }) => `${row.original.virtual_machine_config.threshold_disk}%` },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <HistoryDialog vm={vm} />
//             {/* -- OPSI EDIT DIHAPUS DARI SINI -- */}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link"
// import { HistoryDialog } from "./history-dialog" // <-- 1. Impor komponen dialog baru

// export type VirtualMachineDetail = {
//   id: number; bare_metal_id: number; bare_metal_node_id: number; vmid: string; code: string; name: string; cpu: number; memory: number; disk: number; virtual_machine_config: { id: number; is_alert_status: boolean; is_alert_disk: boolean; threshold_disk: number; }; virtual_machine_status: { status: string; };
// }

// const formatBytes = (bytes: number, decimals = 2) => { if (!+bytes) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`; }

// export const columns: ColumnDef<VirtualMachineDetail>[] = [
//   { id: "status", header: "Status", cell: ({ row }) => { const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown'; let colorClass = "bg-gray-500"; if (status === 'running') colorClass = "bg-green-500"; if (status === 'stopped') colorClass = "bg-red-500"; return <div className="flex items-center gap-x-2"><span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span><span className="capitalize">{status}</span></div>; }},
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
//   { accessorKey: "bare_metal_node_id", header: "Node ID" },
//   { accessorKey: "vmid", header: "VM ID" },
//   { accessorKey: "code", header: "Code" },
//   { accessorKey: "name", header: "Name" },
//   { accessorKey: "cpu", header: "CPU" },
//   { accessorKey: "memory", header: "Memory", cell: ({ row }) => formatBytes(row.original.memory) },
//   { accessorKey: "disk", header: "Disk", cell: ({ row }) => formatBytes(row.original.disk) },
//   { header: "Status Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_status ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> },
//   { header: "Disk Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_disk ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> },
//   { header: "Disk Threshold", cell: ({ row }) => `${row.original.virtual_machine_config.threshold_disk}%` },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             {/* -- 2. Ganti menu item dengan komponen dialog -- */}
//             <HistoryDialog vm={vm} />
//             <DropdownMenuItem asChild>
//               <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link" // <-- Impor Link

// export type VirtualMachineDetail = {
//   // ... (definisi tipe tetap sama)
//   id: number; bare_metal_id: number; bare_metal_node_id: number; vmid: string; code: string; name: string; cpu: number; memory: number; disk: number; virtual_machine_config: { id: number; is_alert_status: boolean; is_alert_disk: boolean; threshold_disk: number; }; virtual_machine_status: { status: string; };
// }

// // ... (fungsi formatBytes tetap sama)
// const formatBytes = (bytes: number, decimals = 2) => { if (!+bytes) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`; }


// export const columns: ColumnDef<VirtualMachineDetail>[] = [
//   // ... (semua kolom dari status sampai threshold tetap sama) ...
//   { id: "status", header: "Status", cell: ({ row }) => { const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown'; let colorClass = "bg-gray-500"; if (status === 'running') colorClass = "bg-green-500"; if (status === 'stopped') colorClass = "bg-red-500"; return <div className="flex items-center gap-x-2"><span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span><span className="capitalize">{status}</span></div>; }},
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" }, { accessorKey: "bare_metal_node_id", header: "Node ID" }, { accessorKey: "vmid", header: "VM ID" }, { accessorKey: "code", header: "Code" }, { accessorKey: "name", header: "Name" }, { accessorKey: "cpu", header: "CPU" }, { accessorKey: "memory", header: "Memory", cell: ({ row }) => formatBytes(row.original.memory) }, { accessorKey: "disk", header: "Disk", cell: ({ row }) => formatBytes(row.original.disk) }, { header: "Status Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_status ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> }, { header: "Disk Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_disk ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> }, { header: "Disk Threshold", cell: ({ row }) => `${row.original.virtual_machine_config.threshold_disk}%` },

//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={() => alert("Membuka dialog history...")}>View History</DropdownMenuItem>
//             {/* -- UBAH MENJADI LINK -- */}
//             <DropdownMenuItem asChild>
//               <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"

// // Tipe data lengkap untuk detail VM
// export type VirtualMachineDetail = {
//   id: number
//   bare_metal_id: number
//   bare_metal_node_id: number
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_config: {
//     is_alert_status: boolean
//     is_alert_disk: boolean
//     threshold_disk: number
//   }
//   virtual_machine_status: {
//     status: string
//   }
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
// }

// export const columns: ColumnDef<VirtualMachineDetail>[] = [
//   { id: "status", header: "Status", cell: ({ row }) => {
//       const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown';
//       let colorClass = "bg-gray-500";
//       if (status === 'running') colorClass = "bg-green-500";
//       if (status === 'stopped') colorClass = "bg-red-500";
//       return <div className="flex items-center gap-x-2"><span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span><span className="capitalize">{status}</span></div>;
//   }},
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
//   { accessorKey: "bare_metal_node_id", header: "Node ID" },
//   { accessorKey: "vmid", header: "VM ID" },
//   { accessorKey: "code", header: "Code" },
//   { accessorKey: "name", header: "Name" },
//   { accessorKey: "cpu", header: "CPU" },
//   { accessorKey: "memory", header: "Memory", cell: ({ row }) => formatBytes(row.original.memory) },
//   { accessorKey: "disk", header: "Disk", cell: ({ row }) => formatBytes(row.original.disk) },
//   { header: "Status Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_status ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> },
//   { header: "Disk Alert", cell: ({ row }) => row.original.virtual_machine_config.is_alert_disk ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> },
//   { header: "Disk Threshold", cell: ({ row }) => `${row.original.virtual_machine_config.threshold_disk}%` },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={() => alert("Membuka dialog history...")}>View History</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => alert("Membuka dialog edit...")}>Edit</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]