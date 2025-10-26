"use client";

import { useState, useEffect } from "react";
import { getCookie } from 'cookies-next';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User } from "./columns";
import { toast } from "sonner";

interface EditUserDialogProps {
  user: User;
  onUserUpdated: () => void;
}

export function EditUserDialog({ user, onUserUpdated }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", role_id: "", is_active: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        role_id: user.role[0]?.Role.name.toLowerCase() === 'admin' ? '1' : '2',
        is_active: user.is_active ? 'true' : 'false'
      });
    }
  }, [isOpen, user]);

  const handleSelectChange = (id: 'role_id' | 'is_active', value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Updating user...");

    const token = getCookie('auth_token');

    try {
        const payload = {
            ...formData,
            role_id: parseInt(formData.role_id, 10),
            is_active: formData.is_active === 'true'
        };
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user.");
      }
      
      toast.success("Update Successful!", {
        id: toastId,
        description: `User "${formData.name}" has been updated.`,
      });
      
      onUserUpdated();
      setIsOpen(false);

    } catch (err: any) {
      toast.error("Update Failed", { id: toastId, description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim() !== '' && formData.username.trim() !== '' && formData.role_id !== '' && formData.is_active !== '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.name}</DialogTitle>
          <DialogDescription>
            Update the details below. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form>
          {/* PERUBAHAN DI SINI: 'items-center' menjadi 'items-start' */}
          <div className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-3 py-4">
            <Label htmlFor="name" className="text-right pt-2">Name <span className="text-red-500">*</span></Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} required />

            <Label htmlFor="username" className="text-right pt-2">Username <span className="text-red-500">*</span></Label>
            <div>
                <Input id="username" value={formData.username} onChange={(e) => setFormData(p => ({...p, username: e.target.value}))} required />
                <p className="text-xs text-muted-foreground mt-1">
                    Username harus sama dengan username ELDAB.
                </p>
            </div>
            
            <Label htmlFor="role_id" className="text-right pt-2">Role <span className="text-red-500">*</span></Label>
            <Select onValueChange={(value) => handleSelectChange('role_id', value)} value={formData.role_id} required>
              <SelectTrigger id="role_id">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">User</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="is_active" className="text-right pt-2">Status <span className="text-red-500">*</span></Label>
            <Select onValueChange={(value) => handleSelectChange('is_active', value)} value={formData.is_active} required>
                <SelectTrigger id="is_active">
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