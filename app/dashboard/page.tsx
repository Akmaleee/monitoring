import Link from "next/link";
import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Cpu } from "lucide-react";

async function fetchJson(url: string, token: string) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Fetch ${url} failed: ${res.status} ${res.statusText} ${text}`,
    );
  }

  const parsed = await res.json().catch(() => null);
  return parsed;
}

function normalizeArray(v: any) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (v.data && Array.isArray(v.data)) return v.data;
  return [];
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4">
          Authentication required. Please{" "}
          <Link href="/login" className="text-blue-500">
            login
          </Link>
          .
        </p>
      </div>
    );
  }

  try {
    const [bareRes, vmRes] = await Promise.all([
      fetchJson("http://127.0.0.1:3000/bare-metal", token),
      fetchJson("http://127.0.0.1:3000/virtual-machine", token),
    ]);

    const bareList = normalizeArray(bareRes);
    const vmList = normalizeArray(vmRes);

    const totalBare = bareList.length;

    const activeBare = bareList.filter((b: any) => {
      const nodes =
        b.bare_metal_node || b.bare_metal_nodes || b.nodes || [];
      if (Array.isArray(nodes) && nodes.length > 0) {
        for (const node of nodes) {
          const statusArr =
            node.BareMetalNodeStatus ||
            node.bare_metal_node_status ||
            node.status_history ||
            node.statuses ||
            [];
          if (Array.isArray(statusArr) && statusArr.length > 0) {
            const last = statusArr[statusArr.length - 1];
            const s = (
              last?.status || last?.state || ""
            )
              .toString()
              .toLowerCase();
            if (
              s &&
              s !== "offline" &&
              s !== "unknown" &&
              s !== "down"
            )
              return true;
          }

          const direct = (node.status || node.state || "")
            .toString()
            .toLowerCase();
          if (
            direct &&
            direct !== "offline" &&
            direct !== "unknown" &&
            direct !== "down"
          )
            return true;
        }
        return false;
      }

      const top = (
        b.status ||
        b.state ||
        b.is_active ||
        ""
      )
        .toString()
        .toLowerCase();
      if (top === "true") return true;
      if (
        top &&
        top !== "offline" &&
        top !== "unknown" &&
        top !== "down" &&
        top !== "false"
      )
        return true;
      return false;
    }).length;

    const inactiveBare = totalBare - activeBare;

    const totalVm = vmList.length;
    const activeVm = vmList.filter((v: any) => {
      const s = (
        v.virtual_machine_status?.status ||
        v.status ||
        ""
      )
        .toString()
        .toLowerCase();
      return (
        s === "running" || s === "online" || s === "active"
      );
    }).length;
    const inactiveVm = totalVm - activeVm;

    const bareActivePct =
      totalBare > 0
        ? Math.round((activeBare / totalBare) * 100)
        : 0;
    const vmActivePct =
      totalVm > 0 ? Math.round((activeVm / totalVm) * 100) : 0;

    const vmStatusCounts = vmList.reduce((acc: any, v: any) => {
      const s = (
        v.virtual_machine_status?.status ||
        v.status ||
        "unknown"
      )
        .toString()
        .toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const bareStatusCounts = bareList.reduce(
      (acc: any, b: any) => {
        const nodes =
          b.bare_metal_node || b.bare_metal_nodes || b.nodes || [];
        if (Array.isArray(nodes) && nodes.length > 0) {
          for (const node of nodes) {
            const statusArr =
              node.BareMetalNodeStatus ||
              node.bare_metal_node_status ||
              node.status_history ||
              node.statuses ||
              [];
            if (Array.isArray(statusArr) && statusArr.length > 0) {
              const last = statusArr[statusArr.length - 1];
              const s = (
                last?.status || last?.state || "unknown"
              )
                .toString()
                .toLowerCase();
              acc[s] = (acc[s] || 0) + 1;
              continue;
            }

            const direct = (
              node.status || node.state || "unknown"
            )
              .toString()
              .toLowerCase();
            acc[direct] = (acc[direct] || 0) + 1;
          }
        } else {
          const top = (
            b.status || b.state || "unknown"
          )
            .toString()
            .toLowerCase();
          acc[top] = (acc[top] || 0) + 1;
        }
        return acc;
      },
      {},
    );

    const nowServer = new Date();

    return (
      // Hapus 'container' dan 'py-10' karena sudah ditangani layout
      <div>
        {/* Hapus <h1>Dashboard</h1> dari sini */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/bare-metal" className="block">
            <Card className="border border-white/6 bg-transparent text-white transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-gray-200" />
                  <CardTitle>Bare Metal Nodes</CardTitle>
                </div>
                <div className="flex w-full items-center justify-between">
                  <CardDescription>
                    Overview of bare metal servers
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">
                      {nowServer.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-6">
                    <div>
                      <div className="text-sm text-gray-300">
                        Total
                      </div>
                      <div className="text-3xl font-extrabold">
                        {totalBare}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">
                        Active{" "}
                        <span className="ml-2 font-semibold">
                          {activeBare}
                        </span>
                      </Badge>
                      <Badge className="bg-gray-700 text-gray-100">
                        Inactive{" "}
                        <span className="ml-2 font-semibold">
                          {inactiveBare}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                      <div>Active ratio</div>
                      <div className="font-medium">
                        {bareActivePct}%
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/6">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-700 ease-out"
                        style={{ width: `${bareActivePct}%` }}
                      />
                    </div>
                  </div>

                  <CardContent className="pt-0">
                    <div className="flex gap-3 text-sm text-gray-300">
                      {Object.entries(bareStatusCounts)
                        .slice(0, 5)
                        .map(([k, v]) => (
                          <div
                            key={k}
                            className="inline-flex items-center gap-2"
                          >
                            <Badge className="bg-muted text-muted-foreground lowercase">
                              {k}
                            </Badge>
                            <span className="font-medium text-gray-200">
                              {String(v)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-gray-400">
                  Data refreshed on each request (server-side)
                </div>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/vm" className="block">
            <Card className="border border-white/6 bg-transparent text-white transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-gray-200" />
                  <CardTitle>Virtual Machines</CardTitle>
                </div>
                <div className="flex w-full items-center justify-between">
                  <CardDescription>Overview of VMs</CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">
                      {nowServer.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-6">
                    <div>
                      <div className="text-sm text-gray-300">
                        Total
                      </div>
                      <div className="text-3xl font-extrabold">
                        {totalVm}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">
                        Active{" "}
                        <span className="ml-2 font-semibold">
                          {activeVm}
                        </span>
                      </Badge>
                      <Badge className="bg-gray-700 text-gray-100">
                        Inactive{" "}
                        <span className="ml-2 font-semibold">
                          {inactiveVm}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                      <div>Active ratio</div>
                      <div className="font-medium">{vmActivePct}%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/6">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-700 ease-out"
                        style={{ width: `${vmActivePct}%` }}
                      />
                    </div>
                  </div>

                  <CardContent className="pt-0">
                    <div className="flex gap-3 text-sm text-gray-300">
                      {Object.entries(vmStatusCounts)
                        .slice(0, 5)
                        .map(([k, v]) => (
                          <div
                            key={k}
                            className="inline-flex items-center gap-2"
                          >
                            <Badge className="bg-muted text-muted-foreground lowercase">
                              {k}
                            </Badge>
                            <span className="font-medium text-gray-200">
                              {String(v)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-gray-400">
                  Click items for details in list pages
                </div>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 text-red-500">
          Error loading counts: {String(err?.message || err)}
        </p>
      </div>
    );
  }
}




// export default function DashboardPage(){
//     return(
//         <div>
//             <p>halo</p>
//             <span className="relative flex size-3">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
//             <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
//             </span>
//         </div>
//     )
// }