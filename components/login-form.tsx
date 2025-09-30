"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

// Definisikan tipe payload token
interface DecodedToken {
  user: {
    role: { Role: { name: string } }[];
  };
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("rinjani.putri");
  const [password, setPassword] = useState("Putrijani1910@");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.data.token) {
        throw new Error(responseData.message || "Username atau password salah");
      }

      const token = responseData.data.token;
      Cookies.set("auth_token", token, { secure: true, sameSite: "strict" });

      // Decode token dan simpan role
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userRole = decodedToken.user?.role?.[0]?.Role?.name || "user";
        Cookies.set("user_role", userRole, { secure: true, sameSite: "strict" });
      } catch (e) {
        console.error("Failed to decode token, defaulting to 'user' role.", e);
        Cookies.set("user_role", "user", { secure: true, sameSite: "strict" });
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center px-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Login into Your Account</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="yourid"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


// "use client";

// import { useState } from "react";
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode'; // <-- 1. Impor jwtDecode
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // Definisikan tipe untuk payload token agar lebih aman
// interface DecodedToken {
//   user: {
//     role: { Role: { name: string } }[];
//   };
// }

// export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
//   const [username, setUsername] = useState("rinjani.putri");
//   const [password, setPassword] = useState("Putrijani1910@");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://127.0.0.1:3000/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const responseData = await response.json();

//       if (!response.ok || !responseData.data.token) {
//         throw new Error(responseData.message || "Username atau password salah");
//       }

//       const token = responseData.data.token;
//       Cookies.set('auth_token', token, { secure: true, sameSite: 'strict' });
      
//       // -- 2. Decode token dan simpan role --
//       try {
//         const decodedToken = jwtDecode<DecodedToken>(token);
//         // Ambil role pertama, default ke 'user' jika tidak ada
//         const userRole = decodedToken.user?.role?.[0]?.Role?.name || 'user';
//         Cookies.set('user_role', userRole, { secure: true, sameSite: 'strict' });
//       } catch (e) {
//         console.error("Failed to decode token, defaulting to 'user' role.", e);
//         Cookies.set('user_role', 'user', { secure: true, sameSite: 'strict' });
//       }

//       window.location.href = "/dashboard"; 

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Login to your account</CardTitle>
//           <CardDescription>
//             Enter your username and password below to login.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-3">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="yourid"
//                   required
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>

//               {error && (
//                 <p className="text-sm font-medium text-red-500">{error}</p>
//               )}

//               <div className="flex flex-col gap-3">
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? "Logging in..." : "Login"}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Cookies from 'js-cookie';
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.token) {
//         throw new Error(data.message || "Username atau password salah");
//       }

//       Cookies.set('auth_token', data.token, { secure: true, sameSite: 'strict' });

//       window.location.href = "/dashboard";

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Login to your account</CardTitle>
//           <CardDescription>
//             Enter your username and password below to login.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-3">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="yourid"
//                   required
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>

//               {error && (
//                 <p className="text-sm font-medium text-red-500">{error}</p>
//               )}

//               <div className="flex flex-col gap-3">
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? "Logging in..." : "Login"}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Username atau password salah");
//       }

//       router.push("/dashboard");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Login to your account</CardTitle>
//           <CardDescription>
//             Enter your username and password below to login.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-3">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="yourid"
//                   required
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>

//               {error && (
//                 <p className="text-sm font-medium text-red-500">{error}</p>
//               )}

//               <div className="flex flex-col gap-3">
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? "Logging in..." : "Login"}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// "use client" // WAJIB: Menandai ini sebagai Client Component

// import { useState } from "react"
// // Mencoba 'next/router' sebagai alternatif
// import { useRouter } from "next/router" 
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   // Hook ini sekarang akan berfungsi karena berada di Client Component
//   const router = useRouter() 
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || "Username atau password salah")
//       }

//       // Navigasi ke dashboard setelah berhasil login
//       router.push("/dashboard")

//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Login to your account</CardTitle>
//           <CardDescription>
//             Enter your username and password below to login.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-3">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="yourid"
//                   required
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>

//               {error && (
//                 <p className="text-sm font-medium text-red-500">{error}</p>
//               )}

//               <div className="flex flex-col gap-3">
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? "Logging in..." : "Login"}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }





// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Login to your account</CardTitle>
//           <CardDescription>
//             Enter your email below to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-3">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type=""
//                   placeholder="yourid"
//                   required
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                   {/* <a
//                     href="#"
//                     className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a> */}
//                 </div>
//                 <Input id="password" type="password" required />
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Button type="submit" className="w-full">
//                   Login
//                 </Button>
//                 {/* <Button variant="outline" className="w-full">
//                   Login with Google
//                 </Button> */}
//               </div>
//             </div>
//             {/* <div className="mt-4 text-center text-sm">
//               Don&apos;t have an account?{" "}
//               <a href="#" className="underline underline-offset-4">
//                 Sign up
//               </a>
//             </div> */}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
