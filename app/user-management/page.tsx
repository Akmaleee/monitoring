"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { getColumns, User } from "./columns";
import { DataTable } from "./data-table";
import { DataTableSkeleton } from "@/app/bare-metal/data-table-skeleton";
import { AddUserDialog } from "./add-user-dialog";
import { useUserRole } from "@/hooks/use-user-role";

async function getData(token: string): Promise<User[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users`, {
    cache: 'no-store',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res.status === 401 || res.status === 403) throw new Error('Token is invalid or expired');
  if (!res.ok) throw new Error('Failed to fetch data from API');
  const responseData = await res.json();
  return responseData?.data || [];
}

export default function UserManagementPage() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useUserRole();

  const fetchAndSetData = useCallback(async () => {
    if (!isLoading) setIsLoading(true);
    const token = await getCookie('auth_token');

    if (token) {
      try {
        const fetchedData = await getData(token);
        setData(fetchedData);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        if (error.message === 'Token is invalid or expired') {
          deleteCookie('auth_token');
          window.location.href = '/login';
        }
      }
    } else {
      window.location.href = '/login';
    }
    setIsLoading(false);
  }, [isLoading]);

  useEffect(() => {
    fetchAndSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = getColumns(fetchAndSetData);

  if (isLoading && data.length === 0) return <DataTableSkeleton />;
  if (error) return <div><p className="text-red-500">Error: {error}</p></div>;
  if (!isAdmin) return <div><p className="text-red-500">Access Denied</p></div>

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        titleComponent={<h1 className="text-2xl font-bold whitespace-nowrap">User Management</h1>}
        actionComponent={<AddUserDialog onUserAdded={fetchAndSetData} />}
      />
    </div>
  );
}