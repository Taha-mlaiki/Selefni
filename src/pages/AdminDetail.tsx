import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDetail() {
  const { id } = useParams();
  const { data: app, refetch } = useQuery({
    queryKey: ["application", id],
    queryFn: () => api.get(`/applications/${id}`).then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: (statut: string) =>
      api.patch(`/applications/${id}`, { statut }),
    onSuccess: () => refetch(),
  });

  if (!app) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Détail demande #{id}</h1>
      {/* display all info */}
      <div>
        <label>Statut</label>
        <Select
          onValueChange={(v) => updateStatus.mutate(v)}
          defaultValue={app.statut}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en attente">En attente</SelectItem>
            <SelectItem value="en cours">En cours</SelectItem>
            <SelectItem value="acceptée">Acceptée</SelectItem>
            <SelectItem value="refusée">Refusée</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
