"use client"

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
import { Badge } from "@/components/ui/badge"
import { EditUserDialog } from "./edit-user-dialog"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { cn } from "@/lib/utils"; // <-- Impor cn

export type User = {
  id: number
  name: string
  username: string
  role: { Role: { name: string } }[]
  is_active: boolean
}

export const getColumns = (
  onUpdate: () => void
): ColumnDef<User>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const roles = row.original.role.map(r => r.Role.name).join(", ");
      // Gunakan kelas 'capitalize' jika ingin huruf depan besar
      return <Badge className="capitalize">{roles}</Badge>;
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      return (
          <Badge
            // Gunakan cn untuk menggabungkan kelas secara kondisional
            className={cn(
              isActive
                ? "bg-green-600 text-white hover:bg-green-700" // Kelas untuk status Active
                : "" // Biarkan kosong agar variant="secondary" dari else yang bekerja
            )}
            variant={isActive ? "default" : "secondary"} // Tetap gunakan variant secondary untuk Inactive
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <EditUserDialog user={user} onUserUpdated={onUpdate} />
                  <DropdownMenuSeparator />
                  <ConfirmDeleteDialog
                    itemId={user.id}
                    itemName={user.name}
                    itemType="User"
                    deleteEndpoint={`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users`}
                    onActionSuccess={onUpdate}
                    requirePassword={false}
                  />
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
]