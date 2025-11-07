import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Simulation } from "@/types";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

interface SimulationResultsProps {
  simulation: Simulation;
}

export const SimulationResults = ({ simulation }: SimulationResultsProps) => {
  const stats = [
    {
      label: "Monthly Payment",
      value: `${simulation.monthlyPayment.toLocaleString()} €`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Total Cost",
      value: `${simulation.totalCost.toLocaleString()} €`,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      label: "Duration",
      value: `${simulation.duration} months`,
      icon: Calendar,
      color: "text-muted-foreground",
    },
    {
      label: "TAEG",
      value: `${simulation.taeg}%`,
      icon: Percent,
      color: "text-warning",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
        <CardDescription>Your credit calculation overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-2 rounded-lg bg-muted/50 p-4">
          <h4 className="font-semibold">Loan Details</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Borrowed Amount:</span>
              <span className="font-medium">{simulation.amount.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest Rate:</span>
              <span className="font-medium">{simulation.rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Application Fees:</span>
              <span className="font-medium">{simulation.fees.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Insurance:</span>
              <span className="font-medium">{simulation.insurance.toLocaleString()} €</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
