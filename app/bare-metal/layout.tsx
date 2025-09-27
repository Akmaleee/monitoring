import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { AppSidebar } from "@/components/app-sidebar";
import { 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { User } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs'; // <-- 1. Impor komponen Breadcrumbs

interface UserPayload { name: string; role: { Role: { name: string } }[]; }
interface DecodedToken { user: UserPayload; }

export default async function MonitoringLayout({
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
              {/* -- 2. Tambahkan komponen Breadcrumbs di sini -- */}
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

// import { cookies } from 'next/headers';
// import { jwtDecode } from 'jwt-decode';
// import { AppSidebar } from "@/components/app-sidebar";
// import { 
//   SidebarProvider, 
//   SidebarTrigger,
//   SidebarInset
// } from "@/components/ui/sidebar";
// import { User } from 'lucide-react'; // <-- Impor ikon User

// interface UserPayload { name: string; role: { Role: { name: string } }[]; }
// interface DecodedToken { user: UserPayload; }

// export default async function MonitoringLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth_token')?.value;
//   let userName: string = "User";
//   let userRole: string = "Guest";

//   if (token) {
//     try {
//       const decoded = jwtDecode<DecodedToken>(token);
//       userName = decoded.user?.name || "User";
//       userRole = decoded.user?.role?.[0]?.Role?.name || "Guest";
//     } catch (error) {
//       console.error("Invalid token:", error);
//     }
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <div className="p-4 md:p-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <SidebarTrigger />
//             </div>
//             {/* -- PERUBAHAN STYLING DI SINI -- */}
//             {userName && userRole && (
//               <div className="flex items-center gap-x-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
//                 <User className="h-4 w-4" />
//                 <span>
//                   Welcome <span className="font-semibold capitalize text-foreground">{userRole}</span>, <span className="font-semibold text-foreground">{userName}</span>
//                 </span>
//               </div>
//             )}
//           </div>
//           {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// import { cookies } from 'next/headers';
// import { jwtDecode } from 'jwt-decode';
// import { AppSidebar } from "@/components/app-sidebar";
// import { 
//   SidebarProvider, 
//   SidebarTrigger,
//   SidebarInset
// } from "@/components/ui/sidebar";

// interface UserPayload {
//   name: string;
//   role: { Role: { name: string } }[];
// }

// interface DecodedToken {
//   user: UserPayload;
// }

// export default async function MonitoringLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // -- PERBAIKAN DI SINI: tambahkan 'await' --
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
//     }
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <div className="p-4 md:p-8">
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

// export default function MonitoringLayout({
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

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";

// // Impor komponen yang dibutuhkan untuk sidebar
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
//       >
//         <SidebarProvider>
//           {/* Pembungkus Flexbox ini akan mengatur layout */}
//           <div className="flex min-h-screen">
//             <AppSidebar />
            
//             {/* Area konten utama yang mengisi sisa ruang */}
//             <main className="flex-1 p-4 md:p-8">
//               <SidebarTrigger />
//               {children}
//             </main>
//           </div>
//         </SidebarProvider>
//       </body>
//     </html>
//   );
// }

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";

// // Impor komponen yang dibutuhkan untuk sidebar
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <SidebarProvider>
//           <AppSidebar />
//           <main>
//             <SidebarTrigger />
//             {children}
//           </main>
//         </SidebarProvider>
//       </body>
//     </html>
//   );
// }