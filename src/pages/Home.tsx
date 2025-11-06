import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="text-center space-y-12">
      <h1 className="text-4xl font-bold text-blue-800">
        Bienvenue sur CréditSim
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Simulez vos crédits en ligne facilement : calculez vos mensualités, le
        coût total et obtenez un échéancier simplifié. Créez une demande en
        quelques clics !
      </p>
      <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
        <Link to="/simulation">Commencer une simulation</Link>
      </Button>
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Simulation rapide</CardTitle>
          </CardHeader>
          <CardContent>
            Entrez vos détails et obtenez des résultats immédiats.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demande sécurisée</CardTitle>
          </CardHeader>
          <CardContent>Soumettez votre demande sans engagement.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Export PDF</CardTitle>
          </CardHeader>
          <CardContent>Téléchargez vos simulations pour référence.</CardContent>
        </Card>
      </div>
    </div>
  );
}
