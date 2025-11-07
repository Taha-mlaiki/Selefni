import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AmortizationRow } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AmortizationTableProps {
  data: AmortizationRow[];
}

export const AmortizationTable = ({ data }: AmortizationTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amortization Schedule</CardTitle>
        <CardDescription>Month-by-month payment breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Insurance</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right">{row.interest.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">{row.principal.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">{row.insurance.toFixed(2)} €</TableCell>
                  <TableCell className="text-right font-semibold">
                    {row.monthlyPayment.toFixed(2)} €
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.remainingCapital.toFixed(2)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
