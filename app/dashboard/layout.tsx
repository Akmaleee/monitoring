import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { AppSidebar } from "@/components/app-sidebar";
import { 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { User } from 'lucide-react'; // <-- Impor ikon User

interface UserPayload { name: string; role: { Role: { name: string } }[]; }
interface DecodedToken { user: UserPayload; }

export default async function DashboardLayout({
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
            </div>
            {/* -- PERUBAHAN STYLING DI SINI -- */}
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

// import { cookies } from 'next/headers';
// import { jwtDecode } from 'jwt-decode';
// import { AppSidebar } from "@/components/app-sidebar";
// import { 
//   SidebarProvider, 
//   SidebarTrigger,
//   SidebarInset
// } from "@/components/ui/sidebar";

// // Definisikan tipe untuk payload token agar kode lebih aman
// interface UserPayload {
//   name: string;
//   role: { Role: { name: string } }[];
// }

// interface DecodedToken {
//   user: UserPayload;
// }

// // 1. Ubah komponen menjadi 'async'
// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // 2. Baca dan decode cookie di server
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;
//   let userName: string | null = null;
//   let userRole: string | null = null;

//   if (token) {
//     try {
//       const decoded = jwtDecode<DecodedToken>(token);
//       userName = decoded.user?.name;
//       userRole = decoded.user?.role?.[0]?.Role?.name;
//     } catch (error) {
//       console.error("Invalid token:", error);
//       // Biarkan null jika token tidak valid
//     }
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <div className="p-4 md:p-8">
//           {/* 3. Buat header baru untuk menampung trigger dan pesan selamat datang */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <SidebarTrigger />
//             </div>
//             {userName && userRole && (
//               <p className="text-sm text-muted-foreground">
//                 Welcome <span className="font-semibold capitalize">{userRole}</span>, <span className="font-semibold">{userName}</span>
//               </p>
//             )}
//           </div>
//           {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }


// import { AppSidebar } from "@/components/app-sidebar";
// import { 
//   SidebarProvider, 
//   SidebarTrigger,
//   SidebarInset
// } from "@/components/ui/sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <div className="p-4 md:p-8">
//           <SidebarTrigger />
//           {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }