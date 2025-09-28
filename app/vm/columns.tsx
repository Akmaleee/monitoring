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
import { HistoryDialog } from "./history-dialog"
import { toast } from "sonner"
// 1. Impor komponen dialog yang sudah kita buat
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"

type VirtualMachineStatus = {
  status: string
}

type BareMetalInfo = {
  id: number;
  name: string;
  url: string;
}

type BareMetalNodeInfo = {
  id: number;
  node: string;
}

export type VirtualMachine = {
  id: number
  bare_metal_id: number
  bare_metal: BareMetalInfo;
  bare_metal_node_id: number
  bare_metal_node: BareMetalNodeInfo;
  vmid: string
  code: string
  name: string
  cpu: number
  memory: number
  disk: number
  virtual_machine_status: VirtualMachineStatus
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const getColumns = (
  refreshData: () => void,
  isAdmin: boolean
): ColumnDef<VirtualMachine>[] => {

  const handleAction = async (vmName: string, action: 'Start' | 'Stop' | 'Restart') => {
    const toastId = toast.loading(`Sending ${action} command to "${vmName}"...`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Command "${action}" sent successfully!`, {
      id: toastId,
      description: "Refreshing data...",
    });

    refreshData();
  };

  return [
    {
      id: 'status',
      header: "Status",
      accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown',
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
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
    {
      accessorKey: "bare_metal.name",
      header: "Bare Metal Name",
    },
    {
      accessorKey: "bare_metal_node.node",
      header: "Node Name",
    },
    { accessorKey: "vmid", header: "VM ID" },
    { accessorKey: "code", header: "Code" },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    { accessorKey: "cpu", header: "CPU" },
    {
      id: "memory",
      header: () => <div className="text-right">Memory</div>,
      accessorFn: row => formatBytes(row.memory),
      cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
    },
    {
      id: "disk",
      header: () => <div className="text-right">Disk</div>,
      accessorFn: row => formatBytes(row.disk),
      cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const vm = row.original;
        const status = vm.virtual_machine_status?.status?.toLowerCase();

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
              <HistoryDialog vm={vm} />

              {isAdmin && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  {vm.bare_metal?.url && (
                    <DropdownMenuItem asChild>
                        <a href={vm.bare_metal.url} target="_blank" rel="noopener noreferrer">
                        Go to VM Manager
                        </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {status === 'running' && (
                    <>
                      <DropdownMenuItem onClick={() => handleAction(vm.name, 'Stop')}>Stop</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction(vm.name, 'Restart')}>Restart</DropdownMenuItem>
                    </>
                  )}
                  {status === 'stopped' && (
                    <DropdownMenuItem onClick={() => handleAction(vm.name, 'Start')}>Start</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {/* 2. Gunakan komponen di sini */}
                  <ConfirmDeleteDialog
                    itemId={vm.id}
                    itemName={vm.name}
                    itemType="Virtual Machine"
                    deleteEndpoint="http://127.0.0.1:3000/virtual-machine"
                    onActionSuccess={refreshData}
                  />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HistoryDialog } from "./history-dialog"
// import { toast } from "sonner"

// type VirtualMachineStatus = {
//   status: string
// }

// type BareMetalInfo = {
//   id: number;
//   name: string;
//   url: string;
// }

// type BareMetalNodeInfo = {
//   id: number;
//   node: string;
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal: BareMetalInfo;
//   bare_metal_node_id: number
//   bare_metal_node: BareMetalNodeInfo;
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const getColumns = (
//   refreshData: () => void,
//   isAdmin: boolean
// ): ColumnDef<VirtualMachine>[] => {

//   const handleAction = async (vmName: string, action: 'Start' | 'Stop' | 'Restart') => {
//     const toastId = toast.loading(`Sending ${action} command to "${vmName}"...`);
    
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     toast.success(`Command "${action}" sent successfully!`, {
//       id: toastId,
//       description: "Refreshing data...",
//     });

//     refreshData();
//   };

//   return [
//     {
//       id: 'status',
//       header: "Status",
//       accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown',
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;
//         switch (status) {
//           case 'running':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//           case 'stopped':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//           default:
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//         }
//       },
//     },
//     {
//       accessorKey: "bare_metal.name",
//       header: "Bare Metal Name",
//     },
//     {
//       accessorKey: "bare_metal_node.node",
//       header: "Node Name",
//     },
//     { accessorKey: "vmid", header: "VM ID" },
//     { accessorKey: "code", header: "Code" },
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Name <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     { accessorKey: "cpu", header: "CPU" },
//     {
//       id: "memory",
//       header: () => <div className="text-right">Memory</div>,
//       accessorFn: row => formatBytes(row.memory),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "disk",
//       header: () => <div className="text-right">Disk</div>,
//       accessorFn: row => formatBytes(row.disk),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const vm = row.original;
//         const status = vm.virtual_machine_status?.status?.toLowerCase();

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               {/* Selalu tampilkan View Details & View History */}
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}`}>View Details</Link>
//               </DropdownMenuItem>
//               <HistoryDialog vm={vm} />

//               {/* Tampilkan sisa menu hanya jika admin */}
//               {isAdmin && (
//                 <>
//                   <DropdownMenuItem asChild>
//                     <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//                   </DropdownMenuItem>
//                   {vm.bare_metal?.url && (
//                     <DropdownMenuItem asChild>
//                         <a href={vm.bare_metal.url} target="_blank" rel="noopener noreferrer">
//                         Go to VM Manager
//                         </a>
//                     </DropdownMenuItem>
//                   )}
//                   <DropdownMenuSeparator />
//                   {status === 'running' && (
//                     <>
//                       <DropdownMenuItem onClick={() => handleAction(vm.name, 'Stop')}>Stop</DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => handleAction(vm.name, 'Restart')}>Restart</DropdownMenuItem>
//                     </>
//                   )}
//                   {status === 'stopped' && (
//                     <DropdownMenuItem onClick={() => handleAction(vm.name, 'Start')}>Start</DropdownMenuItem>
//                   )}
//                 </>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//       },
//     },
//   ]
// }


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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HistoryDialog } from "./history-dialog"
// import { toast } from "sonner"

// type VirtualMachineStatus = {
//   status: string
// }

// type BareMetalInfo = {
//   id: number;
//   name: string;
//   url: string; 
// }

// type BareMetalNodeInfo = {
//   id: number;
//   node: string;
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal: BareMetalInfo;
//   bare_metal_node_id: number
//   bare_metal_node: BareMetalNodeInfo;
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const getColumns = (
//   refreshData: () => void
// ): ColumnDef<VirtualMachine>[] => {

//   const handleAction = async (vmName: string, action: 'Start' | 'Stop' | 'Restart') => {
//     const toastId = toast.loading(`Sending ${action} command to "${vmName}"...`);
    
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     toast.success(`Command "${action}" sent successfully!`, {
//       id: toastId,
//       description: "Refreshing data...",
//     });

//     refreshData();
//   };

//   return [
//     {
//       id: 'status',
//       header: "Status",
//       accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown',
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;
//         switch (status) {
//           case 'running':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//           case 'stopped':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//           default:
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//         }
//       },
//     },
//     {
//       accessorKey: "bare_metal.name",
//       header: "Bare Metal Name",
//     },
//     {
//       accessorKey: "bare_metal_node.node",
//       header: "Node Name",
//     },
//     { accessorKey: "vmid", header: "VM ID" },
//     { accessorKey: "code", header: "Code" },
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Name <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     { accessorKey: "cpu", header: "CPU" },
//     {
//       id: "memory",
//       header: () => <div className="text-right">Memory</div>,
//       accessorFn: row => formatBytes(row.memory),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "disk",
//       header: () => <div className="text-right">Disk</div>,
//       accessorFn: row => formatBytes(row.disk),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const vm = row.original;
//         const status = vm.virtual_machine_status?.status?.toLowerCase();

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}`}>View Details</Link>
//               </DropdownMenuItem>
//               <HistoryDialog vm={vm} />
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//               </DropdownMenuItem>
              
//               {/* -- PERUBAHAN DI SINI: Tampilkan hanya jika URL ada -- */}
//               {vm.bare_metal?.url && (
//                 <DropdownMenuItem asChild>
//                     <a href={vm.bare_metal.url} target="_blank" rel="noopener noreferrer">
//                     Go to VM Manager
//                     </a>
//                 </DropdownMenuItem>
//               )}

//               <DropdownMenuSeparator />
//               {status === 'running' && (
//                 <>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Stop')}>Stop</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Restart')}>Restart</DropdownMenuItem>
//                 </>
//               )}
//               {status === 'stopped' && (
//                 <DropdownMenuItem onClick={() => handleAction(vm.name, 'Start')}>Start</DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//       },
//     },
//   ]
// }

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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HistoryDialog } from "./history-dialog"
// import { toast } from "sonner"

// // Tipe data sesuai dengan respons API terbaru
// type VirtualMachineStatus = {
//   status: string
// }

// type BareMetalInfo = {
//   id: number;
//   name: string;
//   url: string; // <-- 1. Pastikan URL ada di sini
// }

// type BareMetalNodeInfo = {
//   id: number;
//   node: string;
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal: BareMetalInfo;
//   bare_metal_node_id: number
//   bare_metal_node: BareMetalNodeInfo;
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const getColumns = (
//   refreshData: () => void
// ): ColumnDef<VirtualMachine>[] => {

//   const handleAction = async (vmName: string, action: 'Start' | 'Stop' | 'Restart') => {
//     const toastId = toast.loading(`Sending ${action} command to "${vmName}"...`);
    
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     toast.success(`Command "${action}" sent successfully!`, {
//       id: toastId,
//       description: "Refreshing data...",
//     });

//     refreshData();
//   };

//   return [
//     {
//       id: 'status',
//       header: "Status",
//       accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown',
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;
//         switch (status) {
//           case 'running':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//           case 'stopped':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//           default:
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//         }
//       },
//     },
//     {
//       accessorKey: "bare_metal.name",
//       header: "Bare Metal Name",
//     },
//     {
//       accessorKey: "bare_metal_node.node",
//       header: "Node Name",
//     },
//     { accessorKey: "vmid", header: "VM ID" },
//     { accessorKey: "code", header: "Code" },
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Name <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     { accessorKey: "cpu", header: "CPU" },
//     {
//       id: "memory",
//       header: () => <div className="text-right">Memory</div>,
//       accessorFn: row => formatBytes(row.memory),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "disk",
//       header: () => <div className="text-right">Disk</div>,
//       accessorFn: row => formatBytes(row.disk),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const vm = row.original;
//         const status = vm.virtual_machine_status?.status?.toLowerCase();

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}`}>View Details</Link>
//               </DropdownMenuItem>
//               <HistoryDialog vm={vm} />
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//               </DropdownMenuItem>

//               {/* -- 2. Tambahkan tautan ke VM Manager di sini -- */}
//               {vm.bare_metal?.url && (
//                 <DropdownMenuItem asChild>
//                   <a href={vm.bare_metal.url} target="_blank" rel="noopener noreferrer">
//                     Go to VM Manager
//                   </a>
//                 </DropdownMenuItem>
//               )}

//               <DropdownMenuSeparator />
//               {status === 'running' && (
//                 <>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Stop')}>Stop</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Restart')}>Restart</DropdownMenuItem>
//                 </>
//               )}
//               {status === 'stopped' && (
//                 <DropdownMenuItem onClick={() => handleAction(vm.name, 'Start')}>Start</DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//       },
//     },
//   ]
// }

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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HistoryDialog } from "./history-dialog"
// import { toast } from "sonner"

// // Perbarui tipe data agar sesuai dengan respons API
// type VirtualMachineStatus = { status: string }

// type BareMetalInfo = {
//   id: number;
//   name: string;
//   url: string; // URL yang kita butuhkan
// }

// type BareMetalNodeInfo = {
//   id: number;
//   node: string;
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal: BareMetalInfo;
//   bare_metal_node_id: number
//   bare_metal_node: BareMetalNodeInfo;
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => { if (!+bytes) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}` }

// export const getColumns = (
//   refreshData: () => void
// ): ColumnDef<VirtualMachine>[] => {

//   const handleAction = async (vmName: string, action: 'Start' | 'Stop' | 'Restart') => {
//     const toastId = toast.loading(`Sending ${action} command to "${vmName}"...`);
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     toast.success(`Command "${action}" sent successfully!`, { id: toastId, description: "Refreshing data...", });
//     refreshData();
//   };

//   return [
//     { id: 'status', header: "Status", accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown', cell: ({ row }) => { const status = row.getValue("status") as string; switch (status) { case 'running': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>; case 'stopped': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>; default: return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>; } }, },
//     { accessorKey: "bare_metal.name", header: "Bare Metal Name", },
//     { accessorKey: "bare_metal_node.node", header: "Node Name", },
//     { accessorKey: "vmid", header: "VM ID" },
//     { accessorKey: "code", header: "Code" },
//     { accessorKey: "name", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> Name <ArrowUpDown className="ml-2 h-4 w-4" /> </Button>), },
//     { accessorKey: "cpu", header: "CPU" },
//     { id: "memory", header: () => <div className="text-right">Memory</div>, accessorFn: row => formatBytes(row.memory), cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>, },
//     { id: "disk", header: () => <div className="text-right">Disk</div>, accessorFn: row => formatBytes(row.disk), cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>, },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const vm = row.original;
//         const status = vm.virtual_machine_status?.status?.toLowerCase();

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}`}>View Details</Link>
//               </DropdownMenuItem>
//               <HistoryDialog vm={vm} />
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//               </DropdownMenuItem>
              
//               {/* -- Tautan ke VM Manager ditambahkan di sini -- */}
//               {vm.bare_metal?.url && (
//                 <DropdownMenuItem asChild>
//                     <a href={vm.bare_metal.url} target="_blank" rel="noopener noreferrer">
//                     Go to VM Manager
//                     </a>
//                 </DropdownMenuItem>
//               )}

//               <DropdownMenuSeparator />
//               {status === 'running' && (
//                 <>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Stop')}>Stop</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Restart')}>Restart</DropdownMenuItem>
//                 </>
//               )}
//               {status === 'stopped' && (
//                 <DropdownMenuItem onClick={() => handleAction(vm.name, 'Start')}>Start</DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//       },
//     },
//   ]
// }

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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HistoryDialog } from "./history-dialog"
// import { toast } from "sonner"

// // Tipe data sesuai dengan respons API terbaru
// type VirtualMachineStatus = {
//   status: string
// }

// type BareMetalInfo = {
//   id: number;
//   name: string;
// }

// type BareMetalNodeInfo = {
//   id: number;
//   node: string;
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal: BareMetalInfo;
//   bare_metal_node_id: number
//   bare_metal_node: BareMetalNodeInfo;
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const getColumns = (
//   refreshData: () => void
// ): ColumnDef<VirtualMachine>[] => {

//   const handleAction = async (vmName: string, action: 'Start' | 'Stop' | 'Restart') => {
//     const toastId = toast.loading(`Sending ${action} command to "${vmName}"...`);
    
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     toast.success(`Command "${action}" sent successfully!`, {
//       id: toastId,
//       description: "Refreshing data...",
//     });

//     refreshData();
//   };

//   return [
//     {
//       id: 'status',
//       header: "Status",
//       accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown',
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;
//         switch (status) {
//           case 'running':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//           case 'stopped':
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//           default:
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//         }
//       },
//     },
//     // -- PERUBAHAN DARI ID KE NAMA --
//     {
//       accessorKey: "bare_metal.name",
//       header: "Bare Metal Name",
//     },
//     {
//       accessorKey: "bare_metal_node.node",
//       header: "Node Name",
//     },
//     { accessorKey: "vmid", header: "VM ID" },
//     { accessorKey: "code", header: "Code" },
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Name <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     { accessorKey: "cpu", header: "CPU" },
//     {
//       id: "memory",
//       header: () => <div className="text-right">Memory</div>,
//       accessorFn: row => formatBytes(row.memory),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "disk",
//       header: () => <div className="text-right">Disk</div>,
//       accessorFn: row => formatBytes(row.disk),
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const vm = row.original;
//         const status = vm.virtual_machine_status?.status?.toLowerCase();

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}`}>View Details</Link>
//               </DropdownMenuItem>
//               <HistoryDialog vm={vm} />
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               {status === 'running' && (
//                 <>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Stop')}>Stop</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Restart')}>Restart</DropdownMenuItem>
//                 </>
//               )}
//               {status === 'stopped' && (
//                 <DropdownMenuItem onClick={() => handleAction(vm.name, 'Start')}>Start</DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//       },
//     },
//   ]
// }

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
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HistoryDialog } from "./history-dialog"
// import { toast } from "sonner"

// type VirtualMachineStatus = { status: string }

// export type VirtualMachine = { 
//   id: number; 
//   bare_metal_id: number; 
//   bare_metal_node_id: number; 
//   vmid: string; 
//   code: string; 
//   name: string; 
//   cpu: number; 
//   memory: number; 
//   disk: number; 
//   bare_metal_url: string; 
//   virtual_machine_status: VirtualMachineStatus 
// }

// const formatBytes = (bytes: number, decimals = 2) => { 
//   if (!+bytes) return '0 Bytes'; 
//   const k = 1024; 
//   const dm = decimals < 0 ? 0 : decimals; 
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; 
//   const i = Math.floor(Math.log(bytes) / Math.log(k)); 
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}` 
// }

// export const getColumns = (
//   refreshData: () => void
// ): ColumnDef<VirtualMachine>[] => {

//   const handleAction = async (vmName: string, action: 'Start' | 'Stop' | 'Restart') => {
//     const toastId = toast.loading(`Sending ${action} command to "${vmName}"...`);
    
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     toast.success(`Command "${action}" sent successfully!`, {
//       id: toastId,
//       description: "Refreshing data...",
//     });

//     refreshData();
//   };

//   return [
//     { 
//       id: 'status', 
//       header: "Status", 
//       accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown', 
//       cell: ({ row }) => { 
//         const status = row.getValue("status") as string; 
//         switch (status) { 
//           case 'running': 
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>; 
//           case 'stopped': 
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>; 
//           default: 
//             return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>; 
//         } 
//       }, 
//     },
//     { accessorKey: "bare_metal_id", header: "Bare Metal ID" }, 
//     { accessorKey: "bare_metal_node_id", header: "Node ID" }, 
//     { accessorKey: "vmid", header: "VM ID" }, 
//     { accessorKey: "code", header: "Code" }, 
//     { 
//       accessorKey: "name", 
//       header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> Name <ArrowUpDown className="ml-2 h-4 w-4" /> </Button>), 
//     }, 
//     { accessorKey: "cpu", header: "CPU" }, 
//     { 
//       id: "memory", 
//       header: () => <div className="text-right">Memory</div>, 
//       accessorFn: row => formatBytes(row.memory), 
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>, 
//     }, 
//     { 
//       id: "disk", 
//       header: () => <div className="text-right">Disk</div>, 
//       accessorFn: row => formatBytes(row.disk), 
//       cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>, 
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const vm = row.original;
//         const status = vm.virtual_machine_status?.status?.toLowerCase();

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}`}>View Details</Link>
//               </DropdownMenuItem>
//               <HistoryDialog vm={vm} />
//               <DropdownMenuItem asChild>
//                 <Link href={`/vm/${vm.id}/edit`}>Edit</Link>
//               </DropdownMenuItem>
              
//               <DropdownMenuSeparator />

//               {status === 'running' && (
//                 <>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Stop')}>Stop</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => handleAction(vm.name, 'Restart')}>Restart</DropdownMenuItem>
//                 </>
//               )}

//               {status === 'stopped' && (
//                 <DropdownMenuItem onClick={() => handleAction(vm.name, 'Start')}>Start</DropdownMenuItem>
//               )}
              
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//       },
//     },
//   ]
// }

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
// import { HistoryDialog } from "./history-dialog"

// type VirtualMachineStatus = {
//   status: string
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal_node_id: number
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const columns: ColumnDef<VirtualMachine>[] = [
//   {
//     // -- PERBAIKAN DI SINI: Tambahkan id: 'status' --
//     id: 'status',
//     header: "Status",
//     accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown',
//     cell: ({ row }) => {
//       const status = row.getValue("status") as string;
//       switch (status) {
//         case 'running':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//         case 'stopped':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//         default:
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//       }
//     },
//   },
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
//   { accessorKey: "bare_metal_node_id", header: "Node ID" },
//   { accessorKey: "vmid", header: "VM ID" },
//   { accessorKey: "code", header: "Code" },
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Name <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
//   { accessorKey: "cpu", header: "CPU" },
//   {
//     id: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     accessorFn: row => formatBytes(row.memory),
//     cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//   },
//   {
//     id: "disk",
//     header: () => <div className="text-right">Disk</div>,
//     accessorFn: row => formatBytes(row.disk),
//     cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
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
//             <DropdownMenuItem asChild>
//               <Link href={`/vm/${vm.id}`}>View Details</Link>
//             </DropdownMenuItem>
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
// import { HistoryDialog } from "./history-dialog"

// type VirtualMachineStatus = {
//   status: string
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal_node_id: number
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const columns: ColumnDef<VirtualMachine>[] = [
//   {
//     header: "Status",
//     // Tambahkan accessorFn agar filter bisa membaca status (misal: "running")
//     accessorFn: row => row.virtual_machine_status?.status?.toLowerCase() || 'unknown',
//     cell: ({ row }) => {
//       const status = row.getValue("status") as string;
//       switch (status) {
//         case 'running':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//         case 'stopped':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//         default:
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//       }
//     },
//   },
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
//   { accessorKey: "bare_metal_node_id", header: "Node ID" },
//   { accessorKey: "vmid", header: "VM ID" },
//   { accessorKey: "code", header: "Code" },
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Name <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
//   { accessorKey: "cpu", header: "CPU" },
//   {
//     id: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     // Tambahkan accessorFn agar filter bisa membaca teks yang diformat (misal: "12 GB")
//     accessorFn: row => formatBytes(row.memory),
//     cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//   },
//   {
//     id: "disk",
//     header: () => <div className="text-right">Disk</div>,
//     // Tambahkan accessorFn agar filter bisa membaca teks yang diformat
//     accessorFn: row => formatBytes(row.disk),
//     cell: ({ getValue }) => <div className="text-right">{getValue<string>()}</div>,
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
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
//             <DropdownMenuItem asChild>
//               <Link href={`/vm/${vm.id}`}>View Details</Link>
//             </DropdownMenuItem>
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
// import { HistoryDialog } from "./history-dialog" // <-- Impor dialog

// type VirtualMachineStatus = {
//   status: string
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal_node_id: number
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const columns: ColumnDef<VirtualMachine>[] = [
//   // ... (definisi kolom lain tetap sama) ...
//   { id: "status", header: "Status", cell: ({ row }) => { const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown'; switch (status) { case 'running': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>; case 'stopped': return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>; default: return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>; } }, },
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" }, { accessorKey: "bare_metal_node_id", header: "Node ID" }, { accessorKey: "vmid", header: "VM ID" }, { accessorKey: "code", header: "Code" }, { accessorKey: "name", header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}> Name <ArrowUpDown className="ml-2 h-4 w-4" /> </Button>), }, { accessorKey: "cpu", header: "CPU" }, { accessorKey: "memory", header: () => <div className="text-right">Memory</div>, cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("memory"))}</div>, }, { accessorKey: "disk", header: () => <div className="text-right">Disk</div>, cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("disk"))}</div>, },

//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
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
//             <DropdownMenuItem asChild>
//               <Link href={`/vm/${vm.id}`}>View Details</Link>
//             </DropdownMenuItem>
//             {/* -- TAMBAHKAN HISTORY DI SINI -- */}
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

// type VirtualMachineStatus = {
//   status: string
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal_node_id: number
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// export const columns: ColumnDef<VirtualMachine>[] = [
//   {
//     id: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown';
//       switch (status) {
//         case 'running':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//         case 'stopped':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//         default:
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//       }
//     },
//   },
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
//   { accessorKey: "bare_metal_node_id", header: "Node ID" },
//   { accessorKey: "vmid", header: "VM ID" },
//   { accessorKey: "code", header: "Code" },
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Name <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
//   { accessorKey: "cpu", header: "CPU" },
//   {
//     accessorKey: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("memory"))}</div>,
//   },
//   {
//     accessorKey: "disk",
//     header: () => <div className="text-right">Disk</div>,
//     cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("disk"))}</div>,
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
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
//             <DropdownMenuItem asChild>
//               <Link href={`/vm/${vm.id}`}>View Details</Link>
//             </DropdownMenuItem>
//             {/* -- TAMBAHKAN OPSI EDIT DI SINI -- */}
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

// // Tipe data sesuai dengan respons API
// type VirtualMachineStatus = {
//   status: string
// }

// export type VirtualMachine = {
//   id: number
//   bare_metal_id: number
//   bare_metal_node_id: number
//   vmid: string
//   code: string
//   name: string
//   cpu: number
//   memory: number
//   disk: number
//   virtual_machine_status: VirtualMachineStatus
// }

// // Helper function untuk format ukuran byte
// const formatBytes = (bytes: number, decimals = 2) => {
//   if (!+bytes) return '0 Bytes'
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
// }

// // Definisi kolom tabel
// export const columns: ColumnDef<VirtualMachine>[] = [
//   // 1. Status
//   {
//     id: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.original.virtual_machine_status?.status?.toLowerCase() || 'unknown';
//       switch (status) {
//         case 'running':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex size-3 rounded-full bg-green-500"></span></span><span className="capitalize">{status}</span></div>;
//         case 'stopped':
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-red-500"></span></span><span className="capitalize">{status}</span></div>;
//         default:
//           return <div className="flex items-center gap-x-2"><span className="relative flex size-3"><span className="relative inline-flex size-3 rounded-full bg-gray-500"></span></span><span className="capitalize">{status || 'Unknown'}</span></div>;
//       }
//     },
//   },
//   // 2. Bare Metal ID
//   { accessorKey: "bare_metal_id", header: "Bare Metal ID" },
//   // 3. Bare Metal Node ID
//   { accessorKey: "bare_metal_node_id", header: "Node ID" },
//   // 4. VM ID
//   { accessorKey: "vmid", header: "VM ID" },
//   // 5. Code
//   { accessorKey: "code", header: "Code" },
//   // 6. Name
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Name <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
//   // 7. CPU
//   { accessorKey: "cpu", header: "CPU" },
//   // 8. Memory
//   {
//     accessorKey: "memory",
//     header: () => <div className="text-right">Memory</div>,
//     cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("memory"))}</div>,
//   },
//   // 9. Disk
//   {
//     accessorKey: "disk",
//     header: () => <div className="text-right">Disk</div>,
//     cell: ({ row }) => <div className="text-right">{formatBytes(row.getValue("disk"))}</div>,
//   },
//   // 10. Action
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const vm = row.original;
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
//             <DropdownMenuItem asChild>
//               <Link href={`/vm/${vm.id}`}>View Details</Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
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