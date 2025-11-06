import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: apps = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: () => api.get("/applications").then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Demandes de crédit</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app: any) => (
            <TableRow key={app.id}>
              <TableCell>{app.nom}</TableCell>
              <TableCell>{app.simulation?.montant} €</TableCell>
              <TableCell>
                <Badge
                  variant={
                    app.statut === "acceptée"
                      ? "default"
                      : app.statut === "refusée"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {app.statut}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(app.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button asChild size="sm">
                  <Link to={`/admin/${app.id}`}>Voir</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
