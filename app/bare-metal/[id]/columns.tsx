"use client"

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
import { HistoryDialog } from "./history-dialog"; 

type BareMetalNodeStatus = {
  id: number
  status: string
}

export type BareMetalNode = {
  id: number
  bare_metal_id: number
  node: string
  cpu: number
  memory: number
  disk: number
  BareMetalNodeStatus: BareMetalNodeStatus[]
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const columns: ColumnDef<BareMetalNode>[] = [
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusInfo = row.original.BareMetalNodeStatus?.[0];
      const status = statusInfo?.status?.toLowerCase() || 'unknown';
      switch (status) {
        case 'online': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
        case 'offline': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
        default: return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status}</span></div>;
      }
    },
  },
  { accessorKey: "bare_metal_id", header: () => <div className="text-center">Bare Metal ID</div>, cell: ({ row }) => <div className="text-center">{row.getValue("bare_metal_id")}</div> },
  { accessorKey: "node", header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Node Name<ArrowUpDown className="ml-2 h-4 w-4" /></Button> },
  { accessorKey: "cpu", header: ({ column }) => <div className="text-center"><Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>CPU Cores<ArrowUpDown className="ml-2 h-4 w-4" /></Button></div>, cell: ({ row }) => <div className="text-center">{row.getValue("cpu")}</div> },
  { accessorKey: "memory", header: () => <div className="text-right">Memory</div>, cell: ({ row }) => <div className="text-right font-medium">{formatBytes(row.getValue("memory"))}</div> },
  { accessorKey: "disk", header: () => <div className="text-right">Disk</div>, cell: ({ row }) => <div className="text-right font-medium">{formatBytes(row.getValue("disk"))}</div> },
  
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const node = row.original
      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
              <HistoryDialog node={node} />
              {/* Baris di bawah ini telah dihapus
              <DropdownMenuItem onClick={() => alert(`Editing node ${node.id}`)}>
                Edit
              </DropdownMenuItem> 
              */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
// import { HistoryDialog } from "./history-dialog"; // <-- IMPOR KOMPONEN DIALOG BARU

// // Tipe data tidak perlu diubah dari sebelumnya
// type BareMetalNodeStatus = {
//   id: number
//   status: string
// }

// export type BareMetalNode = {
//   id: number
//   bare_metal_id: number
//   node: string
//   cpu: number
//   memory: number
//   disk: number
//   BareMetalNodeStatus: BareMetalNodeStatus[]
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const columns: ColumnDef<BareMetalNode>[] = [
//   // ... (semua kolom lain dari 'Status' sampai 'Disk' tetap sama) ...
//   {
//     id: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const statusInfo = row.original.BareMetalNodeStatus?.[0];
//       const status = statusInfo?.status?.toLowerCase() || 'unknown';
//       switch (status) {
//         case 'online': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//         case 'offline': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//         default: return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status}</span></div>;
//       }
//     },
//   },
//   { accessorKey: "bare_metal_id", header: () => <div className="text-center">Bare Metal ID</div>, cell: ({ row }) => <div className="text-center">{row.getValue("bare_metal_id")}</div> },
//   { accessorKey: "node", header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Node Name<ArrowUpDown className="ml-2 h-4 w-4" /></Button> },
//   { accessorKey: "cpu", header: ({ column }) => <div className="text-center"><Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>CPU Cores<ArrowUpDown className="ml-2 h-4 w-4" /></Button></div>, cell: ({ row }) => <div className="text-center">{row.getValue("cpu")}</div> },
//   { accessorKey: "memory", header: () => <div className="text-right">Memory</div>, cell: ({ row }) => <div className="text-right font-medium">{formatBytes(row.getValue("memory"))}</div> },
//   { accessorKey: "disk", header: () => <div className="text-right">Disk</div>, cell: ({ row }) => <div className="text-right font-medium">{formatBytes(row.getValue("disk"))}</div> },
  
//   // -- KOLOM ACTIONS DIPERBARUI --
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const node = row.original
//       return (
//         <div className="text-center">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
//               {/* -- GANTI MENU ITEM DENGAN KOMPONEN DIALOG -- */}
//               <HistoryDialog node={node} />
//               <DropdownMenuItem onClick={() => alert(`Editing node ${node.id}`)}>
//                 Edit
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]

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

// type BareMetalNodeStatus = {
//   id: number
//   status: string
// }

// export type BareMetalNode = {
//   id: number
//   bare_metal_id: number
//   node: string
//   cpu: number
//   memory: number
//   disk: number
//   BareMetalNodeStatus: BareMetalNodeStatus[]
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const columns: ColumnDef<BareMetalNode>[] = [
//   {
//     id: "status",
//     header: "Status",
//     // -- LOGIKA STATUS DIPERBARUI DI SINI --
//     cell: ({ row }) => {
//       const statusInfo = row.original.BareMetalNodeStatus?.[0];
//       const status = statusInfo?.status?.toLowerCase() || 'unknown';

//       switch (status) {
//         case 'online':
//           return (
//             <div className="flex items-center gap-x-2">
//               <span className="relative flex size-3">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//                 <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//               </span>
//               <span className="capitalize">{status}</span>
//             </div>
//           );
//         case 'offline':
//           return (
//             <div className="flex items-center gap-x-2">
//               <span className="relative flex size-3">
//                 <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
//               </span>
//               <span className="capitalize">{status}</span>
//             </div>
//           );
//         default: // Menangani 'unknown' atau status null
//           return (
//             <div className="flex items-center gap-x-2">
//               <span className="relative flex size-3">
//                 <span className="relative inline-flex size-3 rounded-full bg-gray-500"></span>
//               </span>
//               <span className="capitalize">{status}</span>
//             </div>
//           );
//       }
//     },
//   },
//   {
//     accessorKey: "bare_metal_id",
//     header: () => <div className="text-center">Bare Metal ID</div>,
//     cell: ({ row }) => <div className="text-center">{row.getValue("bare_metal_id")}</div>,
//   },
//   {
//     accessorKey: "node",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Node Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//   },
//   {
//     accessorKey: "cpu",
//     header: ({ column }) => {
//       return (
//         <div className="text-center">
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             CPU Cores
//             <ArrowUpDown className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       )
//     },
//     cell: ({ row }) => <div className="text-center">{row.getValue("cpu")}</div>,
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
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const node = row.original
//       return (
//         <div className="text-center">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
//               <DropdownMenuItem onClick={() => alert(`Viewing history for node ${node.id}`)}>
//                 View History
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => alert(`Editing node ${node.id}`)}>
//                 Edit
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]

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

// // -- TIPE DATA DIPERBARUI SESUAI RESPON API --
// type BareMetalNodeStatus = {
//   id: number
//   status: string
// }

// export type BareMetalNode = {
//   id: number
//   bare_metal_id: number // Field baru
//   node: string
//   cpu: number
//   memory: number
//   disk: number
//   BareMetalNodeStatus: BareMetalNodeStatus[] // Field baru
// }

// // Fungsi helper untuk format ukuran data
// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }


// // -- DEFINISI KOLOM DISESUAIKAN DAN DIURUTKAN ULANG --
// export const columns: ColumnDef<BareMetalNode>[] = [
//   // 1. KOLOM BARU: Status
//   {
//     id: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       // Mengambil status dari array, diasumsikan status relevan ada di indeks pertama
//       const statusInfo = row.original.BareMetalNodeStatus?.[0];
//       const status = statusInfo?.status.toLowerCase();

//       if (status === 'online') {
//         return (
//           <div className="flex items-center gap-x-2">
//             <span className="relative flex size-3">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//             </span>
//             <span className="capitalize">{status}</span>
//           </div>
//         )
//       }
      
//       // Tampilan untuk status selain online atau jika tidak ada status
//       return (
//          <div className="flex items-center gap-x-2">
//             <span className="relative flex size-3">
//               <span className="relative inline-flex size-3 rounded-full bg-gray-500"></span>
//             </span>
//             <span className="capitalize">{status || 'Unknown'}</span>
//           </div>
//       )
//     },
//   },
//   // 2. KOLOM BARU: Bare Metal ID
//   {
//     accessorKey: "bare_metal_id",
//     header: () => <div className="text-center">Bare Metal ID</div>,
//     cell: ({ row }) => <div className="text-center">{row.getValue("bare_metal_id")}</div>,
//   },
//   // 3. Kolom Node
//   {
//     accessorKey: "node",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Node Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//   },
//   // 4. Kolom CPU
//   {
//     accessorKey: "cpu",
//     header: ({ column }) => {
//       return (
//         <div className="text-center">
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             CPU Cores
//             <ArrowUpDown className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       )
//     },
//     cell: ({ row }) => <div className="text-center">{row.getValue("cpu")}</div>,
//   },
//   // 5. Kolom Memory
//   {
//     accessorKey: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     cell: ({ row }) => {
//       const formattedMemory = formatBytes(row.getValue("memory"))
//       return <div className="text-right font-medium">{formattedMemory}</div>
//     },
//   },
//   // 6. Kolom Disk
//   {
//     accessorKey: "disk",
//     header: () => <div className="text-right">Disk</div>,
//     cell: ({ row }) => {
//       const formattedDisk = formatBytes(row.getValue("disk"))
//       return <div className="text-right font-medium">{formattedDisk}</div>
//     },
//   },
//   // 7. Kolom Actions
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const node = row.original
//       return (
//         <div className="text-center">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
//               <DropdownMenuItem onClick={() => alert(`Viewing history for node ${node.id}`)}>
//                 View History
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => alert(`Editing node ${node.id}`)}>
//                 Edit
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]

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

// export type BareMetalNode = {
//   id: number
//   node: string
//   cpu: number
//   memory: number
//   disk: number
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const columns: ColumnDef<BareMetalNode>[] = [
//   {
//     accessorKey: "node",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Node Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//   },
//   {
//     accessorKey: "cpu",
//     header: ({ column }) => {
//       return (
//         <div className="text-center">
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             CPU Cores
//             <ArrowUpDown className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       )
//     },
//     cell: ({ row }) => <div className="text-center">{row.getValue("cpu")}</div>,
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
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const node = row.original
//       return (
//         <div className="text-center">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
//               <DropdownMenuItem onClick={() => alert(`Viewing history for node ${node.id}`)}>
//                 View History
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => alert(`Editing node ${node.id}`)}>
//                 Edit
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]


// // Lokasi: app/bare-metal/[id]/columns.tsx

// "use client"

// import { ColumnDef } from "@tanstack/react-table"

// // Tipe data untuk Bare Metal Node
// export type BareMetalNode = {
//   id: number
//   node: string
//   cpu: number
//   memory: number // dalam bytes
//   disk: number   // dalam bytes
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

// export const columns: ColumnDef<BareMetalNode>[] = [
//   {
//     accessorKey: "node",
//     header: "Node Name",
//   },
//   {
//     accessorKey: "cpu",
//     header: () => <div className="text-center">CPU Cores</div>,
//     cell: ({ row }) => <div className="text-center">{row.getValue("cpu")}</div>,
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
// ]