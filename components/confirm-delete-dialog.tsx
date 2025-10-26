"use client";

import { useState } from "react";
import { getCookie } from 'cookies-next';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ConfirmDeleteDialogProps {
  itemId: number;
  itemName: string;
  itemType: string;
  deleteEndpoint: string;
  onActionSuccess: () => void;
  requirePassword?: boolean; // <-- PROPERTI BARU DITAMBAHKAN
}

export function ConfirmDeleteDialog({
  itemId,
  itemName,
  itemType,
  deleteEndpoint,
  onActionSuccess,
  requirePassword = true, // <-- Defaultnya true agar tidak merusak fitur delete lain
}: ConfirmDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    const toastId = toast.loading(`Deleting ${itemType} "${itemName}"...`);
    const token = getCookie('auth_token');

    try {
      const fetchOptions: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      // Hanya tambahkan body jika password diperlukan
      if (requirePassword) {
        fetchOptions.body = JSON.stringify({ password });
      }

      const response = await fetch(`${deleteEndpoint}/${itemId}`, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete ${itemType}.`);
      }

      toast.success("Deletion Successful!", {
        id: toastId,
        description: `${itemType} "${itemName}" has been deleted.`,
      });
      
      onActionSuccess();
      setIsOpen(false);
      setPassword("");

    } catch (err: any) {
      toast.error("Deletion Failed", { id: toastId, description: err.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logika disable tombol disesuaikan
  const isButtonDisabled = isLoading || (requirePassword && !password);

  return (
    // Mengubah Dialog menjadi AlertDialog agar lebih sesuai untuk konfirmasi
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {itemType}{" "}
            <span className="font-semibold text-foreground">{itemName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Kolom password hanya ditampilkan jika diperlukan */}
        {requirePassword && (
            <div className="grid gap-2 pt-2">
              <Label htmlFor={`password-${itemId}`}>Password</Label>
              <Input
                id={`password-${itemId}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                autoComplete="new-password"
              />
            </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setPassword("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isButtonDisabled}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// "use client";

// import { useState } from "react";
// import { getCookie } from 'cookies-next';
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";

// interface ConfirmDeleteDialogProps {
//   itemId: number;
//   itemName: string;
//   itemType: string;
//   deleteEndpoint: string;
//   onActionSuccess: () => void;
// }

// export function ConfirmDeleteDialog({
//   itemId,
//   itemName,
//   itemType,
//   deleteEndpoint,
//   onActionSuccess,
// }: ConfirmDeleteDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [password, setPassword] = useState("");

//   const handleDelete = async () => {
//     setIsLoading(true);
//     const toastId = toast.loading(`Deleting ${itemType} "${itemName}"...`);
//     const token = getCookie('auth_token');

//     try {
//       const response = await fetch(`${deleteEndpoint}/${itemId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ password }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Failed to delete ${itemType}.`);
//       }

//       toast.success("Deletion Successful!", {
//         id: toastId,
//         description: `${itemType} "${itemName}" has been deleted.`,
//       });
      
//       onActionSuccess();
//       setIsOpen(false);
//       setPassword("");

//     } catch (err: any) {
//       toast.error("Deletion Failed", { id: toastId, description: err.message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <DropdownMenuItem
//           variant="destructive"
//           onSelect={(e) => {
//             e.preventDefault();
//             setIsOpen(true);
//           }}
//         >
//           Delete
//         </DropdownMenuItem>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Confirm Deletion</DialogTitle>
//           <DialogDescription>
//             This action cannot be undone. To permanently delete the {itemType}{" "}
//             <span className="font-semibold text-foreground">{itemName}</span>,
//             please enter your password.
//           </DialogDescription>
//         </DialogHeader>
//         {/* PERUBAHAN DI SINI: Mengubah 'py-4' menjadi 'pt-2' */}
//         <div className="grid gap-2 pt-2">
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your current password"
//             autoComplete="new-password"
//           />
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => setIsOpen(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="destructive"
//             onClick={handleDelete}
//             disabled={!password || isLoading}
//           >
//             {isLoading ? 'Deleting...' : `Delete ${itemType}`}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }