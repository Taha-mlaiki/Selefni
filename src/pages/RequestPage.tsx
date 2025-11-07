import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GuestLayout } from "@/components/layouts/GuestLayout";
import { RequestForm } from "@/components/request/RequestForm";
import { SimulationResults } from "@/components/simulation/SimulationResults";
import { CreditRequest, Simulation } from "@/types";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RequestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const simulation = location.state?.simulation as Simulation;

  if (!simulation) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (request: Omit<CreditRequest, "id" | "createdAt" | "updatedAt">) => {
    try {
      const fullRequest = {
        ...request,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await api.requests.create(fullRequest);
      await api.notifications.create({
        requestId: fullRequest.id,
        message: `New credit request from ${request.firstName} ${request.lastName}`,
        read: false,
        createdAt: new Date().toISOString(),
      });

      setSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your credit request has been submitted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <GuestLayout>
        <div className="mx-auto max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Request Submitted Successfully!</CardTitle>
              <CardDescription>
                Thank you for your credit request. Our team will review your application and contact you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="mt-4">
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Complete Your Request
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Provide your information to finalize your credit application
          </p>
        </div>

        <SimulationResults simulation={simulation} />
        <RequestForm simulation={simulation} onSubmit={handleSubmit} />
      </div>
    </GuestLayout>
  );
};

export default RequestPage;
