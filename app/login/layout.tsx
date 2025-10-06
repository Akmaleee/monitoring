
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring Infra",
  description: "Infrastructure Monitoring",
  icons: {
    icon: "/logo_tsat.png",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}