"use client";

import { useState } from "react";
import { getCookie } from 'cookies-next';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface AddUserDialogProps { onUserAdded: () => void; }

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", role_id: "", is_active: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { id, value } = e.target; setFormData((prev) => ({ ...prev, [id]: value })); };
  const handleSelectChange = (id: 'role_id' | 'is_active', value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Creating new user...");
    const token = getCookie('auth_token');
    try {
        const payload = {
            ...formData,
            role_id: parseInt(formData.role_id, 10),
            is_active: formData.is_active === 'true'
        };
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }, body: JSON.stringify(payload), });
      if (!response.ok) { const errorData = await response.json().catch(() => ({ message: "An unexpected error occurred." })); throw new Error(errorData.message || "Failed to add new user."); }
      toast.success("Creation Successful!", { id: toastId, description: `User "${formData.name}" has been created.`, });
      onUserAdded();
      setIsOpen(false);
      setFormData({ name: "", username: "", role_id: "", is_active: "" });
    } catch (err: any)      {
      toast.error("Creation Failed", { id: toastId, description: err.message, });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim() !== '' && formData.username.trim() !== '' && formData.role_id !== '' && formData.is_active !== '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form>
          {/* PERUBAHAN DI SINI: 'items-center' menjadi 'items-start' */}
          <div className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-3 py-4">
            <Label htmlFor="name" className="text-right pt-2">Name <span className="text-red-500">*</span></Label>
            <Input id="name" value={formData.name} onChange={handleChange} required />

            <Label htmlFor="username" className="text-right pt-2">Username <span className="text-red-500">*</span></Label>
            <div>
              <Input id="username" value={formData.username} onChange={handleChange} required />
              <p className="text-xs text-muted-foreground mt-1">
                Username harus sama dengan username ELDAB.
              </p>
            </div>

            <Label htmlFor="role_id" className="text-right pt-2">Role <span className="text-red-500">*</span></Label>
            <Select onValueChange={(value) => handleSelectChange('role_id', value)} value={formData.role_id} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">User</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="is_active" className="text-right pt-2">Status <span className="text-red-500">*</span></Label>
            <Select onValueChange={(value) => handleSelectChange('is_active', value)} value={formData.is_active} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
            </Select>
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
                            This action will create a new user. Please ensure all data is correct before proceeding.
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