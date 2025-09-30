"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";
import { VirtualMachineDetail } from "../columns";

interface EditVmFormProps {
  initialData: VirtualMachineDetail;
}

const bytesToGB = (bytes: number | null) => (bytes ? (bytes / (1024 ** 3)) : '');
const gbToBytes = (gb: number | string) => (Number(gb) || 0) * (1024 ** 3);

export function EditVmForm({ initialData }: EditVmFormProps) {
  const router = useRouter();
  
  const [vmData, setVmData] = useState({
    bare_metal_id: initialData.bare_metal_id ?? '',
    bare_metal_node_id: initialData.bare_metal_node_id ?? '',
    vmid: initialData.vmid ?? '',
    code: initialData.code ?? '',
    name: initialData.name ?? '',
    cpu: initialData.cpu ?? '',
    memory: bytesToGB(initialData.memory),
    disk: bytesToGB(initialData.disk),
  });
  const [vmLoading, setVmLoading] = useState(false);

  const [configData, setConfigData] = useState({
    virtual_machine_id: initialData.id,
    is_alert_status: initialData.virtual_machine_config.is_alert_status ?? false,
    is_alert_disk: initialData.virtual_machine_config.is_alert_disk ?? false,
    threshold_disk: initialData.virtual_machine_config.threshold_disk ?? '',
  });
  const [configLoading, setConfigLoading] = useState(false);

  // 1. Tambahkan handler baru untuk memfilter input numerik
  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<any>>,
    options?: { max?: number }
  ) => {
    const { id, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9]/g, ''); // Hanya izinkan angka

    if (sanitizedValue === "") {
        setter((prev: any) => ({ ...prev, [id]: "" }));
        return;
    }

    const numValue = Number(sanitizedValue);

    if (options?.max !== undefined && numValue > options.max) {
      return; // Jangan update jika melebihi batas
    }

    setter((prev: any) => ({ ...prev, [id]: sanitizedValue }));
  };


  const handleVmSubmit = async () => {
    setVmLoading(true);
    const toastId = toast.loading("Saving VM details...");
    const token = Cookies.get('auth_token');

    try {
      const payload = {
        bare_metal_id: Number(vmData.bare_metal_id) || null,
        bare_metal_node_id: Number(vmData.bare_metal_node_id) || null,
        vmid: vmData.vmid,
        code: vmData.code,
        name: vmData.name,
        cpu: Number(vmData.cpu) || null,
        memory: gbToBytes(vmData.memory) || null,
        disk: gbToBytes(vmData.disk) || null,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/virtual-machine/${initialData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update VM details.");
      
      toast.success("VM Details Updated!", { id: toastId });
      router.refresh();

    } catch (err: any) {
      toast.error("Update Failed", { id: toastId, description: err.message });
    } finally {
      setVmLoading(false);
    }
  };
  
  const handleConfigSubmit = async () => {
    setConfigLoading(true);
    const toastId = toast.loading("Saving configuration...");
    const token = Cookies.get('auth_token');
    const configId = initialData.virtual_machine_config.id;

    try {
        const payload = {
            virtual_machine_id: configData.virtual_machine_id,
            is_alert_status: configData.is_alert_status,
            is_alert_disk: configData.is_alert_disk,
            threshold_disk: Number(configData.threshold_disk) || 0,
        };
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/virtual-machine/config/${configId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update VM configuration.");

        toast.success("Configuration Updated!", { id: toastId });
        router.refresh();

    } catch (err: any) {
        toast.error("Update Failed", { id: toastId, description: err.message });
    } finally {
        setConfigLoading(false);
    }
  };

  const isVmFormValid = vmData.name.trim() !== '' && vmData.code.trim() !== '';

  return (
    <div className="space-y-8">
      <form onSubmit={(e) => { e.preventDefault(); document.getElementById('save-vm-details-trigger')?.click(); }}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>VM Name <span className="text-red-500">*</span></Label>
              <Input id="name" value={vmData.name} onChange={(e) => setVmData(p => ({...p, name: e.target.value}))} required />
            </div>
            <div className="space-y-2"><Label>VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => setVmData(p => ({...p, vmid: e.target.value}))} /></div>
            <div className="space-y-2">
              <Label>Code <span className="text-red-500">*</span></Label>
              <Input id="code" value={vmData.code} onChange={(e) => setVmData(p => ({...p, code: e.target.value}))} required />
            </div>
            {/* 2. Terapkan handler baru dan ubah tipe input */}
            <div className="space-y-2"><Label>Bare Metal ID</Label><Input id="bare_metal_id" type="text" pattern="[0-9]*" value={vmData.bare_metal_id} onChange={(e) => handleNumberInputChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Node ID</Label><Input id="bare_metal_node_id" type="text" pattern="[0-9]*" value={vmData.bare_metal_node_id} onChange={(e) => handleNumberInputChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>CPU Cores</Label><Input id="cpu" type="text" pattern="[0-9]*" value={vmData.cpu} onChange={(e) => handleNumberInputChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Memory (GB)</Label><Input id="memory" type="text" pattern="[0-9]*" value={vmData.memory} onChange={(e) => handleNumberInputChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Disk (GB)</Label><Input id="disk" type="text" pattern="[0-9]*" value={vmData.disk} onChange={(e) => handleNumberInputChange(e, setVmData)} /></div>
          </CardContent>
          <div className="px-6 pb-6">
            <div className="flex justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button id="save-vm-details-trigger" type="button" disabled={!isVmFormValid || vmLoading}>
                            {vmLoading ? "Saving..." : "Save VM Details"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will update the basic information for this VM. Are you sure?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleVmSubmit}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </Card>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); document.getElementById('save-config-trigger')?.click(); }}>
        <Card>
          <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between"><Label>Enable Status Alert</Label><Switch checked={configData.is_alert_status} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_status: c}))} /></div>
            <div className="flex items-center justify-between"><Label>Enable Disk Usage Alert</Label><Switch checked={configData.is_alert_disk} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_disk: c}))} /></div>
            <div className="space-y-2"><Label>Disk Threshold (%)</Label><Input id="threshold_disk" type="text" pattern="[0-9]*" value={configData.threshold_disk} onChange={(e) => handleNumberInputChange(e, setConfigData, { max: 100 })} /></div>
          </CardContent>
          <div className="px-6 pb-6">
            <div className="flex justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button id="save-config-trigger" type="button" disabled={configLoading}>
                            {configLoading ? "Saving..." : "Save Configuration"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will update the alert configuration for this VM. Are you sure?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfigSubmit}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
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
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { VirtualMachineDetail } from "../columns";

// interface EditVmFormProps {
//   initialData: VirtualMachineDetail;
// }

// const bytesToGB = (bytes: number | null) => (bytes || 0) / (1024 ** 3);
// const gbToBytes = (gb: number) => gb * (1024 ** 3);

// export function EditVmForm({ initialData }: EditVmFormProps) {
//   const router = useRouter();
  
//   const [vmData, setVmData] = useState({
//     bare_metal_id: initialData.bare_metal_id ?? '',
//     bare_metal_node_id: initialData.bare_metal_node_id ?? '',
//     vmid: initialData.vmid ?? '',
//     code: initialData.code ?? '',
//     name: initialData.name ?? '',
//     cpu: initialData.cpu ?? '',
//     memory: bytesToGB(initialData.memory),
//     disk: bytesToGB(initialData.disk),
//   });
//   const [vmLoading, setVmLoading] = useState(false);

//   const [configData, setConfigData] = useState({
//     virtual_machine_id: initialData.id,
//     is_alert_status: initialData.virtual_machine_config.is_alert_status ?? false,
//     is_alert_disk: initialData.virtual_machine_config.is_alert_disk ?? false,
//     threshold_disk: initialData.virtual_machine_config.threshold_disk ?? '',
//   });
//   const [configLoading, setConfigLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
//     const { id, value } = e.target;
//     setter((prev: any) => ({ ...prev, [id]: value }));
//   };

//   const handleVmSubmit = async () => {
//     setVmLoading(true);
//     const toastId = toast.loading("Saving VM details...");
//     const token = Cookies.get('auth_token');

//     try {
//       const payload = {
//         bare_metal_id: Number(vmData.bare_metal_id) || null,
//         bare_metal_node_id: Number(vmData.bare_metal_node_id) || null,
//         vmid: vmData.vmid,
//         code: vmData.code,
//         name: vmData.name,
//         cpu: Number(vmData.cpu) || null,
//         memory: gbToBytes(Number(vmData.memory)) || null,
//         disk: gbToBytes(Number(vmData.disk)) || null,
//       };

//       const response = await fetch(`http://127.0.0.1:3000/virtual-machine/${initialData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to update VM details.");
      
//       toast.success("VM Details Updated!", { id: toastId });
//       router.refresh();

//     } catch (err: any) {
//       toast.error("Update Failed", { id: toastId, description: err.message });
//     } finally {
//       setVmLoading(false);
//     }
//   };
  
//   const handleConfigSubmit = async () => {
//     setConfigLoading(true);
//     const toastId = toast.loading("Saving configuration...");
//     const token = Cookies.get('auth_token');
//     const configId = initialData.virtual_machine_config.id;

//     try {
//         const payload = {
//             virtual_machine_id: configData.virtual_machine_id,
//             is_alert_status: configData.is_alert_status,
//             is_alert_disk: configData.is_alert_disk,
//             threshold_disk: Number(configData.threshold_disk) || 0,
//         };
        
//         const response = await fetch(`http://127.0.0.1:3000/virtual-machine/config/${configId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) throw new Error("Failed to update VM configuration.");

//         toast.success("Configuration Updated!", { id: toastId });
//         router.refresh();

//     } catch (err: any) {
//         toast.error("Update Failed", { id: toastId, description: err.message });
//     } finally {
//         setConfigLoading(false);
//     }
//   };

//   const isVmFormValid = vmData.name.trim() !== '' && vmData.code.trim() !== '';

//   return (
//     <div className="space-y-8">
//       {/* -- 1. Hapus onSubmit dari form ini -- */}
//       <form>
//         <Card>
//           <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label>VM Name <span className="text-red-500">*</span></Label>
//               <Input id="name" value={vmData.name} onChange={(e) => handleChange(e, setVmData)} required />
//             </div>
//             <div className="space-y-2"><Label>VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2">
//               <Label>Code <span className="text-red-500">*</span></Label>
//               <Input id="code" value={vmData.code} onChange={(e) => handleChange(e, setVmData)} required />
//             </div>
//             <div className="space-y-2"><Label>Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleChange(e, setVmData)} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             <div className="flex justify-end">
//                 <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                         {/* -- 2. Ubah tipe tombol menjadi "button" -- */}
//                         <Button type="button" disabled={!isVmFormValid || vmLoading}>
//                             {vmLoading ? "Saving..." : "Save VM Details"}
//                         </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Confirm Update</AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 This will update the basic information for this VM. Are you sure?
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction onClick={handleVmSubmit}>Continue</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//           </div>
//         </Card>
//       </form>

//       {/* -- 3. Hapus onSubmit dari form ini juga -- */}
//       <form>
//         <Card>
//           <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center justify-between"><Label>Enable Status Alert</Label><Switch checked={configData.is_alert_status} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_status: c}))} /></div>
//             <div className="flex items-center justify-between"><Label>Enable Disk Usage Alert</Label><Switch checked={configData.is_alert_disk} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_disk: c}))} /></div>
//             <div className="space-y-2"><Label>Disk Threshold (%)</Label><Input type="number" min="0" max="100" value={configData.threshold_disk} onChange={(e) => { const v = e.target.value; if (Number(v) <= 100) setConfigData(p => ({...p, threshold_disk: Number(v)})); }} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             <div className="flex justify-end">
//                 <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                          {/* -- 4. Ubah tipe tombol menjadi "button" -- */}
//                         <Button type="button" disabled={configLoading}>
//                             {configLoading ? "Saving..." : "Save Configuration"}
//                         </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Confirm Update</AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 This will update the alert configuration for this VM. Are you sure?
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction onClick={handleConfigSubmit}>Continue</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//           </div>
//         </Card>
//       </form>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
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
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { VirtualMachineDetail } from "../columns";

// interface EditVmFormProps {
//   initialData: VirtualMachineDetail;
// }

// const bytesToGB = (bytes: number | null) => (bytes || 0) / (1024 ** 3);
// const gbToBytes = (gb: number) => gb * (1024 ** 3);

// export function EditVmForm({ initialData }: EditVmFormProps) {
//   const router = useRouter();
  
//   // -- PERBAIKAN DI SINI: Ubah nilai 'null' menjadi string kosong '' --
//   const [vmData, setVmData] = useState({
//     bare_metal_id: initialData.bare_metal_id ?? '',
//     bare_metal_node_id: initialData.bare_metal_node_id ?? '',
//     vmid: initialData.vmid ?? '',
//     code: initialData.code ?? '',
//     name: initialData.name ?? '',
//     cpu: initialData.cpu ?? '',
//     memory: bytesToGB(initialData.memory),
//     disk: bytesToGB(initialData.disk),
//   });
//   const [vmLoading, setVmLoading] = useState(false);

//   const [configData, setConfigData] = useState({
//     virtual_machine_id: initialData.id,
//     is_alert_status: initialData.virtual_machine_config.is_alert_status ?? false,
//     is_alert_disk: initialData.virtual_machine_config.is_alert_disk ?? false,
//     threshold_disk: initialData.virtual_machine_config.threshold_disk ?? '',
//   });
//   const [configLoading, setConfigLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
//     const { id, value } = e.target;
//     if (Number(value) < 0) return;
//     setter((prev: any) => ({ ...prev, [id]: value }));
//   };

//   const handleVmSubmit = async () => {
//     setVmLoading(true);
//     const toastId = toast.loading("Saving VM details...");
//     const token = Cookies.get('auth_token');

//     try {
//       const payload = {
//         bare_metal_id: Number(vmData.bare_metal_id),
//         bare_metal_node_id: Number(vmData.bare_metal_node_id),
//         vmid: vmData.vmid, code: vmData.code, name: vmData.name, cpu: Number(vmData.cpu),
//         memory: gbToBytes(Number(vmData.memory)),
//         disk: gbToBytes(Number(vmData.disk)),
//       };

//       const response = await fetch(`http://127.0.0.1:3000/virtual-machine/${initialData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to update VM details.");
      
//       toast.success("VM Details Updated!", { id: toastId });
//       router.refresh();

//     } catch (err: any) {
//       toast.error("Update Failed", { id: toastId, description: err.message });
//     } finally {
//       setVmLoading(false);
//     }
//   };
  
//   const handleConfigSubmit = async () => {
//     setConfigLoading(true);
//     const toastId = toast.loading("Saving configuration...");
//     const token = Cookies.get('auth_token');
//     const configId = initialData.virtual_machine_config.id;

//     try {
//         const payload = {
//             virtual_machine_id: configData.virtual_machine_id,
//             is_alert_status: configData.is_alert_status,
//             is_alert_disk: configData.is_alert_disk,
//             threshold_disk: Number(configData.threshold_disk),
//         };
        
//         const response = await fetch(`http://127.0.0.1:3000/virtual-machine/config/${configId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) throw new Error("Failed to update VM configuration.");

//         toast.success("Configuration Updated!", { id: toastId });
//         router.refresh();

//     } catch (err: any) {
//         toast.error("Update Failed", { id: toastId, description: err.message });
//     } finally {
//         setConfigLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <form onSubmit={(e) => { e.preventDefault(); document.getElementById('save-vm-details-trigger')?.click(); }}>
//         <Card>
//           <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label>VM Name</Label><Input id="name" value={vmData.name} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Code</Label><Input id="code" value={vmData.code} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleChange(e, setVmData)} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             <div className="flex justify-end">
//                 <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                         <Button id="save-vm-details-trigger" type="button" disabled={vmLoading}>
//                             {vmLoading ? "Saving..." : "Save VM Details"}
//                         </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Confirm Update</AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 This will update the basic information for this VM. Are you sure?
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction onClick={handleVmSubmit}>Continue</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//           </div>
//         </Card>
//       </form>

//       <form onSubmit={(e) => { e.preventDefault(); document.getElementById('save-config-trigger')?.click(); }}>
//         <Card>
//           <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center justify-between"><Label>Enable Status Alert</Label><Switch checked={configData.is_alert_status} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_status: c}))} /></div>
//             <div className="flex items-center justify-between"><Label>Enable Disk Usage Alert</Label><Switch checked={configData.is_alert_disk} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_disk: c}))} /></div>
//             <div className="space-y-2"><Label>Disk Threshold (%)</Label><Input type="number" min="0" max="100" value={configData.threshold_disk} onChange={(e) => { const v = e.target.value; if (Number(v) <= 100) setConfigData(p => ({...p, threshold_disk: Number(v)})); }} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             <div className="flex justify-end">
//                 <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                         <Button id="save-config-trigger" type="button" disabled={configLoading}>
//                             {configLoading ? "Saving..." : "Save Configuration"}
//                         </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Confirm Update</AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 This will update the alert configuration for this VM. Are you sure?
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction onClick={handleConfigSubmit}>Continue</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//           </div>
//         </Card>
//       </form>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// // 1. Impor komponen AlertDialog dan toast
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
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { VirtualMachineDetail } from "../columns";

// interface EditVmFormProps {
//   initialData: VirtualMachineDetail;
// }

// const bytesToGB = (bytes: number) => bytes / (1024 ** 3);
// const gbToBytes = (gb: number) => gb * (1024 ** 3);

// export function EditVmForm({ initialData }: EditVmFormProps) {
//   const router = useRouter();
  
//   // State untuk form VM
//   const [vmData, setVmData] = useState({
//     bare_metal_id: initialData.bare_metal_id,
//     bare_metal_node_id: initialData.bare_metal_node_id,
//     vmid: initialData.vmid,
//     code: initialData.code,
//     name: initialData.name,
//     cpu: initialData.cpu,
//     memory: bytesToGB(initialData.memory),
//     disk: bytesToGB(initialData.disk),
//   });
//   const [vmLoading, setVmLoading] = useState(false);
//   // State error/success digantikan oleh toast

//   // State untuk form Config
//   const [configData, setConfigData] = useState({
//     virtual_machine_id: initialData.id,
//     is_alert_status: initialData.virtual_machine_config.is_alert_status,
//     is_alert_disk: initialData.virtual_machine_config.is_alert_disk,
//     threshold_disk: initialData.virtual_machine_config.threshold_disk,
//   });
//   const [configLoading, setConfigLoading] = useState(false);
//   // State error/success digantikan oleh toast

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
//     const { id, value } = e.target;
//     if (Number(value) < 0) return;
//     setter((prev: any) => ({ ...prev, [id]: value }));
//   };

//   // 2. Modifikasi handleSubmit untuk VM Details
//   const handleVmSubmit = async () => {
//     setVmLoading(true);
//     const toastId = toast.loading("Saving VM details...");
//     const token = Cookies.get('auth_token');

//     try {
//       const payload = {
//         bare_metal_id: Number(vmData.bare_metal_id),
//         bare_metal_node_id: Number(vmData.bare_metal_node_id),
//         vmid: vmData.vmid, code: vmData.code, name: vmData.name, cpu: Number(vmData.cpu),
//         memory: gbToBytes(Number(vmData.memory)),
//         disk: gbToBytes(Number(vmData.disk)),
//       };

//       const response = await fetch(`http://127.0.0.1:3000/virtual-machine/${initialData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to update VM details.");
      
//       toast.success("VM Details Updated!", { id: toastId });
//       router.refresh();

//     } catch (err: any) {
//       toast.error("Update Failed", { id: toastId, description: err.message });
//     } finally {
//       setVmLoading(false);
//     }
//   };
  
//   // 3. Modifikasi handleSubmit untuk Config
//   const handleConfigSubmit = async () => {
//     setConfigLoading(true);
//     const toastId = toast.loading("Saving configuration...");
//     const token = Cookies.get('auth_token');
//     const configId = initialData.virtual_machine_config.id;

//     try {
//         const payload = {
//             virtual_machine_id: configData.virtual_machine_id,
//             is_alert_status: configData.is_alert_status,
//             is_alert_disk: configData.is_alert_disk,
//             threshold_disk: Number(configData.threshold_disk),
//         };
        
//         const response = await fetch(`http://127.0.0.1:3000/virtual-machine/config/${configId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) throw new Error("Failed to update VM configuration.");

//         toast.success("Configuration Updated!", { id: toastId });
//         router.refresh();

//     } catch (err: any) {
//         toast.error("Update Failed", { id: toastId, description: err.message });
//     } finally {
//         setConfigLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* FORM 1: VM Details */}
//       <form onSubmit={(e) => { e.preventDefault(); document.getElementById('save-vm-details-trigger')?.click(); }}>
//         <Card>
//           <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label>VM Name</Label><Input id="name" value={vmData.name} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Code</Label><Input id="code" value={vmData.code} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleChange(e, setVmData)} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             {/* -- 4. Ganti Tombol Save VM Details dengan AlertDialog -- */}
//             <div className="flex justify-end">
//                 <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                         <Button id="save-vm-details-trigger" type="button" disabled={vmLoading}>
//                             {vmLoading ? "Saving..." : "Save VM Details"}
//                         </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Confirm Update</AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 This will update the basic information for this VM. Are you sure?
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction onClick={handleVmSubmit}>Continue</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//           </div>
//         </Card>
//       </form>

//       {/* FORM 2: Config Details */}
//       <form onSubmit={(e) => { e.preventDefault(); document.getElementById('save-config-trigger')?.click(); }}>
//         <Card>
//           <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center justify-between"><Label>Enable Status Alert</Label><Switch checked={configData.is_alert_status} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_status: c}))} /></div>
//             <div className="flex items-center justify-between"><Label>Enable Disk Usage Alert</Label><Switch checked={configData.is_alert_disk} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_disk: c}))} /></div>
//             <div className="space-y-2"><Label>Disk Threshold (%)</Label><Input type="number" min="0" max="100" value={configData.threshold_disk} onChange={(e) => { const v = e.target.value; if (Number(v) <= 100) setConfigData(p => ({...p, threshold_disk: Number(v)})); }} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             {/* -- 5. Ganti Tombol Save Configuration dengan AlertDialog -- */}
//             <div className="flex justify-end">
//                 <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                         <Button id="save-config-trigger" type="button" disabled={configLoading}>
//                             {configLoading ? "Saving..." : "Save Configuration"}
//                         </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Confirm Update</AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 This will update the alert configuration for this VM. Are you sure?
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction onClick={handleConfigSubmit}>Continue</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//           </div>
//         </Card>
//       </form>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal, CheckCircle } from "lucide-react";
// import { VirtualMachineDetail } from "../columns";

// interface EditVmFormProps {
//   initialData: VirtualMachineDetail;
// }

// const bytesToGB = (bytes: number) => bytes / (1024 ** 3);
// const gbToBytes = (gb: number) => gb * (1024 ** 3);

// export function EditVmForm({ initialData }: EditVmFormProps) {
//   const router = useRouter();
  
//   const [vmData, setVmData] = useState({
//     bare_metal_id: initialData.bare_metal_id,
//     bare_metal_node_id: initialData.bare_metal_node_id,
//     vmid: initialData.vmid,
//     code: initialData.code,
//     name: initialData.name,
//     cpu: initialData.cpu,
//     memory: bytesToGB(initialData.memory),
//     disk: bytesToGB(initialData.disk),
//   });
//   const [vmLoading, setVmLoading] = useState(false);
//   const [vmError, setVmError] = useState<string | null>(null);
//   const [vmSuccess, setVmSuccess] = useState<string | null>(null);

//   const [configData, setConfigData] = useState({
//     virtual_machine_id: initialData.id,
//     is_alert_status: initialData.virtual_machine_config.is_alert_status,
//     is_alert_disk: initialData.virtual_machine_config.is_alert_disk,
//     threshold_disk: initialData.virtual_machine_config.threshold_disk,
//   });
//   const [configLoading, setConfigLoading] = useState(false);
//   const [configError, setConfigError] = useState<string | null>(null);
//   const [configSuccess, setConfigSuccess] = useState<string | null>(null);


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
//     const { id, value } = e.target;
//     if (Number(value) < 0) return;
//     setter((prev: any) => ({ ...prev, [id]: value }));
//   };

//   const handleVmSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setVmLoading(true);
//     setVmError(null);
//     setVmSuccess(null);
//     const token = Cookies.get('auth_token');

//     try {
//       const payload = {
//         bare_metal_id: Number(vmData.bare_metal_id),
//         bare_metal_node_id: Number(vmData.bare_metal_node_id),
//         vmid: vmData.vmid,
//         code: vmData.code,
//         name: vmData.name,
//         cpu: Number(vmData.cpu),
//         memory: gbToBytes(Number(vmData.memory)),
//         disk: gbToBytes(Number(vmData.disk)),
//       };

//       const response = await fetch(`http://127.0.0.1:3000/virtual-machine/${initialData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to update VM details.");
//       setVmSuccess("VM details updated successfully!");
//       router.refresh();

//     } catch (err: any) {
//       setVmError(err.message);
//     } finally {
//       setVmLoading(false);
//     }
//   };
  
//   const handleConfigSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setConfigLoading(true);
//     setConfigError(null);
//     setConfigSuccess(null);
//     const token = Cookies.get('auth_token');
//     const configId = initialData.virtual_machine_config.id;

//     try {
//         const payload = {
//             virtual_machine_id: configData.virtual_machine_id,
//             is_alert_status: configData.is_alert_status,
//             is_alert_disk: configData.is_alert_disk,
//             threshold_disk: Number(configData.threshold_disk),
//         };
        
//         // -- PERBAIKAN ENDPOINT DI SINI --
//         const response = await fetch(`http://127.0.0.1:3000/virtual-machine/config/${configId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) throw new Error("Failed to update VM configuration.");
//         setConfigSuccess("VM configuration updated successfully!");
//         router.refresh();

//     } catch (err: any) {
//         setConfigError(err.message);
//     } finally {
//         setConfigLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <form onSubmit={handleVmSubmit}>
//         <Card>
//           <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label>VM Name</Label><Input id="name" value={vmData.name} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Code</Label><Input id="code" value={vmData.code} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleChange(e, setVmData)} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             {vmSuccess && <Alert className="mb-4 border-green-500 text-green-500"><CheckCircle className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>{vmSuccess}</AlertDescription></Alert>}
//             {vmError && <Alert variant="destructive" className="mb-4"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{vmError}</AlertDescription></Alert>}
//             <div className="flex justify-end"><Button type="submit" disabled={vmLoading}>{vmLoading ? "Saving..." : "Save VM Details"}</Button></div>
//           </div>
//         </Card>
//       </form>

//       <form onSubmit={handleConfigSubmit}>
//         <Card>
//           <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center justify-between"><Label>Enable Status Alert</Label><Switch checked={configData.is_alert_status} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_status: c}))} /></div>
//             <div className="flex items-center justify-between"><Label>Enable Disk Usage Alert</Label><Switch checked={configData.is_alert_disk} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_disk: c}))} /></div>
//             <div className="space-y-2"><Label>Disk Threshold (%)</Label><Input type="number" min="0" max="100" value={configData.threshold_disk} onChange={(e) => { const v = e.target.value; if (Number(v) <= 100) setConfigData(p => ({...p, threshold_disk: Number(v)})); }} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             {configSuccess && <Alert className="mb-4 border-green-500 text-green-500"><CheckCircle className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>{configSuccess}</AlertDescription></Alert>}
//             {configError && <Alert variant="destructive" className="mb-4"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{configError}</AlertDescription></Alert>}
//             <div className="flex justify-end"><Button type="submit" disabled={configLoading}>{configLoading ? "Saving..." : "Save Configuration"}</Button></div>
//           </div>
//         </Card>
//       </form>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal, CheckCircle } from "lucide-react";
// import { VirtualMachineDetail } from "../columns"; // Impor tipe dari halaman detail

// interface EditVmFormProps {
//   initialData: VirtualMachineDetail;
// }

// export function EditVmForm({ initialData }: EditVmFormProps) {
//   const router = useRouter();
  
//   // State untuk form VM
//   const [vmData, setVmData] = useState({
//     bare_metal_id: initialData.bare_metal_id,
//     bare_metal_node_id: initialData.bare_metal_node_id,
//     vmid: initialData.vmid,
//     code: initialData.code,
//     name: initialData.name,
//     cpu: initialData.cpu,
//     memory: initialData.memory,
//     disk: initialData.disk,
//   });
//   const [vmLoading, setVmLoading] = useState(false);
//   const [vmError, setVmError] = useState<string | null>(null);
//   const [vmSuccess, setVmSuccess] = useState<string | null>(null);

//   // State untuk form Config
//   const [configData, setConfigData] = useState({
//     virtual_machine_id: initialData.id,
//     is_alert_status: initialData.virtual_machine_config.is_alert_status,
//     is_alert_disk: initialData.virtual_machine_config.is_alert_disk,
//     threshold_disk: initialData.virtual_machine_config.threshold_disk,
//   });
//   const [configLoading, setConfigLoading] = useState(false);
//   const [configError, setConfigError] = useState<string | null>(null);
//   const [configSuccess, setConfigSuccess] = useState<string | null>(null);


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
//     const { id, value } = e.target;
//     if (Number(value) < 0) return;
//     setter((prev: any) => ({ ...prev, [id]: value }));
//   };

//   // Submit handler untuk Form VM
//   const handleVmSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setVmLoading(true);
//     setVmError(null);
//     setVmSuccess(null);
//     const token = Cookies.get('auth_token');

//     try {
//       const response = await fetch(`http://127.0.0.1:3000/virtual-machine/${initialData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(vmData),
//       });

//       if (!response.ok) throw new Error("Failed to update VM details.");
//       setVmSuccess("VM details updated successfully!");
//       router.refresh(); // Refresh server component data

//     } catch (err: any) {
//       setVmError(err.message);
//     } finally {
//       setVmLoading(false);
//     }
//   };
  
//   // Submit handler untuk Form Config
//   const handleConfigSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setConfigLoading(true);
//     setConfigError(null);
//     setConfigSuccess(null);
//     const token = Cookies.get('auth_token');
//     const configId = initialData.virtual_machine_config.id; // Asumsi ID config ada di sini

//     try {
//         const response = await fetch(`http://127.0.0.1:3000/virtual-machine/${configId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(configData),
//         });

//         if (!response.ok) throw new Error("Failed to update VM configuration.");
//         setConfigSuccess("VM configuration updated successfully!");
//         router.refresh();

//     } catch (err: any) {
//         setConfigError(err.message);
//     } finally {
//         setConfigLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* FORM 1: VM Details */}
//       <form onSubmit={handleVmSubmit}>
//         <Card>
//           <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label>VM Name</Label><Input id="name" value={vmData.name} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Code</Label><Input id="code" value={vmData.code} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleChange(e, setVmData)} /></div>
//             <div className="space-y-2"><Label>CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleChange(e, setVmData)} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             {vmSuccess && <Alert className="mb-4 border-green-500 text-green-500"><CheckCircle className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>{vmSuccess}</AlertDescription></Alert>}
//             {vmError && <Alert variant="destructive" className="mb-4"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{vmError}</AlertDescription></Alert>}
//             <div className="flex justify-end"><Button type="submit" disabled={vmLoading}>{vmLoading ? "Saving..." : "Save VM Details"}</Button></div>
//           </div>
//         </Card>
//       </form>

//       {/* FORM 2: Config Details */}
//       <form onSubmit={handleConfigSubmit}>
//         <Card>
//           <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center justify-between"><Label>Enable Status Alert</Label><Switch checked={configData.is_alert_status} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_status: c}))} /></div>
//             <div className="flex items-center justify-between"><Label>Enable Disk Usage Alert</Label><Switch checked={configData.is_alert_disk} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_disk: c}))} /></div>
//             <div className="space-y-2"><Label>Disk Threshold (%)</Label><Input type="number" min="0" max="100" value={configData.threshold_disk} onChange={(e) => { const v = e.target.value; if (Number(v) <= 100) setConfigData(p => ({...p, threshold_disk: Number(v)})); }} /></div>
//           </CardContent>
//           <div className="px-6 pb-6">
//             {configSuccess && <Alert className="mb-4 border-green-500 text-green-500"><CheckCircle className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>{configSuccess}</AlertDescription></Alert>}
//             {configError && <Alert variant="destructive" className="mb-4"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{configError}</AlertDescription></Alert>}
//             <div className="flex justify-end"><Button type="submit" disabled={configLoading}>{configLoading ? "Saving..." : "Save Configuration"}</Button></div>
//           </div>
//         </Card>
//       </form>
//     </div>
//   );
// }