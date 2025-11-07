import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Simulation, CreditRequest, AmortizationRow } from "@/types";

export const exportSimulationPDF = (
  simulation: Simulation,
  amortizationTable: AmortizationRow[],
  request?: Partial<CreditRequest>
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Credit Simulation", 14, 20);

  // Simulation details
  doc.setFontSize(12);
  doc.text("Simulation Details", 14, 35);
  doc.setFontSize(10);
  
  const details = [
    ["Credit Type", simulation.type],
    ["Amount", `${simulation.amount.toLocaleString()} €`],
    ["Duration", `${simulation.duration} months`],
    ["Annual Rate", `${simulation.rate}%`],
    ["Fees", `${simulation.fees.toLocaleString()} €`],
    ["Monthly Insurance", `${simulation.insurance.toLocaleString()} €`],
    ["Monthly Payment", `${simulation.monthlyPayment.toLocaleString()} €`],
    ["Total Cost", `${simulation.totalCost.toLocaleString()} €`],
    ["TAEG", `${simulation.taeg}%`],
  ];

  autoTable(doc, {
    startY: 40,
    head: [["Field", "Value"]],
    body: details,
    theme: "striped",
  });

  // Request details if provided
  if (request) {
    doc.addPage();
    doc.setFontSize(12);
    doc.text("Applicant Information", 14, 20);
    
    const requestDetails = [
      ["Name", `${request.firstName} ${request.lastName}`],
      ["Email", request.email || ""],
      ["Phone", request.phone || ""],
      ["Income", `${request.income?.toLocaleString()} €`],
      ["Job Situation", request.jobSituation || ""],
      ["Comment", request.comment || "N/A"],
    ];

    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: requestDetails,
      theme: "striped",
    });
  }

  // Amortization table
  doc.addPage();
  doc.setFontSize(12);
  doc.text("Amortization Schedule", 14, 20);

  const tableData = amortizationTable.map((row) => [
    row.month,
    `${row.interest.toFixed(2)} €`,
    `${row.principal.toFixed(2)} €`,
    `${row.insurance.toFixed(2)} €`,
    `${row.monthlyPayment.toFixed(2)} €`,
    `${row.remainingCapital.toFixed(2)} €`,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["Month", "Interest", "Principal", "Insurance", "Total Payment", "Remaining"]],
    body: tableData,
    theme: "striped",
    styles: { fontSize: 8 },
  });

  // Save
  const fileName = request 
    ? `credit-request-${request.firstName}-${request.lastName}.pdf`
    : `credit-simulation-${Date.now()}.pdf`;
  
  doc.save(fileName);
};
