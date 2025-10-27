// Lokasi: app/login/page.tsx

import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="relative min-h-svh w-full bg-background">
      <div className="grid min-h-svh grid-cols-1 md:grid-cols-2">
        
        {/* Kolom Kiri */}
        <div className="hidden bg-white md:flex flex-col items-center justify-center p-10 text-center border-r border-gray-200">
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Logo Aplikasi"
              width={700}
              height={400}
            />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Infrastructure Monitoring
            </h1>
            <p className="text-gray-600 max-w-sm mb-20">
              Welcome back. Please sign in to access your dashboard and manage your infrastructure assets.
            </p>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="flex items-center justify-center p-6 md:p-10 bg-gray-700">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

      </div>
    </div>
  );
}

// // Lokasi: app/login/page.tsx
// import Image from "next/image";
// import { LoginForm } from "@/components/login-form";

// export default function Page() {
//   return (
//     <div className="relative min-h-svh w-full bg-background">
//       {/* Container utama dengan grid responsif */}
//       <div className="grid min-h-svh grid-cols-1 md:grid-cols-2">
        
//         {/* Kolom Kiri (Hanya tampil di desktop) */}
//         <div className="hidden bg-white md:flex flex-col items-center justify-center p-10 text-center border-r border-border">
//           <div className="flex flex-col items-center ">
//             <img
//               src="/logo.png" // Menggunakan logo Anda
//               alt="Logo"
//               width={700}
//               height={500}
//               className="rounded-full"
//             />
//             <h1 className="text-3xl font-bold tracking-tight text-background">
//               Infrastructure Monitoring
//             </h1>
//             <p className="text-muted-foreground max-w-sm">
//               Welcome. Please sign in to access your dashboard and manage your infrastructure assets.
//             </p>
//           </div>
//         </div>

//         {/* Kolom Kanan (Formulir Login) */}
//         <div className="flex bg-red-500 items-center justify-center p-6 md:p-10 ">
//           <div className="w-full max-w-sm">
//             <LoginForm />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { LoginForm } from "@/components/login-form"

// export default function Page() {
//   return (
//     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <LoginForm />
//       </div>
//     </div>
//   )
// }
