import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GuestLayout } from "@/components/layouts/GuestLayout";
import { SimulationForm } from "@/components/simulation/SimulationForm";
import { SimulationResults } from "@/components/simulation/SimulationResults";
import { AmortizationTable } from "@/components/simulation/AmortizationTable";
import { Button } from "@/components/ui/button";
import { Simulation } from "@/types";
import { generateAmortizationTable } from "@/lib/calculations";
import { ArrowRight, Download } from "lucide-react";
import { exportSimulationPDF } from "@/lib/exportPDF";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const SimulationPage = () => {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [amortizationData, setAmortizationData] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSimulate = async (sim: Simulation) => {
    setSimulation(sim);
    const table = generateAmortizationTable(sim.amount, sim.rate, sim.duration, sim.insurance);
    setAmortizationData(table);

    try {
      await api.simulations.create(sim);
    } catch (error) {
      console.error("Failed to save simulation:", error);
    }
  };

  const handleProceedToRequest = () => {
    if (simulation) {
      navigate("/request", { state: { simulation } });
    }
  };

  const handleExportPDF = () => {
    if (simulation) {
      exportSimulationPDF(simulation, amortizationData);
      toast({
        title: "PDF Exported",
        description: "Your simulation has been exported successfully.",
      });
    }
  };

  return (
    <GuestLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Credit Simulator
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Calculate your monthly payments and explore financing options
          </p>
        </div>

        <SimulationForm onSimulate={handleSimulate} />

        {simulation && (
          <>
            <SimulationResults simulation={simulation} />
            <AmortizationTable data={amortizationData} />

            <div className="flex gap-4 justify-center">
              <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={handleProceedToRequest} className="gap-2">
                Proceed to Request
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </GuestLayout>
  );
};

export default SimulationPage;
