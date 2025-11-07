import { CreditRequest } from "@/types";

export const exportRequestsToCSV = (requests: CreditRequest[]) => {
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Income",
    "Job Situation",
    "Credit Type",
    "Amount",
    "Duration",
    "Monthly Payment",
    "Status",
    "Priority",
    "Created At",
  ];

  const rows = requests.map((req) => [
    req.id,
    req.firstName,
    req.lastName,
    req.email,
    req.phone,
    req.income,
    req.jobSituation,
    req.simulation.type,
    req.simulation.amount,
    req.simulation.duration,
    req.simulation.monthlyPayment,
    req.status,
    req.isPriority ? "Yes" : "No",
    new Date(req.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `credit-requests-${Date.now()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
