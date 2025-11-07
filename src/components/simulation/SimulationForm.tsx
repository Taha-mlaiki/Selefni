import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Simulation } from "@/types";
import { calculateMonthlyPayment, calculateTAEG, calculateTotalCost } from "@/lib/calculations";

const formSchema = z.object({
  type: z.enum(["personal", "auto", "mortgage", "business"]),
  amount: z.number().min(1000, "Minimum 1,000€").max(500000, "Maximum 500,000€"),
  duration: z.number().min(6, "Minimum 6 months").max(360, "Maximum 360 months"),
  rate: z.number().min(0, "Rate must be positive").max(20, "Maximum 20%"),
  fees: z.number().min(0, "Fees must be positive"),
  insurance: z.number().min(0, "Insurance must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

interface SimulationFormProps {
  onSimulate: (simulation: Simulation) => void;
}

export const SimulationForm = ({ onSimulate }: SimulationFormProps) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "personal",
      amount: 10000,
      duration: 36,
      rate: 5,
      fees: 200,
      insurance: 15,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const monthlyPayment = calculateMonthlyPayment(values.amount, values.rate, values.duration);
      const totalCost = calculateTotalCost(
        values.amount,
        monthlyPayment,
        values.duration,
        values.fees,
        values.insurance
      );
      const taeg = calculateTAEG(
        values.amount,
        monthlyPayment,
        values.duration,
        values.fees,
        values.insurance
      );

      const simulation: Simulation = {
        id: Date.now().toString(),
        type: values.type,
        amount: values.amount,
        duration: values.duration,
        rate: values.rate,
        fees: values.fees,
        insurance: values.insurance,
        monthlyPayment: monthlyPayment + values.insurance,
        totalCost,
        taeg,
        createdAt: new Date().toISOString(),
      };

      onSimulate(simulation);
      setIsCalculating(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Simulation</CardTitle>
        <CardDescription>Enter your credit parameters to calculate your monthly payment</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select credit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="auto">Auto Loan</SelectItem>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Fees (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Insurance (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isCalculating}>
              {isCalculating ? "Calculating..." : "Calculate"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
