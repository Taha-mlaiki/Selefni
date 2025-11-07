import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { CreditRequest } from "@/types";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const Dashboard = () => {
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await api.requests.getAll();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Pending",
      value: requests.filter((r) => r.status === "pending").length,
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Accepted",
      value: requests.filter((r) => r.status === "accepted").length,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      label: "Rejected",
      value: requests.filter((r) => r.status === "rejected").length,
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of all credit requests</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Latest credit applications submitted</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No requests yet</p>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {request.firstName} {request.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {request.simulation.amount.toLocaleString()} €
                      </p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {request.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
