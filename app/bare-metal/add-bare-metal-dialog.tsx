"use client";

import { useState } from "react";
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

// ... (Interface dan fungsi lainnya tetap sama) ...
interface AddBareMetalDialogProps { onBareMetalAdded: () => void; }
export function AddBareMetalDialog({ onBareMetalAdded }: AddBareMetalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ type: "", name: "", url: "", api_token: "", });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { id, value } = e.target; setFormData((prev) => ({ ...prev, [id]: value })); };
  const handleTypeChange = (value: string) => { setFormData((prev) => ({ ...prev, type: value })); };
  const handleSubmit = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Creating bare metal server...");
    const token = Cookies.get('auth_token');
    try {
      const response = await fetch('http://127.0.0.1:3000/bare-metal', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }, body: JSON.stringify(formData), });
      if (!response.ok) { const errorData = await response.json().catch(() => ({ message: "An unexpected error occurred." })); throw new Error(errorData.message || "Failed to add new bare metal server."); }
      toast.success("Creation Successful!", { id: toastId, description: `Bare metal "${formData.name}" has been created.`, });
      onBareMetalAdded();
      setIsOpen(false);
      setFormData({ type: "", name: "", url: "", api_token: "" });
    } catch (err: any)      {
      toast.error("Creation Failed", { id: toastId, description: err.message, });
    } finally {
      setIsLoading(false);
    }
  };
  const isFormValid = formData.name.trim() !== '' && formData.type.trim() !== '' && formData.url.trim() !== '' && formData.api_token.trim() !== '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Bare Metal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bare Metal Server</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form>
          {/* -- Perubahan: Gunakan grid 3 kolom untuk perataan presisi -- */}
          <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-3 py-4">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <span>:</span>
            <Input id="name" value={formData.name} onChange={handleChange} required />

            <Label htmlFor="type">
              Type <span className="text-red-500">*</span>
            </Label>
            <span>:</span>
            <Select onValueChange={handleTypeChange} value={formData.type} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROXMOX">PROXMOX</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="url">
              URL <span className="text-red-500">*</span>
            </Label>
            <span>:</span>
            <Input id="url" type="text" value={formData.url} onChange={handleChange} required />
            
            <Label htmlFor="api_token">
              API Token <span className="text-red-500">*</span>
            </Label>
            <span>:</span>
            <Input id="api_token" value={formData.api_token} onChange={handleChange} required />
          </div>
          
          <DialogFooter>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" disabled={!isFormValid || isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will create a new bare metal server entry. Please ensure all data is correct before proceeding.
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

// import { useState } from "react";
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
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { PlusCircle } from "lucide-react";
// import { toast } from "sonner";

// interface AddBareMetalDialogProps {
//   onBareMetalAdded: () => void;
// }

// export function AddBareMetalDialog({ onBareMetalAdded }: AddBareMetalDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const [formData, setFormData] = useState({
//     type: "",
//     name: "",
//     url: "",
//     api_token: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleTypeChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, type: value }));
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     const toastId = toast.loading("Creating bare metal server...");
//     const token = Cookies.get('auth_token');

//     try {
//       const response = await fetch('http://127.0.0.1:3000/bare-metal', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: "An unexpected error occurred." }));
//         throw new Error(errorData.message || "Failed to add new bare metal server.");
//       }
      
//       toast.success("Creation Successful!", {
//         id: toastId,
//         description: `Bare metal "${formData.name}" has been created.`,
//       });

//       onBareMetalAdded();
//       setIsOpen(false);
//       setFormData({ type: "", name: "", url: "", api_token: "" });

//     } catch (err: any) {
//       toast.error("Creation Failed", {
//         id: toastId,
//         description: err.message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const isFormValid = 
//     formData.name.trim() !== '' &&
//     formData.type.trim() !== '' &&
//     formData.url.trim() !== '' &&
//     formData.api_token.trim() !== '';

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Tambah Bare Metal
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Bare Metal Server</DialogTitle>
//           <DialogDescription>
//             Fill in the details below. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         {/* -- 1. Hapus handler onSubmit dari form -- */}
//         <form>
//           <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 py-4">
//             <Label htmlFor="name" className="text-right">
//               Name <span className="text-red-500">*</span>
//             </Label>
//             <Input id="name" value={formData.name} onChange={handleChange} required />

//             <Label htmlFor="type" className="text-right">
//               Type <span className="text-red-500">*</span>
//             </Label>
//             <Select onValueChange={handleTypeChange} value={formData.type} required>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="PROXMOX">PROXMOX</SelectItem>
//               </SelectContent>
//             </Select>

//             <Label htmlFor="url" className="text-right">
//               URL <span className="text-red-500">*</span>
//             </Label>
//             <Input id="url" type="text" value={formData.url} onChange={handleChange} required />
            
//             <Label htmlFor="api_token" className="text-right">
//               API Token <span className="text-red-500">*</span>
//             </Label>
//             <Input id="api_token" value={formData.api_token} onChange={handleChange} required />
//           </div>
          
//           <DialogFooter>
//              <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                     {/* -- 2. Ubah 'type' menjadi "button" dan hapus 'id' -- */}
//                     <Button type="button" disabled={!isFormValid || isLoading}>
//                         {isLoading ? 'Saving...' : 'Save Changes'}
//                     </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             This action will create a new bare metal server entry. Please ensure all data is correct before proceeding.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState } from "react";
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
// // 1. Impor komponen AlertDialog
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { PlusCircle } from "lucide-react";
// import { toast } from "sonner"; // 2. Impor toast dari sonner

// interface AddBareMetalDialogProps {
//   onBareMetalAdded: () => void;
// }

// export function AddBareMetalDialog({ onBareMetalAdded }: AddBareMetalDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   // State 'error' bisa kita hapus karena akan digantikan oleh toast
//   // const [error, setError] = useState<string | null>(null);
  
//   const [formData, setFormData] = useState({
//     type: "",
//     name: "",
//     url: "",
//     api_token: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleTypeChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, type: value }));
//   };

//   // Fungsi ini sekarang hanya berisi logika fetch, tanpa event
//   const handleSubmit = async () => {
//     setIsLoading(true);
//     const toastId = toast.loading("Creating bare metal server..."); // Tampilkan toast loading
//     const token = Cookies.get('auth_token');

//     try {
//       const response = await fetch('http://127.0.0.1:3000/bare-metal', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: "An unexpected error occurred." }));
//         throw new Error(errorData.message || "Failed to add new bare metal server.");
//       }
      
//       // 3. Tampilkan notifikasi SUKSES
//       toast.success("Creation Successful!", {
//         id: toastId,
//         description: `Bare metal "${formData.name}" has been created.`,
//       });

//       onBareMetalAdded();
//       setIsOpen(false);
//       setFormData({ type: "", name: "", url: "", api_token: "" });

//     } catch (err: any) {
//       // 4. Tampilkan notifikasi GAGAL
//       toast.error("Creation Failed", {
//         id: toastId,
//         description: err.message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Tambah Bare Metal
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Bare Metal Server</DialogTitle>
//           <DialogDescription>
//             Fill in the details below. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         {/* Kita gunakan tag <form> agar tombol enter tetap berfungsi, tapi logic submit dipindah */}
//         <form onSubmit={(e) => { e.preventDefault(); }}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">Name</Label>
//               <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="type" className="text-right">Type</Label>
//               <Select onValueChange={handleTypeChange} defaultValue={formData.type} required>
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
          
//           {/* -- 5. Ganti DialogFooter dengan AlertDialog -- */}
//           <DialogFooter>
//              <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                     <Button type="button" disabled={isLoading}>
//                         {isLoading ? 'Saving...' : 'Save Changes'}
//                     </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             This action will create a new bare metal server entry. Please ensure all data is correct before proceeding.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState } from "react";
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
// import { PlusCircle } from "lucide-react";

// interface AddBareMetalDialogProps {
//   onBareMetalAdded: () => void;
// }

// export function AddBareMetalDialog({ onBareMetalAdded }: AddBareMetalDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     type: "",
//     name: "",
//     url: "",
//     api_token: "",
//   });

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
//       const response = await fetch('http://127.0.0.1:3000/bare-metal', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: "An unexpected error occurred." }));
//         throw new Error(errorData.message || "Failed to add new bare metal server.");
//       }
      
//       onBareMetalAdded();
//       setIsOpen(false);
//       setFormData({ type: "", name: "", url: "", api_token: "" });

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {/* -- PERBAIKAN DI SINI: tambahkan '>' setelah <Button -- */}
//         <Button>
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Tambah Bare Metal
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Bare Metal Server</DialogTitle>
//           <DialogDescription>
//             Fill in the details below. Click save when you're done.
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
//               <Select onValueChange={handleTypeChange} defaultValue={formData.type} required>
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

// import { useState } from "react";
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
// // -- 1. Impor komponen Select dari Shadcn --
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { PlusCircle } from "lucide-react";

// interface AddBareMetalDialogProps {
//   onBareMetalAdded: () => void;
// }

// export function AddBareMetalDialog({ onBareMetalAdded }: AddBareMetalDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     type: "",
//     name: "",
//     url: "",
//     api_token: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   // -- 2. Buat handler baru khusus untuk dropdown --
//   const handleTypeChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, type: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     const token = Cookies.get('auth_token');

//     try {
//       const response = await fetch('http://127.0.0.1:3000/bare-metal', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ bare_metal: formData }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add new bare metal server.");
//       }
      
//       onBareMetalAdded();
//       setIsOpen(false);
//       setFormData({ type: "", name: "", url: "", api_token: "" });

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Tambah Bare Metal
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Bare Metal Server</DialogTitle>
//           <DialogDescription>
//             Fill in the details below. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">Name</Label>
//               <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
//             </div>

//             {/* -- 3. Ganti Input dengan komponen Select -- */}
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="type" className="text-right">Type</Label>
//               <Select onValueChange={handleTypeChange} defaultValue={formData.type} required>
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

// import { useState } from "react";
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
// import { PlusCircle } from "lucide-react";

// // Tipe untuk properti komponen
// interface AddBareMetalDialogProps {
//   onBareMetalAdded: () => void; // Callback untuk me-refresh data di halaman utama
// }

// export function AddBareMetalDialog({ onBareMetalAdded }: AddBareMetalDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     type: "",
//     name: "",
//     url: "",
//     api_token: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     const token = Cookies.get('auth_token');
//     if (!token) {
//       setError("Authentication token not found. Please log in again.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://127.0.0.1:3000/bare-metal', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ bare_metal: formData }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add new bare metal server.");
//       }
      
//       // Jika berhasil:
//       onBareMetalAdded(); // Panggil callback untuk refresh data di parent
//       setIsOpen(false);   // Tutup dialog
//       // Reset form
//       setFormData({ type: "", name: "", url: "", api_token: "" });

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Tambah Bare Metal
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Bare Metal Server</DialogTitle>
//           <DialogDescription>
//             Fill in the details below. Click save when you're done.
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
