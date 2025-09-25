"use client";

import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// 1. Impor komponen AlertDialog
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BareMetal } from "./columns";
import { toast } from "sonner"; // 2. Impor toast

interface EditBareMetalDialogProps {
  bareMetal: BareMetal;
  onBareMetalUpdated: () => void;
}

export function EditBareMetalDialog({ bareMetal, onBareMetalUpdated }: EditBareMetalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // State error digantikan oleh toast
  // const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    url: "",
    api_token: "",
  });

  useEffect(() => {
    if (bareMetal) {
      setFormData({
        type: bareMetal.type,
        name: bareMetal.name,
        url: bareMetal.url,
        api_token: bareMetal.api_token,
      });
    }
  }, [bareMetal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Updating bare metal server...");

    const token = Cookies.get('auth_token');

    try {
      const response = await fetch(`http://127.0.0.1:3000/bare-metal/${bareMetal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update bare metal server.");
      }
      
      toast.success("Update Successful!", {
        id: toastId,
        description: `Bare metal "${formData.name}" has been updated.`,
      });
      
      onBareMetalUpdated();
      setIsOpen(false);

    } catch (err: any) {
      toast.error("Update Failed", {
        id: toastId,
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bare Metal: {bareMetal.name}</DialogTitle>
          <DialogDescription>
            Update the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select onValueChange={handleTypeChange} value={formData.type} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROXMOX">PROXMOX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">URL</Label>
              <Input id="url" type="url" value={formData.url} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api_token" className="text-right">API Token</Label>
              <Input id="api_token" value={formData.api_token} onChange={handleChange} className="col-span-3" required />
            </div>
          </div>

          {/* -- 3. Ganti DialogFooter dengan AlertDialog -- */}
          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will update the details for "{formData.name}". Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { BareMetal } from "./columns";

// interface EditBareMetalDialogProps {
//   bareMetal: BareMetal;
//   onBareMetalUpdated: () => void;
// }

// export function EditBareMetalDialog({ bareMetal, onBareMetalUpdated }: EditBareMetalDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     type: "",
//     name: "",
//     url: "",
//     api_token: "",
//   });

//   useEffect(() => {
//     if (bareMetal) {
//       setFormData({
//         type: bareMetal.type,
//         name: bareMetal.name,
//         url: bareMetal.url,
//         api_token: bareMetal.api_token,
//       });
//     }
//   }, [bareMetal]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleTypeChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, type: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     const token = Cookies.get('auth_token');

//     try {
//       const response = await fetch(`http://127.0.0.1:3000/bare-metal/${bareMetal.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update bare metal server.");
//       }
      
//       onBareMetalUpdated();
//       setIsOpen(false);

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//           Edit
//         </DropdownMenuItem>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit Bare Metal: {bareMetal.name}</DialogTitle>
//           <DialogDescription>
//             Update the details below. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">Name</Label>
//               <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
//             </div>
            
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="type" className="text-right">Type</Label>
//               <Select onValueChange={handleTypeChange} value={formData.type} required>
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select a type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="PROXMOX">PROXMOX</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="url" className="text-right">URL</Label>
//               <Input id="url" type="url" value={formData.url} onChange={handleChange} className="col-span-3" required />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="api_token" className="text-right">API Token</Label>
//               <Input id="api_token" value={formData.api_token} onChange={handleChange} className="col-span-3" required />
//             </div>
//           </div>
//           {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
//           <DialogFooter>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Cookies from 'js-cookie';
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
// import { BareMetal } from "./columns"; // Impor tipe data

// interface EditBareMetalDialogProps {
//   bareMetal: BareMetal;
//   onBareMetalUpdated: () => void; // Callback untuk refresh data
// }

// export function EditBareMetalDialog({ bareMetal, onBareMetalUpdated }: EditBareMetalDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     type: "",
//     name: "",
//     url: "",
//     api_token: "",
//   });

//   // Isi form dengan data yang ada saat komponen pertama kali mendapat props
//   useEffect(() => {
//     if (bareMetal) {
//       setFormData({
//         type: bareMetal.type,
//         name: bareMetal.name,
//         url: bareMetal.url,
//         api_token: bareMetal.api_token,
//       });
//     }
//   }, [bareMetal]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     const token = Cookies.get('auth_token');

//     try {
//       const response = await fetch(`http://127.0.0.1:3000/bare-metal/${bareMetal.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update bare metal server.");
//       }
      
//       onBareMetalUpdated(); // Panggil callback untuk refresh tabel
//       setIsOpen(false);   // Tutup dialog

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//           Edit
//         </DropdownMenuItem>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit Bare Metal: {bareMetal.name}</DialogTitle>
//           <DialogDescription>
//             Update the details below. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">Name</Label>
//               <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="type" className="text-right">Type</Label>
//               <Input id="type" value={formData.type} onChange={handleChange} className="col-span-3" required />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="url" className="text-right">URL</Label>
//               <Input id="url" type="" value={formData.url} onChange={handleChange} className="col-span-3" required />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="api_token" className="text-right">API Token</Label>
//               <Input id="api_token" value={formData.api_token} onChange={handleChange} className="col-span-3" required />
//             </div>
//           </div>
//           {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
//           <DialogFooter>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }