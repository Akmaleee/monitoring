// Lokasi: app/user-management/verify/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

// Set durasi validitas verifikasi (misal: 5 menit)
const VERIFICATION_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

export default function VerifyPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Verifying password...");
    const token = getCookie("auth_token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password verification failed.");
      }

      toast.success("Password verified!", { id: toastId });

      // Simpan timestamp verifikasi ke sessionStorage
      sessionStorage.setItem('user_management_verified_at', Date.now().toString());

      // Arahkan kembali ke halaman tujuan (jika ada) atau ke user-management
      const redirectUrl = searchParams.get("redirect") || "/user-management";
      router.replace(redirectUrl);

    } catch (err: any) {
      toast.error("Verification Failed", { id: toastId, description: err.message });
      setError(err.message);
    } finally {
      setIsLoading(false);
      setPassword(""); // Kosongkan password setelah percobaan
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Password Verification Required</CardTitle>
          <CardDescription>
            Please enter your current password to access User Management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password-verify">Password</Label>
              <Input
                id="password-verify"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || !password}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
             <Button type="button" variant="outline" className="w-full" onClick={() => router.back()} disabled={isLoading}>
               Cancel
             </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}