"use client"

import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Server,
  Monitor,
  Network,
  Database,
  LogOut
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
} from "@/components/ui/alert-dialog"; // 1. Impor komponen AlertDialog
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

// ... (menuItems dan findActiveGroups tetap sama)
const menuItems = [ { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, }, { title: "IT Infra", icon: Network, items: [ { title: "Baremetal", url: "/bare-metal", icon: Server, }, { title: "VM", url: "/vm", icon: Monitor, }, { title: "NMS", icon: Database, items: [ { title: "Zabbix", url: "/zabbix", icon: () => <div className="w-4 h-4" />, } ] } ], }, ];
const findActiveGroups = (items: any[], currentPath: string): string[] => { for (const item of items) { if (item.items) { const isAnyChildActive = item.items.some( (subItem: any) => subItem.url && currentPath.startsWith(subItem.url) ); if (isAnyChildActive) { const nestedGroups = findActiveGroups(item.items, currentPath); return [item.title, ...nestedGroups]; } const nestedGroups = findActiveGroups(item.items, currentPath); if (nestedGroups.length > 0) { return [item.title, ...nestedGroups]; } } } return []; };

export function AppSidebar() {
  const pathname = usePathname();
  const activeGroups = findActiveGroups(menuItems, pathname);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_role");
    window.location.href = "/login";
  };
  
  const renderMenu = (items: any[]) => {
    // ... (Fungsi renderMenu tidak berubah)
    return items.map((item) => {
      if (item.items) {
        return (
          <AccordionItem key={item.title} value={item.title} className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-x-3">
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
              <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
                {renderMenu(item.items)}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        );
      }
      const isActive = item.url === pathname || (item.url !== "/" && pathname.startsWith(item.url));
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild className={`justify-start ${isActive ? 'bg-secondary' : 'hover:bg-muted'}`}>
            <a href={item.url}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  if (!hasMounted) {
    return null; 
  }

  return (
    <Sidebar>
      <SidebarContent className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
            <img src="/logo_tsat.png" alt="TSAT Logo" width={32} height={32} className="rounded-full" />
            <h1 className="font-semibold text-lg">Infrastructure</h1>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
                {renderMenu(menuItems)}
              </Accordion>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* -- 2. Ganti tombol logout dengan dialog konfirmasi -- */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be returned to the login page and your current session will end.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}


// "use client"

// import { usePathname } from "next/navigation";
// import Cookies from "js-cookie"
// import {
//   LayoutDashboard,
//   Server,
//   Monitor,
//   Network,
//   Database,
//   LogOut
// } from "lucide-react"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar"

// // ... (Struktur data menuItems dan fungsi findActiveGroups tidak berubah)
// const menuItems = [ { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, }, { title: "IT Infra", icon: Network, items: [ { title: "Baremetal", url: "/bare-metal", icon: Server, }, { title: "VM", url: "/vm", icon: Monitor, }, { title: "NMS", icon: Database, items: [ { title: "Zabbix", url: "/zabbix", icon: () => <div className="w-4 h-4" />, } ] } ], }, ];
// const findActiveGroups = (items: any[], currentPath: string): string[] => { for (const item of items) { if (item.items) { const isAnyChildActive = item.items.some( (subItem: any) => subItem.url && currentPath.startsWith(subItem.url) ); if (isAnyChildActive) { const nestedGroups = findActiveGroups(item.items, currentPath); return [item.title, ...nestedGroups]; } const nestedGroups = findActiveGroups(item.items, currentPath); if (nestedGroups.length > 0) { return [item.title, ...nestedGroups]; } } } return []; };

// export function AppSidebar() {
//   const pathname = usePathname();
//   const activeGroups = findActiveGroups(menuItems, pathname);

//   // State hasMounted sudah tidak diperlukan lagi
//   // const [hasMounted, setHasMounted] = useState(false);
//   // useEffect(() => { setHasMounted(true); }, []);

//   const handleLogout = () => {
//     Cookies.remove("auth_token")
//     window.location.href = "/login"
//   }
  
//   const renderMenu = (items: any[]) => {
//     // ... (Fungsi renderMenu tidak berubah)
//     return items.map((item) => {
//       if (item.items) {
//         return (
//           <AccordionItem key={item.title} value={item.title} className="border-none">
//             <AccordionTrigger className="py-2 hover:no-underline">
//               <div className="flex items-center gap-x-3">
//                 <item.icon className="h-4 w-4" />
//                 <span>{item.title}</span>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="pl-7">
//               <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
//                 {renderMenu(item.items)}
//               </Accordion>
//             </AccordionContent>
//           </AccordionItem>
//         );
//       }
//       const isActive = item.url === pathname || (item.url !== "/" && pathname.startsWith(item.url));
//       return (
//         <SidebarMenuItem key={item.title}>
//           <SidebarMenuButton asChild className={`justify-start ${isActive ? 'bg-secondary' : 'hover:bg-muted'}`}>
//             <a href={item.url}>
//               <item.icon className="h-4 w-4" />
//               <span>{item.title}</span>
//             </a>
//           </SidebarMenuButton>
//         </SidebarMenuItem>
//       );
//     });
//   };

//   return (
//     <Sidebar>
//       <SidebarContent className="flex h-full flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
//             <img src="/logo_tsat.png" alt="TSAT Logo" width={32} height={32} className="rounded-full" />
//             <h1 className="font-semibold text-lg">Infrastructure</h1>
//           </div>
//           <SidebarGroup>
//             <SidebarGroupLabel>Application</SidebarGroupLabel>
//             <SidebarGroupContent>
//               {/* Logika hasMounted dihapus, accordion dirender langsung */}
//               <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
//                 {renderMenu(menuItems)}
//               </Accordion>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </div>
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton onClick={handleLogout}>
//                   <LogOut className="h-4 w-4" />
//                   <span>Logout</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }


// "use client"

// import { usePathname } from "next/navigation";
// import Cookies from "js-cookie"
// import {
//   LayoutDashboard,
//   Server,
//   Monitor,
//   Network,
//   Database,
//   LogOut
// } from "lucide-react"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar"

// const menuItems = [ { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, }, { title: "IT Infra", icon: Network, items: [ { title: "Baremetal", url: "/bare-metal", icon: Server, }, { title: "VM", url: "/vm", icon: Monitor, }, { title: "NMS", icon: Database, items: [ { title: "Zabbix", url: "/zabbix", icon: () => <div className="w-4 h-4" />, } ] } ], }, ];

// const findActiveGroups = (items: any[], currentPath: string): string[] => {
//   for (const item of items) {
//     if (item.items) {
//       const isAnyChildActive = item.items.some(
//         (subItem: any) => subItem.url && currentPath.startsWith(subItem.url)
//       );
//       if (isAnyChildActive) {
//         const nestedGroups = findActiveGroups(item.items, currentPath);
//         return [item.title, ...nestedGroups];
//       }
//       const nestedGroups = findActiveGroups(item.items, currentPath);
//       if (nestedGroups.length > 0) {
//         return [item.title, ...nestedGroups];
//       }
//     }
//   }
//   return [];
// };

// export function AppSidebar() {
//   const pathname = usePathname();
//   const activeGroups = findActiveGroups(menuItems, pathname);

//   const handleLogout = () => {
//     Cookies.remove("auth_token")
//     window.location.href = "/login"
//   }
  
//   const renderMenu = (items: any[]) => {
//     return items.map((item) => {
//       if (item.items) {
//         return (
//           <AccordionItem key={item.title} value={item.title} className="border-none">
//             <AccordionTrigger className="py-2 hover:no-underline">
//               <div className="flex items-center gap-x-3">
//                 <item.icon className="h-4 w-4" />
//                 <span>{item.title}</span>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="pl-7">
//               <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
//                 {renderMenu(item.items)}
//               </Accordion>
//             </AccordionContent>
//           </AccordionItem>
//         );
//       }
      
//       const isActive = item.url === pathname || (item.url !== "/" && pathname.startsWith(item.url));

//       return (
//         <SidebarMenuItem key={item.title}>
//           {/* -- PERBAIKAN DI SINI: Hapus 'w-full' -- */}
//           <SidebarMenuButton
//             asChild
//             className={`justify-start ${isActive ? 'bg-secondary' : 'hover:bg-muted'}`}
//           >
//             <a href={item.url}>
//               <item.icon className="h-4 w-4" />
//               <span>{item.title}</span>
//             </a>
//           </SidebarMenuButton>
//         </SidebarMenuItem>
//       );
//     });
//   };

//   return (
//     <Sidebar>
//       <SidebarContent className="flex h-full flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
//             <img
//               src="/logo_tsat.png"
//               alt="TSAT Logo"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//             <h1 className="font-semibold text-lg">Infrastructure</h1>
//           </div>

//           <SidebarGroup>
//             <SidebarGroupLabel>Application</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
//                 {renderMenu(menuItems)}
//               </Accordion>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </div>

//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton onClick={handleLogout}>
//                   <LogOut className="h-4 w-4" />
//                   <span>Logout</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }

// "use client"

// import { usePathname } from "next/navigation"; // 1. Impor usePathname
// import Cookies from "js-cookie"
// import {
//   LayoutDashboard,
//   Server,
//   Monitor,
//   Network,
//   Database,
//   ChevronDown,
//   LogOut
// } from "lucide-react"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar"

// // ... (Struktur data menuItems tetap sama) ...
// const menuItems = [ { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, }, { title: "IT Infra", icon: Network, items: [ { title: "Baremetal", url: "/bare-metal", icon: Server, }, { title: "VM", url: "/vm", icon: Monitor, }, { title: "NMS", icon: Database, items: [ { title: "Zabbix", url: "/zabbix", icon: () => <div className="w-4 h-4" />, } ] } ], }, ];


// // 2. Buat fungsi untuk mencari grup yang aktif berdasarkan URL
// const findActiveGroups = (items: any[], currentPath: string): string[] => {
//   for (const item of items) {
//     if (item.items) {
//       // Periksa apakah ada sub-item yang URL-nya cocok dengan path saat ini
//       const isAnyChildActive = item.items.some(
//         (subItem: any) => subItem.url && currentPath.startsWith(subItem.url)
//       );

//       if (isAnyChildActive) {
//         // Jika ya, grup ini aktif. Cari juga di dalam sub-grup.
//         const nestedGroups = findActiveGroups(item.items, currentPath);
//         return [item.title, ...nestedGroups];
//       }
      
//       // Jika tidak ada yang cocok, cari lebih dalam di sub-grup
//       const nestedGroups = findActiveGroups(item.items, currentPath);
//       if (nestedGroups.length > 0) {
//         return [item.title, ...nestedGroups];
//       }
//     }
//   }
//   return [];
// };


// export function AppSidebar() {
//   const pathname = usePathname(); // 3. Dapatkan path URL saat ini
//   // 4. Tentukan grup mana yang harus terbuka secara default
//   const activeGroups = findActiveGroups(menuItems, pathname);

//   const handleLogout = () => {
//     Cookies.remove("auth_token")
//     window.location.href = "/login"
//   }
  
//   const renderMenu = (items: any[]) => {
//     return items.map((item) => {
//       if (item.items) {
//         return (
//           <AccordionItem key={item.title} value={item.title} className="border-none">
//             <AccordionTrigger className="py-2 hover:no-underline">
//               <div className="flex items-center gap-x-3">
//                 <item.icon className="h-4 w-4" />
//                 <span>{item.title}</span>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="pl-7">
//               <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
//                 {renderMenu(item.items)}
//               </Accordion>
//             </AccordionContent>
//           </AccordionItem>
//         );
//       }
      
//       return (
//         <SidebarMenuItem key={item.title}>
//           <SidebarMenuButton asChild>
//             <a href={item.url}>
//               <item.icon className="h-4 w-4" />
//               <span>{item.title}</span>
//             </a>
//           </SidebarMenuButton>
//         </SidebarMenuItem>
//       );
//     });
//   };

//   return (
//     <Sidebar>
//       <SidebarContent className="flex h-full flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
//             <img
//               src="/logo_tsat.png"
//               alt="TSAT Logo"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//             <h1 className="font-semibold text-lg">Infrastructure</h1>
//           </div>

//           <SidebarGroup>
//             <SidebarGroupLabel>Application</SidebarGroupLabel>
//             <SidebarGroupContent>
//               {/* 5. Berikan 'defaultValue' ke Accordion utama */}
//               <Accordion type="multiple" className="w-full" defaultValue={activeGroups}>
//                 {renderMenu(menuItems)}
//               </Accordion>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </div>

//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton onClick={handleLogout}>
//                   <LogOut className="h-4 w-4" />
//                   <span>Logout</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }

// "use client"

// import Cookies from "js-cookie"
// import { LayoutDashboard, Server, Monitor, LogOut } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const mainItems = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Bare Metal",
//     url: "/bare-metal",
//     icon: Server,
//   },
//   {
//     title: "Virtual Machine",
//     url: "/vm",
//     icon: Monitor,
//   },
// ]

// export function AppSidebar() {
//   const handleLogout = () => {
//     Cookies.remove("auth_token")
//     // Menggunakan navigasi browser standar untuk menghindari error kompilasi
//     window.location.href = "/login"
//   }

//   return (
//     <Sidebar>
//       <SidebarContent className="flex h-full flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
//             <img
//               src="/logo_tsat.png"
//               alt="TSAT Logo"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//             <h1 className="font-semibold text-lg">Infrastructure</h1>
//           </div>

//           <SidebarGroup>
//             <SidebarGroupLabel>Application</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {mainItems.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild>
//                       <a href={item.url}>
//                         <item.icon className="h-4 w-4" />
//                         <span>{item.title}</span>
//                       </a>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </div>

//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton onClick={handleLogout}>
//                   <LogOut className="h-4 w-4" />
//                   <span>Logout</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }



// "use client"

// import { LayoutDashboard, Server, Monitor, LogOut } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const mainItems = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Bare Metal",
//     url: "/monitor",
//     icon: Server,
//   },
//   {
//     title: "Virtual Machine",
//     url: "/vm",
//     icon: Monitor,
//   },
// ]

// const settingsItem = {
//   title: "Logout",
//   url: "/login",
//   icon: LogOut,
// }

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarContent className="flex h-full flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
//             <img
//               src="/logo_tsat.png"
//               alt="TSAT Logo"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//             <h1 className="font-semibold text-lg">Infrastructure</h1>
//           </div>

//           <SidebarGroup>
//             <SidebarGroupLabel>Application</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {mainItems.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild>
//                       <a href={item.url}>
//                         <item.icon className="h-4 w-4" />
//                         <span>{item.title}</span>
//                       </a>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </div>

//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <a href={settingsItem.url}>
//                     <settingsItem.icon className="h-4 w-4" />
//                     <span>{settingsItem.title}</span>
//                   </a>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }




// import { LayoutDashboard, Server, Monitor, LogOut } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const mainItems = [
//   {
//     title: "Dashboard",
//     url: "#",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Bare Metal",
//     url: "/monitor",
//     icon: Server,
//   },
//   {
//     title: "Virtual Machine",
//     url: "#",
//     icon: Monitor,
//   },
// ]

// const settingsItem = {
//   title: "Logout",
//   url: "#",
//   icon: LogOut,
// }

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarContent className="flex h-full flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
//             <img
//               src="/logo_tsat.png"
//               alt="TSAT Logo"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//             <h1 className="font-semibold text-lg">Infrastructure</h1>
//           </div>

//           <SidebarGroup>
//             <SidebarGroupLabel>Application</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {mainItems.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild>
//                       <a href={item.url}>
//                         <item.icon />
//                         <span>{item.title}</span>
//                       </a>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </div>

//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <a href={settingsItem.url}>
//                     <settingsItem.icon />
//                     <span>{settingsItem.title}</span>
//                   </a>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }



// import { LayoutDashboard, Server, Monitor,LogOut } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const mainItems = [
//   {
//     title: "Dashboard",
//     url: "#",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Bare Metal",
//     url: "/monitor",
//     icon: Server,
//   },
//   {
//     title: "Virtual Machine",
//     url: "#",
//     icon: Monitor,
//   },
// ]

// const settingsItem = {
//   title: "Logout",
//   url: "#",
//   icon: LogOut,
// }

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarContent className="flex h-full flex-col justify-between">
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {mainItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <a href={settingsItem.url}>
//                     <settingsItem.icon />
//                     <span>{settingsItem.title}</span>
//                   </a>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }


// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// // Menu items.
// const items = [
//   {
//     title: "Dashboard",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Bare Metal",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Virtual Machine",
//     url: "#",
//     icon: Calendar,
//   },
//   // {
//   //   title: "Search",
//   //   url: "#",
//   //   icon: Search,
//   // },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ]

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }