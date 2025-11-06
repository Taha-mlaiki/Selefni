import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import {
  calculateMonthlyPayment,
  calculateTotalCost,
  calculateTAEG,
} from "@/lib/credit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const schema = z.object({
  type: z.string().min(1),
  metier: z.string().min(1),
  montant: z.coerce.number().positive(),
  duree: z.coerce.number().int().min(1).max(480),
  tauxAnnuel: z.coerce.number().min(0).max(30),
  fraisFixes: z.coerce.number().optional(),
  assurance: z.coerce.number().min(0).max(10).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Simulation() {
  const [result, setResult] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "consommation",
      metier: "",
      montant: 20000,
      duree: 48,
      tauxAnnuel: 4.5,
      fraisFixes: 0,
      assurance: 0.5,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post("/simulations", data),
    onSuccess: (res) => {
      toast.success("Simulation sauvegardée !", { duration: 3000 });
      setResult({ ...res.data, id: res.data.id });
    },
  });

  const onSubmit = (values: FormValues) => {
    const mensualite = calculateMonthlyPayment(
      values.montant,
      values.tauxAnnuel,
      values.duree,
      values.fraisFixes,
      values.assurance
    );
    const total = calculateTotalCost(mensualite, values.duree);
    const taeg = calculateTAEG(values.montant, total, values.duree);

    const payload = {
      ...values,
      mensualite,
      coutTotal: total,
      taeg,
    };

    mutation.mutate(payload);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Simuler votre crédit</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* All fields here - shortened for brevity */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de crédit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="consommation">
                          Consommation
                        </SelectItem>
                        <SelectItem value="immobilier">Immobilier</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* ... repeat for metier, montant, duree, tauxAnnuel, fraisFixes, assurance ... */}
              <Button type="submit" className="w-full">
                Calculer
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">{result.mensualite} €/mois</p>
              <p>Cout total : {result.coutTotal} €</p>
              <p>TAEG : {result.taeg} %</p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link to={`/application/${result.id}`}>Faire une demande</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
