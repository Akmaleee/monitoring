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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditBareMetalDialog } from "./edit-bare-metal-dialog"
// 1. Impor komponen baru dari lokasi yang benar
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"

export type BareMetal = {
  id: number
  type: string
  name: string
  url: string
  api_token: string
}

export const getColumns = (
  onUpdate: () => void,
  isAdmin: boolean
): ColumnDef<BareMetal>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "url",
    header: () => <div className="text-left">URL</div>,
    cell: ({ row }) => {
        const url = row.getValue("url") as string;
        return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const bareMetal = row.original;
      return (
        <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                      <Link href={`/bare-metal/${bareMetal.id}`}>View Details</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bareMetal.url)}>
                          Copy URL 
                      </DropdownMenuItem>
                      <EditBareMetalDialog bareMetal={bareMetal} onBareMetalUpdated={onUpdate} />
                      <DropdownMenuSeparator />
                      {/* 2. Gunakan komponen baru di sini dengan props yang sesuai */}
                      <ConfirmDeleteDialog
                        itemId={bareMetal.id}
                        itemName={bareMetal.name}
                        itemType="Bare Metal"
                        deleteEndpoint={`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/bare-metal`}
                        onActionSuccess={onUpdate}
                      />
                    </>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
]

// "use client"

// import Link from "next/link"
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
// import { EditBareMetalDialog } from "./edit-bare-metal-dialog"

// export type BareMetal = {
//   id: number
//   type: string
//   name: string
//   url: string
//   api_token: string
// }

// export const getColumns = (
//   onUpdate: () => void,
//   isAdmin: boolean
// ): ColumnDef<BareMetal>[] => [
//   // -- Kolom "No." ditambahkan di sini --
//   {
//     id: "no",
//     header: "No",
//     // 'row' berisi informasi baris, termasuk indeksnya
//     cell: ({ row }) => {
//       // Tambahkan 1 karena indeks dimulai dari 0
//       return <span>{row.index + 1}</span>
//     },
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Name
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     accessorKey: "url",
//     header: () => <div className="text-left">URL</div>,
//     cell: ({ row }) => {
//         const url = row.getValue("url") as string;
//         return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
//     },
//   },
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const bareMetal = row.original;
//       return (
//         <div className="text-center">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                   <DropdownMenuItem asChild>
//                       <Link href={`/bare-metal/${bareMetal.id}`}>View Details</Link>
//                   </DropdownMenuItem>
//                   {isAdmin && (
//                     <>
//                       <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bareMetal.url)}>
//                           Copy URL 
//                       </DropdownMenuItem>
//                       <EditBareMetalDialog bareMetal={bareMetal} onBareMetalUpdated={onUpdate} />
//                     </>
//                   )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//       );
//     },
//   },
// ]

// "use client"

// import Link from "next/link"
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
// import { EditBareMetalDialog } from "./edit-bare-metal-dialog"

// export type BareMetal = {
//   id: number
//   type: string
//   name: string
//   url: string
//   api_token: string
// }

// export const getColumns = (
//   onUpdate: () => void,
//   isAdmin: boolean
// ): ColumnDef<BareMetal>[] => [
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Name
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     accessorKey: "url",
//     header: () => <div className="text-left">URL</div>,
//     cell: ({ row }) => {
//         const url = row.getValue("url") as string;
//         return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
//     },
//   },
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const bareMetal = row.original;
//       return (
//         <div className="text-center">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                   <DropdownMenuItem asChild>
//                       <Link href={`/bare-metal/${bareMetal.id}`}>View Details</Link>
//                   </DropdownMenuItem>
//                   {isAdmin && (
//                     <>
//                       <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bareMetal.url)}>
//                           Copy URL 
//                       </DropdownMenuItem>
//                       <EditBareMetalDialog bareMetal={bareMetal} onBareMetalUpdated={onUpdate} />
//                     </>
//                   )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//       );
//     },
//   },
// ]

// "use client"

// import Link from "next/link"
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
// import { EditBareMetalDialog } from "./edit-bare-metal-dialog"

// export type BareMetal = {
//   id: number
//   type: string
//   name: string
//   url: string
//   api_token: string
// }

// export const getColumns = (
//   onUpdate: () => void
// ): ColumnDef<BareMetal>[] => [
//   // Kolom ID dan Ping dihilangkan
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
//     cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     accessorKey: "url",
//     header: () => <div className="text-left">URL</div>,
//     cell: ({ row }) => {
//         const url = row.getValue("url") as string;
//         return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
//     },
//   },
//   // Kolom API Token dihilangkan
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const bareMetal = row.original
//       return (
//         <div className="text-center">
//             <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bareMetal.url)}>
//                     Copy URL 
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                     <Link href={`/bare-metal/${bareMetal.id}`}>View Details</Link>
//                 </DropdownMenuItem>
//                 <EditBareMetalDialog bareMetal={bareMetal} onBareMetalUpdated={onUpdate} />
//             </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]

// "use client"

// import Link from "next/link"
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
// import { EditBareMetalDialog } from "./edit-bare-metal-dialog" // <-- Impor komponen dialog baru

// export type BareMetal = {
//   id: number
//   type: string
//   name: string
//   url: string
//   api_token: string
// }

// // -- UBAH DARI "export const columns" MENJADI FUNGSI --
// export const getColumns = (
//   onUpdate: () => void
// ): ColumnDef<BareMetal>[] => [
//   {
//     accessorKey: "id",
//     header: "ID",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-x-2">
//         <span className="relative flex size-3">
//           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//           <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//         </span>
//         {row.getValue("id")}
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
//     cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
//   },
//   { accessorKey: "type", header: "Type" },
//   {
//     accessorKey: "url",
//     header: () => <div className="text-left">URL</div>,
//     cell: ({ row }) => {
//         const url = row.getValue("url") as string;
//         return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
//     },
//   },
//   { accessorKey: "api_token", header: "API Token" },
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const bareMetal = row.original
//       return (
//         <div className="text-center">
//             <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bareMetal.url)}>
//                     Copy URL 
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                     <Link href={`/bare-metal/${bareMetal.id}`}>View Details</Link>
//                 </DropdownMenuItem>
//                 {/* -- TAMBAHKAN OPSI EDIT DI SINI -- */}
//                 <EditBareMetalDialog bareMetal={bareMetal} onBareMetalUpdated={onUpdate} />
//             </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]

// // Lokasi: app/bare-metal/columns.tsx

// "use client"

// import Link from "next/link"
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

// export type BareMetal = {
//   id: number
//   type: string
//   name: string
//   url: string
//   api_token: string
// }

// // KODE LENGKAP DENGAN SEMUA KOLOM
// export const columns: ColumnDef<BareMetal>[] = [
//   {
//     accessorKey: "id",
//     header: "ID",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-x-2">
//         <span className="relative flex size-3">
//           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//           <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//         </span>
//         {row.getValue("id")}
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
//     cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     accessorKey: "url",
//     header: () => <div className="text-left">URL</div>,
//     cell: ({ row }) => {
//        const url = row.getValue("url") as string;
//        return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
//     },
//   },
//   {
//     accessorKey: "api_token",
//     header: "API Token",
//   },
//   {
//     id: "actions",
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const bareMetal = row.original
//       return (
//         <div className="text-center">
//             <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem
//                 onClick={() => navigator.clipboard.writeText(bareMetal.url)}
//                 >
//                 Copy URL 
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href={`/bare-metal/${bareMetal.id}`}>View Details</Link>
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]

// Lokasi: app/bare-metal/columns.tsx

// Lokasi: app/bare-metal/columns.tsx

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

// export type BareMetal = {
//   id: number
//   type: string
//   name: string
//   url: string
//   api_token: string
// }

// export const columns: ColumnDef<BareMetal>[] = [
//   {
//     accessorKey: "id",
//     header: "ID",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-x-2">
//         <span className="relative flex size-3">
//           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//           <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//         </span>
//         {row.getValue("id")}
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
//     cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     accessorKey: "url",
//     header: () => <div className="text-left">URL</div>,
//     cell: ({ row }) => {
//        const url = row.getValue("url") as string;
//        return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
//     },
//   },
//   {
//     accessorKey: "api_token",
//     header: "API Token",
//   },
//   {
//     id: "actions",
//     // PERUBAHAN 1: Menambahkan header "Actions"
//     header: () => <div className="text-center">Actions</div>,
//     cell: ({ row }) => {
//       const bareMetal = row.original
//       return (
//         <div className="text-center">
//             <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 {/* PERUBAHAN 2: Mengubah "Copy Name" menjadi "Copy URL" dan fungsinya */}
//                 <DropdownMenuItem
//                 onClick={() => navigator.clipboard.writeText(bareMetal.url)}
//                 >
//                 Copy URL 
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>View Details</DropdownMenuItem>
//             </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//       )
//     },
//   },
// ]

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { ArrowUpDown } from "lucide-react"
// import { MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export type BareMetalNode = {
//   bare_metal_id: number
//   node: string
//   cpu: number
//   memory: string
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// }

// export const columns: ColumnDef<BareMetalNode>[] = [
//   {
//     accessorKey: "bare_metal_id",
//     header: "ID",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-x-2">
//         <span className="relative flex size-3">
//           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//           <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//         </span>
//         {row.getValue("bare_metal_id")}
//       </div>
//     ),
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
//     header: () => <div className="text-center">CPU Cores</div>,
//     cell: ({ row }) => {
//       return <div className="text-center font-medium">{row.getValue("cpu")}</div>
//     },
//   },
//   {
//     accessorKey: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     cell: ({ row }) => {
//       const memoryInBytes = parseInt(row.getValue("memory"))
//       const formattedMemory = formatBytes(memoryInBytes)
//       return <div className="text-right font-medium">{formattedMemory}</div>
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const node = row.original
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
//               onClick={() => navigator.clipboard.writeText(String(node.bare_metal_id))}
//             >
//               Copy Node ID
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]


// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { ArrowUpDown } from "lucide-react"
// import { MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export type BareMetalNode = {
//   bare_metal_id: number
//   node: string
//   cpu: number
//   memory: string
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// }

// export const columns: ColumnDef<BareMetalNode>[] = [
//   {
//     accessorKey: "bare_metal_id",
//     header: "ID",
//   },
//   {
//     accessorKey: "node",
//     // header: "Node Name",
//         header: ({ column }) => {
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
//     header: () => <div className="text-center">CPU Cores</div>,
//     cell: ({ row }) => {
//       return <div className="text-center font-medium">{row.getValue("cpu")}</div>
//     },
//   },
//   {
//     accessorKey: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     cell: ({ row }) => {
//       const memoryInBytes = parseInt(row.getValue("memory"))
//       const formattedMemory = formatBytes(memoryInBytes)
//       return <div className="text-right font-medium">{formattedMemory}</div>
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const node = row.original
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
//               onClick={() => navigator.clipboard.writeText(String(node.bare_metal_id))}
//             >
//               Copy Node ID
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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

// export const columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "wayaw",
//     header: "Wayaw",
//   },
//   {
//     accessorKey: "amount",
//         header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)
 
//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const payment = row.original
 
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
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ];