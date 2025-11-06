import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const schema = z.object({
  nom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(10),
  revenuMensuel: z.coerce.number().positive(),
  situationPro: z.string().min(2),
  commentaire: z.string().optional(),
});

export default function ApplicationForm() {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: simulation } = useQuery({
    queryKey: ["simulation", simulationId],
    queryFn: () => api.get(`/simulations/${simulationId}`).then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      api.post("/applications", {
        ...data,
        simulationId,
        statut: "en attente",
        prioritaire: false,
        notes: [],
      }),
    onSuccess: () => {
      api.post("/notifications", { applicationId: "temp", lu: false });
      toast({ title: "Demande envoyée !" });
      navigate("/");
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  if (!simulation) return <p>Chargement...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Finaliser votre demande</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
          className="space-y-6"
        >
          {/* fields */}
          <Button type="submit" size="lg" className="w-full">
            Envoyer la demande
          </Button>
        </form>
      </Form>
    </div>
  );
}
