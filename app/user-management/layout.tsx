import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { AppSidebar } from "@/components/app-sidebar";
import { 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { User } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: "User Management",
  description: "User Management",
  icons: {
    icon: "/logo_tsat.png",
  },
};

interface UserPayload { name: string; role: { Role: { name: string } }[]; }
interface DecodedToken { user: UserPayload; }

export default async function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  let userName: string = "User";
  let userRole: string = "Guest";

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      userName = decoded.user?.name || "User";
      userRole = decoded.user?.role?.[0]?.Role?.name || "Guest";
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Breadcrumbs />
            </div>
            {userName && userRole && (
              <div className="flex items-center gap-x-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  Welcome <span className="font-semibold capitalize text-foreground">{userRole}</span>, <span className="font-semibold text-foreground">{userName}</span>
                </span>
              </div>
            )}
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}