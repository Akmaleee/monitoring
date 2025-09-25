"use client"

import Cookies from "js-cookie"
import { LayoutDashboard, Server, Monitor, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bare Metal",
    url: "/bare-metal",
    icon: Server,
  },
  {
    title: "Virtual Machine",
    url: "/vm",
    icon: Monitor,
  },
]

export function AppSidebar() {
  const handleLogout = () => {
    Cookies.remove("auth_token")
    // Menggunakan navigasi browser standar untuk menghindari error kompilasi
    window.location.href = "/login"
  }

  return (
    <Sidebar>
      <SidebarContent className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center gap-x-3 border-b px-4 py-3.5">
            <img
              src="/logo_tsat.png"
              alt="TSAT Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <h1 className="font-semibold text-lg">Infrastructure</h1>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}



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