"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner"; // 2. Impor toast

export function VmForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // State error sudah tidak diperlukan karena diganti toast
  // const [error, setError] = useState<string | null>(null);

  const [vmData, setVmData] = useState({
    bare_metal_id: "",
    bare_metal_node_id: "",
    vmid: "",
    code: "",
    name: "",
    cpu: "",
    memory: "",
    disk: "",
  });

  const [configData, setConfigData] = useState({
    is_alert_status: false,
    is_alert_disk: false,
    threshold_disk: "",
  });

  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { id, value } = e.target;
    if (Number(value) < 0) return;
    setter((prev: any) => ({ ...prev, [id]: value }));
  };
  
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numValue = Number(value);
    if (numValue < 0) return;
    if (numValue > 100) return;
    setConfigData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean, id: 'is_alert_status' | 'is_alert_disk') => {
    setConfigData((prev) => ({ ...prev, [id]: checked }));
  };

  // 3. Modifikasi handleSubmit untuk menggunakan toast
  const handleSubmit = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Creating new virtual machine...");
    
    const token = Cookies.get('auth_token');

    try {
      const payload = {
        virtual_machine: {
          name: vmData.name,
          code: vmData.code,
          bare_metal_id: vmData.bare_metal_id === "" ? null : Number(vmData.bare_metal_id),
          bare_metal_node_id: vmData.bare_metal_node_id === "" ? null : Number(vmData.bare_metal_node_id),
          vmid: vmData.vmid.trim() === "" ? null : vmData.vmid,
          cpu: vmData.cpu === "" ? null : Number(vmData.cpu),
          memory: vmData.memory === "" ? null : Number(vmData.memory) * 1024 * 1024 * 1024,
          disk: vmData.disk === "" ? null : Number(vmData.disk) * 1024 * 1024 * 1024,
        },
        virtual_machine_config: {
            ...configData,
            threshold_disk: configData.threshold_disk === "" ? null : Number(configData.threshold_disk)
        }
      };

      const response = await fetch('http://127.0.0.1:3000/virtual-machine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create VM.");
      }
      
      toast.success("VM Created Successfully!", {
        id: toastId,
        description: `Virtual machine "${vmData.name}" is now available.`
      });

      router.refresh();
      router.push('/vm');

    } catch (err: any) {
      toast.error("Creation Failed", {
        id: toastId,
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Kita bungkus dengan tag form agar validasi 'required' tetap berfungsi
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Saat form di-submit (misal dengan enter), trigger AlertDialog-nya
        document.getElementById('create-vm-trigger')?.click();
      }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the core details of the virtual machine.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">VM Name <span className="text-red-500">*</span></Label>
            <Input id="name" value={vmData.name} onChange={(e) => setVmData(prev => ({...prev, name: e.target.value}))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vmid">VM ID</Label>
            <Input id="vmid" value={vmData.vmid} onChange={(e) => setVmData(prev => ({...prev, vmid: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
            <Input id="code" value={vmData.code} onChange={(e) => setVmData(prev => ({...prev, code: e.target.value}))} required />
          </div>
          <div className="space-y-2"><Label htmlFor="bare_metal_id">Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
          <div className="space-y-2"><Label htmlFor="bare_metal_node_id">Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
          <div className="space-y-2"><Label htmlFor="cpu">CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
          <div className="space-y-2"><Label htmlFor="memory">Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
          <div className="space-y-2"><Label htmlFor="disk">Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
          <CardDescription>Set up monitoring alerts for this VM.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between"><Label htmlFor="is_alert_status">Enable Status Alert</Label><Switch id="is_alert_status" checked={configData.is_alert_status} onCheckedChange={(c) => handleSwitchChange(c, "is_alert_status")} /></div>
          <div className="flex items-center justify-between"><Label htmlFor="is_alert_disk">Enable Disk Usage Alert</Label><Switch id="is_alert_disk" checked={configData.is_alert_disk} onCheckedChange={(c) => handleSwitchChange(c, "is_alert_disk")} /></div>
          <div className="space-y-2">
            <Label htmlFor="threshold_disk">Disk Threshold (%)</Label>
            <Input id="threshold_disk" type="number" min="0" max="100" value={configData.threshold_disk} onChange={handleThresholdChange} placeholder="e.g., 85" />
          </div>
        </CardContent>
      </Card>

      {/* -- 4. Ganti grup tombol dengan AlertDialog -- */}
      <div className="flex justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button id="create-vm-trigger" type="button" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Virtual Machine"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Creation</AlertDialogTitle>
              <AlertDialogDescription>
                This will create a new virtual machine with the provided details. Are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Tombol Cancel tetap di luar agar tidak perlu konfirmasi */}
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
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
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal, CheckCircle } from "lucide-react";

// export function VmForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [vmData, setVmData] = useState({
//     bare_metal_id: "",
//     bare_metal_node_id: "",
//     vmid: "",
//     code: "",
//     name: "",
//     cpu: "",
//     memory: "",
//     disk: "",
//   });

//   const [configData, setConfigData] = useState({
//     is_alert_status: false,
//     is_alert_disk: false,
//     threshold_disk: "",
//   });

//   const handleNumericChange = (
//     e: React.ChangeEvent<HTMLInputElement>, 
//     setter: React.Dispatch<React.SetStateAction<any>>
//   ) => {
//     const { id, value } = e.target;
//     if (Number(value) < 0) return;
//     setter((prev: any) => ({ ...prev, [id]: value }));
//   };
  
//   const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     const numValue = Number(value);
//     if (numValue < 0) return;
//     if (numValue > 100) return;
//     setConfigData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSwitchChange = (checked: boolean, id: 'is_alert_status' | 'is_alert_disk') => {
//     setConfigData((prev) => ({ ...prev, [id]: checked }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     const token = Cookies.get('auth_token');

//     try {
//       // -- PERUBAHAN DI SINI: Ubah string kosong menjadi null untuk field opsional --
//       const payload = {
//         virtual_machine: {
//           name: vmData.name, // Wajib
//           code: vmData.code, // Wajib
//           bare_metal_id: vmData.bare_metal_id === "" ? null : Number(vmData.bare_metal_id),
//           bare_metal_node_id: vmData.bare_metal_node_id === "" ? null : Number(vmData.bare_metal_node_id),
//           vmid: vmData.vmid.trim() === "" ? null : vmData.vmid,
//           cpu: vmData.cpu === "" ? null : Number(vmData.cpu),
//           memory: vmData.memory === "" ? null : Number(vmData.memory) * 1024 * 1024 * 1024,
//           disk: vmData.disk === "" ? null : Number(vmData.disk) * 1024 * 1024 * 1024,
//         },
//         virtual_machine_config: {
//             ...configData,
//             threshold_disk: configData.threshold_disk === "" ? null : Number(configData.threshold_disk)
//         }
//       };

//       const response = await fetch('http://127.0.0.1:3000/virtual-machine', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create VM.");
//       }
      
//       router.refresh();
//       router.push('/vm');

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//           <CardDescription>Enter the core details of the virtual machine.</CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label htmlFor="name">VM Name <span className="text-red-500">*</span></Label>
//             <Input id="name" value={vmData.name} onChange={(e) => setVmData(prev => ({...prev, name: e.target.value}))} required />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="vmid">VM ID</Label>
//             <Input id="vmid" value={vmData.vmid} onChange={(e) => setVmData(prev => ({...prev, vmid: e.target.value}))} />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
//             <Input id="code" value={vmData.code} onChange={(e) => setVmData(prev => ({...prev, code: e.target.value}))} required />
//           </div>
//           <div className="space-y-2"><Label htmlFor="bare_metal_id">Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
//           <div className="space-y-2"><Label htmlFor="bare_metal_node_id">Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
//           <div className="space-y-2"><Label htmlFor="cpu">CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
//           <div className="space-y-2"><Label htmlFor="memory">Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
//           <div className="space-y-2"><Label htmlFor="disk">Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleNumericChange(e, setVmData)} /></div>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>Alert Configuration</CardTitle>
//           <CardDescription>Set up monitoring alerts for this VM.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between"><Label htmlFor="is_alert_status">Enable Status Alert</Label><Switch id="is_alert_status" checked={configData.is_alert_status} onCheckedChange={(c) => handleSwitchChange(c, "is_alert_status")} /></div>
//           <div className="flex items-center justify-between"><Label htmlFor="is_alert_disk">Enable Disk Usage Alert</Label><Switch id="is_alert_disk" checked={configData.is_alert_disk} onCheckedChange={(c) => handleSwitchChange(c, "is_alert_disk")} /></div>
//           <div className="space-y-2">
//             <Label htmlFor="threshold_disk">Disk Threshold (%)</Label>
//             <Input id="threshold_disk" type="number" min="0" max="100" value={configData.threshold_disk} onChange={handleThresholdChange} placeholder="e.g., 85" />
//           </div>
//         </CardContent>
//       </Card>

//       {error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>An Error Occurred</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

//       <div className="flex justify-end gap-2">
//         <Button type="button" variant="outline" onClick={() => router.back()}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Creating..." : "Create Virtual Machine"}
//         </Button>
//       </div>
//     </form>
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
// import { Terminal } from "lucide-react";

// export function VmForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [vmData, setVmData] = useState({
//     bare_metal_id: "",
//     bare_metal_node_id: "",
//     vmid: "",
//     code: "",
//     name: "",
//     cpu: "",
//     memory: "",
//     disk: "",
//   });

//   const [configData, setConfigData] = useState({
//     is_alert_status: false,
//     is_alert_disk: false,
//     threshold_disk: "",
//   });

//   const handleNumericChange = (
//     e: React.ChangeEvent<HTMLInputElement>, 
//     setter: React.Dispatch<React.SetStateAction<any>>
//   ) => {
//     const { id, value } = e.target;
//     if (Number(value) < 0) return;
//     setter((prev: any) => ({ ...prev, [id]: value }));
//   };
  
//   const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     const numValue = Number(value);
//     if (numValue < 0) return;
//     if (numValue > 100) return;
//     setConfigData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSwitchChange = (checked: boolean, id: 'is_alert_status' | 'is_alert_disk') => {
//     setConfigData((prev) => ({ ...prev, [id]: checked }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     const token = Cookies.get('auth_token');

//     try {
//       const payload = {
//         virtual_machine: {
//           ...vmData,
//           bare_metal_id: Number(vmData.bare_metal_id),
//           bare_metal_node_id: Number(vmData.bare_metal_node_id),
//           cpu: Number(vmData.cpu),
//           memory: Number(vmData.memory) * 1024 * 1024 * 1024, 
//           disk: Number(vmData.disk) * 1024 * 1024 * 1024,
//         },
//         virtual_machine_config: {
//             ...configData,
//             threshold_disk: Number(configData.threshold_disk)
//         }
//       };

//       const response = await fetch('http://127.0.0.1:3000/virtual-machine', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create VM.");
//       }
      
//       router.refresh();
//       router.push('/vm');

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//           <CardDescription>Enter the core details of the virtual machine.</CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2"><Label htmlFor="name">VM Name</Label><Input id="name" value={vmData.name} onChange={(e) => setVmData(prev => ({...prev, name: e.target.value}))} required /></div>
//           <div className="space-y-2"><Label htmlFor="vmid">VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => setVmData(prev => ({...prev, vmid: e.target.value}))} required /></div>
//           <div className="space-y-2"><Label htmlFor="code">Code</Label><Input id="code" value={vmData.code} onChange={(e) => setVmData(prev => ({...prev, code: e.target.value}))} /></div>
//           <div className="space-y-2"><Label htmlFor="bare_metal_id">Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleNumericChange(e, setVmData)} required /></div>
//           <div className="space-y-2"><Label htmlFor="bare_metal_node_id">Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleNumericChange(e, setVmData)} required /></div>
//           <div className="space-y-2"><Label htmlFor="cpu">CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleNumericChange(e, setVmData)} required /></div>
//           <div className="space-y-2"><Label htmlFor="memory">Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleNumericChange(e, setVmData)} required /></div>
//           <div className="space-y-2"><Label htmlFor="disk">Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleNumericChange(e, setVmData)} required /></div>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>Alert Configuration</CardTitle>
//           <CardDescription>Set up monitoring alerts for this VM.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between"><Label htmlFor="is_alert_status">Enable Status Alert</Label><Switch id="is_alert_status" checked={configData.is_alert_status} onCheckedChange={(c) => handleSwitchChange(c, "is_alert_status")} /></div>
//           <div className="flex items-center justify-between"><Label htmlFor="is_alert_disk">Enable Disk Usage Alert</Label><Switch id="is_alert_disk" checked={configData.is_alert_disk} onCheckedChange={(c) => handleSwitchChange(c, "is_alert_disk")} /></div>
//           <div className="space-y-2">
//             <Label htmlFor="threshold_disk">Disk Threshold (%)</Label>
//             <Input id="threshold_disk" type="number" min="0" max="100" value={configData.threshold_disk} onChange={handleThresholdChange} placeholder="e.g., 85" />
//           </div>
//         </CardContent>
//       </Card>

//       {error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>An Error Occurred</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

//       {/* -- PERUBAHAN DI SINI -- */}
//       <div className="flex justify-end gap-2">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => router.back()}
//         >
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? "Creating..." : "Create Virtual Machine"}
//         </Button>
//       </div>
//     </form>
//   );
// }