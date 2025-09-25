"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";
import { VirtualMachineDetail } from "../columns";

interface EditVmFormProps {
  initialData: VirtualMachineDetail;
}

const bytesToGB = (bytes: number) => bytes / (1024 ** 3);
const gbToBytes = (gb: number) => gb * (1024 ** 3);

export function EditVmForm({ initialData }: EditVmFormProps) {
  const router = useRouter();
  
  const [vmData, setVmData] = useState({
    bare_metal_id: initialData.bare_metal_id,
    bare_metal_node_id: initialData.bare_metal_node_id,
    vmid: initialData.vmid,
    code: initialData.code,
    name: initialData.name,
    cpu: initialData.cpu,
    memory: bytesToGB(initialData.memory),
    disk: bytesToGB(initialData.disk),
  });
  const [vmLoading, setVmLoading] = useState(false);
  const [vmError, setVmError] = useState<string | null>(null);
  const [vmSuccess, setVmSuccess] = useState<string | null>(null);

  const [configData, setConfigData] = useState({
    virtual_machine_id: initialData.id,
    is_alert_status: initialData.virtual_machine_config.is_alert_status,
    is_alert_disk: initialData.virtual_machine_config.is_alert_disk,
    threshold_disk: initialData.virtual_machine_config.threshold_disk,
  });
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const { id, value } = e.target;
    if (Number(value) < 0) return;
    setter((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleVmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVmLoading(true);
    setVmError(null);
    setVmSuccess(null);
    const token = Cookies.get('auth_token');

    try {
      const payload = {
        bare_metal_id: Number(vmData.bare_metal_id),
        bare_metal_node_id: Number(vmData.bare_metal_node_id),
        vmid: vmData.vmid,
        code: vmData.code,
        name: vmData.name,
        cpu: Number(vmData.cpu),
        memory: gbToBytes(Number(vmData.memory)),
        disk: gbToBytes(Number(vmData.disk)),
      };

      const response = await fetch(`http://127.0.0.1:3000/virtual-machine/${initialData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update VM details.");
      setVmSuccess("VM details updated successfully!");
      router.refresh();

    } catch (err: any) {
      setVmError(err.message);
    } finally {
      setVmLoading(false);
    }
  };
  
  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigLoading(true);
    setConfigError(null);
    setConfigSuccess(null);
    const token = Cookies.get('auth_token');
    const configId = initialData.virtual_machine_config.id;

    try {
        const payload = {
            virtual_machine_id: configData.virtual_machine_id,
            is_alert_status: configData.is_alert_status,
            is_alert_disk: configData.is_alert_disk,
            threshold_disk: Number(configData.threshold_disk),
        };
        
        // -- PERBAIKAN ENDPOINT DI SINI --
        const response = await fetch(`http://127.0.0.1:3000/virtual-machine/config/${configId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update VM configuration.");
        setConfigSuccess("VM configuration updated successfully!");
        router.refresh();

    } catch (err: any) {
        setConfigError(err.message);
    } finally {
        setConfigLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleVmSubmit}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>VM Name</Label><Input id="name" value={vmData.name} onChange={(e) => handleChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>VM ID</Label><Input id="vmid" value={vmData.vmid} onChange={(e) => handleChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Code</Label><Input id="code" value={vmData.code} onChange={(e) => handleChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Bare Metal ID</Label><Input id="bare_metal_id" type="number" min="0" value={vmData.bare_metal_id} onChange={(e) => handleChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Node ID</Label><Input id="bare_metal_node_id" type="number" min="0" value={vmData.bare_metal_node_id} onChange={(e) => handleChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>CPU Cores</Label><Input id="cpu" type="number" min="0" value={vmData.cpu} onChange={(e) => handleChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Memory (GB)</Label><Input id="memory" type="number" min="0" value={vmData.memory} onChange={(e) => handleChange(e, setVmData)} /></div>
            <div className="space-y-2"><Label>Disk (GB)</Label><Input id="disk" type="number" min="0" value={vmData.disk} onChange={(e) => handleChange(e, setVmData)} /></div>
          </CardContent>
          <div className="px-6 pb-6">
            {vmSuccess && <Alert className="mb-4 border-green-500 text-green-500"><CheckCircle className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>{vmSuccess}</AlertDescription></Alert>}
            {vmError && <Alert variant="destructive" className="mb-4"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{vmError}</AlertDescription></Alert>}
            <div className="flex justify-end"><Button type="submit" disabled={vmLoading}>{vmLoading ? "Saving..." : "Save VM Details"}</Button></div>
          </div>
        </Card>
      </form>

      <form onSubmit={handleConfigSubmit}>
        <Card>
          <CardHeader><CardTitle>Alert Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between"><Label>Enable Status Alert</Label><Switch checked={configData.is_alert_status} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_status: c}))} /></div>
            <div className="flex items-center justify-between"><Label>Enable Disk Usage Alert</Label><Switch checked={configData.is_alert_disk} onCheckedChange={(c) => setConfigData(p => ({...p, is_alert_disk: c}))} /></div>
            <div className="space-y-2"><Label>Disk Threshold (%)</Label><Input type="number" min="0" max="100" value={configData.threshold_disk} onChange={(e) => { const v = e.target.value; if (Number(v) <= 100) setConfigData(p => ({...p, threshold_disk: Number(v)})); }} /></div>
          </CardContent>
          <div className="px-6 pb-6">
            {configSuccess && <Alert className="mb-4 border-green-500 text-green-500"><CheckCircle className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>{configSuccess}</AlertDescription></Alert>}
            {configError && <Alert variant="destructive" className="mb-4"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{configError}</AlertDescription></Alert>}
            <div className="flex justify-end"><Button type="submit" disabled={configLoading}>{configLoading ? "Saving..." : "Save Configuration"}</Button></div>
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