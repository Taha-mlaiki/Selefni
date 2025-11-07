import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/api";
import { CreditRequest, RequestStatus } from "@/types";
import { ArrowLeft, Download, Star, Clock } from "lucide-react";
import { exportSimulationPDF } from "@/lib/exportPDF";
import { generateAmortizationTable } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<CreditRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await api.requests.getById(id!);
        setRequest(data);
      } catch (error) {
        console.error("Failed to fetch request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (!request) return;

    try {
      const updatedRequest = {
        ...request,
        status: newStatus,
        statusHistory: [
          ...request.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
          },
        ],
        updatedAt: new Date().toISOString(),
      };

      await api.requests.update(id!, updatedRequest);
      setRequest(updatedRequest);
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleTogglePriority = async () => {
    if (!request) return;

    try {
      const updatedRequest = {
        ...request,
        isPriority: !request.isPriority,
        updatedAt: new Date().toISOString(),
      };

      await api.requests.update(id!, updatedRequest);
      setRequest(updatedRequest);
      toast({
        title: request.isPriority ? "Priority Removed" : "Priority Added",
        description: request.isPriority
          ? "Request is no longer marked as priority"
          : "Request marked as priority",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    }
  };

  const handleAddNote = async () => {
    if (!request || !newNote.trim()) return;

    try {
      const updatedRequest = {
        ...request,
        notes: [...request.notes, `${new Date().toISOString()}: ${newNote}`],
        updatedAt: new Date().toISOString(),
      };

      await api.requests.update(id!, updatedRequest);
      setRequest(updatedRequest);
      setNewNote("");
      toast({
        title: "Note Added",
        description: "Your note has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    if (!request) return;
    const amortizationTable = generateAmortizationTable(
      request.simulation.amount,
      request.simulation.rate,
      request.simulation.duration,
      request.simulation.insurance
    );
    exportSimulationPDF(request.simulation, amortizationTable, request);
    toast({
      title: "PDF Exported",
      description: "Request details exported successfully",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!request) {
    return (
      <AdminLayout>
        <div className="text-center">
          <p className="text-muted-foreground">Request not found</p>
          <Button onClick={() => navigate("/admin/requests")} className="mt-4">
            Back to Requests
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/requests")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleTogglePriority} variant="outline" className="gap-2">
              <Star className={`h-4 w-4 ${request.isPriority ? "fill-warning text-warning" : ""}`} />
              {request.isPriority ? "Remove Priority" : "Mark Priority"}
            </Button>
            <Button onClick={handleExportPDF} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {request.firstName} {request.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{request.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{request.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="font-medium">{request.income.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Job Situation</p>
                <p className="font-medium capitalize">{request.jobSituation.replace("_", " ")}</p>
              </div>
              {request.comment && (
                <div>
                  <p className="text-sm text-muted-foreground">Comment</p>
                  <p className="font-medium">{request.comment}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{request.simulation.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{request.simulation.amount.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{request.simulation.duration} months</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="font-medium">{request.simulation.monthlyPayment.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="font-medium">{request.simulation.totalCost.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TAEG</p>
                <p className="font-medium">{request.simulation.taeg}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={request.status} onValueChange={(value: RequestStatus) => handleStatusChange(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">Status History</label>
              <div className="mt-2 space-y-2">
                {request.statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="capitalize">
                      {entry.status.replace("_", " ")}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">Notes</label>
              <div className="mt-2 space-y-4">
                {request.notes.map((note, index) => (
                  <div key={index} className="rounded-lg bg-muted p-3 text-sm">
                    {note}
                  </div>
                ))}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RequestDetailPage;
