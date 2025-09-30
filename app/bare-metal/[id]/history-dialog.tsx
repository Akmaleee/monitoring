"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BareMetalNode } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface HistoryItem {
  id: number;
  bare_metal_node_id: number;
  type: string;
  status: string;
}

interface HistoryDialogProps {
  node: BareMetalNode;
}

export function HistoryDialog({ node }: HistoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        const token = Cookies.get("auth_token");

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/bare-metal/status-history/${node.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch history data.");
          
          const result = await res.json();
          setHistory(result.data || []);

        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchHistory();
    }
  }, [isOpen, node.id]);

  const renderStatus = (status: string) => {
    const s = status.toLowerCase();
    let colorClass = "bg-gray-500";
    if (s === 'online') colorClass = "bg-green-500";
    if (s === 'offline') colorClass = "bg-red-500";

    return (
        // -- Perubahan: Tambahkan justify-center --
        <div className="flex items-center justify-center gap-x-2">
            <span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span>
            <span className="capitalize">{s}</span>
        </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View History
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Status History for: {node.node}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {/* -- Perubahan: Tambahkan text-center -- */}
                  <TableHead className="w-[50px] text-center">No.</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length > 0 ? (
                    history.map((item, index) => (
                    <TableRow key={item.id}>
                        {/* -- Perubahan: Tambahkan text-center -- */}
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="text-center">{item.type}</TableCell>
                        <TableCell>{renderStatus(item.status)}</TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">No history data found.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { BareMetalNode } from "./columns";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal } from "lucide-react";

// interface HistoryItem {
//   id: number;
//   bare_metal_node_id: number;
//   type: string;
//   status: string;
// }

// interface HistoryDialogProps {
//   node: BareMetalNode;
// }

// export function HistoryDialog({ node }: HistoryDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (isOpen) {
//       const fetchHistory = async () => {
//         setIsLoading(true);
//         setError(null);
//         const token = Cookies.get("auth_token");

//         try {
//           const res = await fetch(
//             `http://127.0.0.1:3000/bare-metal/status-history/${node.id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           if (!res.ok) throw new Error("Failed to fetch history data.");
          
//           const result = await res.json();
//           setHistory(result.data || []);

//         } catch (err: any) {
//           setError(err.message);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchHistory();
//     }
//   }, [isOpen, node.id]);

//   const renderStatus = (status: string) => {
//     const s = status.toLowerCase();
//     let colorClass = "bg-gray-500";
//     if (s === 'online') colorClass = "bg-green-500";
//     if (s === 'offline') colorClass = "bg-red-500";

//     return (
//         <div className="flex items-center gap-x-2">
//             <span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span>
//             <span className="capitalize">{s}</span>
//         </div>
//     );
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//           View History
//         </DropdownMenuItem>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Status History for: {node.node}</DialogTitle>
//         </DialogHeader>
//         <div className="max-h-[60vh] overflow-y-auto pr-4">
//           {isLoading ? (
//             <div className="space-y-2">
//                 {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
//             </div>
//           ) : error ? (
//             <Alert variant="destructive">
//               <Terminal className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[50px]">No.</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {history.length > 0 ? (
//                     history.map((item, index) => (
//                     <TableRow key={item.id}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.type}</TableCell>
//                         <TableCell>{renderStatus(item.status)}</TableCell>
//                     </TableRow>
//                     ))
//                 ) : (
//                     <TableRow>
//                         <TableCell colSpan={3} className="h-24 text-center">No history data found.</TableCell>
//                     </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { BareMetalNode } from "./columns"; // Impor tipe data dari columns
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal } from "lucide-react";

// // Tipe untuk data history
// interface HistoryItem {
//   id: number;
//   bare_metal_node_id: number;
//   type: string;
//   status: string;
// }

// // Tipe untuk properti komponen
// interface HistoryDialogProps {
//   node: BareMetalNode;
// }

// export function HistoryDialog({ node }: HistoryDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Hanya fetch data jika dialog dibuka
//     if (isOpen) {
//       const fetchHistory = async () => {
//         setIsLoading(true);
//         setError(null);
//         const token = Cookies.get("auth_token");

//         try {
//           const res = await fetch(
//             `http://127.0.0.1:3000/bare-metal/status-history/${node.id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           if (!res.ok) throw new Error("Failed to fetch history data.");
          
//           const result = await res.json();
//           setHistory(result.data || []);

//         } catch (err: any) {
//           setError(err.message);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchHistory();
//     }
//   }, [isOpen, node.id]);

//   const renderStatus = (status: string) => {
//     const s = status.toLowerCase();
//     let colorClass = "bg-gray-500";
//     if (s === 'online') colorClass = "bg-green-500";
//     if (s === 'offline') colorClass = "bg-red-500";

//     return (
//         <div className="flex items-center gap-x-2">
//             <span className={`relative flex size-2.5 rounded-full ${colorClass}`}></span>
//             <span className="capitalize">{s}</span>
//         </div>
//     );
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {/* Mencegah dropdown tertutup saat dialog terbuka */}
//         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//           View History
//         </DropdownMenuItem>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>Status History for: {node.node}</DialogTitle>
//         </DialogHeader>
//         <div className="max-h-[60vh] overflow-y-auto pr-4">
//           {isLoading ? (
//             <div className="space-y-2">
//                 {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
//             </div>
//           ) : error ? (
//             <Alert variant="destructive">
//               <Terminal className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[100px]">ID</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {history.length > 0 ? (
//                     history.map((item) => (
//                     <TableRow key={item.id}>
//                         <TableCell>{item.id}</TableCell>
//                         <TableCell>{item.type}</TableCell>
//                         <TableCell>{renderStatus(item.status)}</TableCell>
//                     </TableRow>
//                     ))
//                 ) : (
//                     <TableRow>
//                         <TableCell colSpan={3} className="h-24 text-center">No history data found.</TableCell>
//                     </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }