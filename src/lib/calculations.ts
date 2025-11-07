import { AmortizationRow } from "@/types";

export const calculateMonthlyPayment = (
  amount: number,
  annualRate: number,
  durationMonths: number
): number => {
  if (annualRate === 0) return amount / durationMonths;
  
  const monthlyRate = annualRate / 100 / 12;
  const payment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1);
  
  return Math.round(payment * 100) / 100;
};

export const calculateTAEG = (
  amount: number,
  monthlyPayment: number,
  durationMonths: number,
  fees: number,
  monthlyInsurance: number
): number => {
  // Simplified TAEG calculation
  const totalPaid = monthlyPayment * durationMonths + monthlyInsurance * durationMonths + fees;
  const totalCost = totalPaid - amount;
  const taeg = (totalCost / amount / (durationMonths / 12)) * 100;
  
  return Math.round(taeg * 100) / 100;
};

export const calculateTotalCost = (
  amount: number,
  monthlyPayment: number,
  durationMonths: number,
  fees: number,
  monthlyInsurance: number
): number => {
  return monthlyPayment * durationMonths + monthlyInsurance * durationMonths + fees;
};

export const generateAmortizationTable = (
  amount: number,
  annualRate: number,
  durationMonths: number,
  monthlyInsurance: number
): AmortizationRow[] => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPaymentWithoutInsurance = calculateMonthlyPayment(amount, annualRate, durationMonths);
  const table: AmortizationRow[] = [];
  
  let remainingCapital = amount;
  
  for (let month = 1; month <= durationMonths; month++) {
    const interest = remainingCapital * monthlyRate;
    const principal = monthlyPaymentWithoutInsurance - interest;
    remainingCapital -= principal;
    
    table.push({
      month,
      remainingCapital: Math.max(0, Math.round(remainingCapital * 100) / 100),
      interest: Math.round(interest * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      insurance: monthlyInsurance,
      monthlyPayment: Math.round((monthlyPaymentWithoutInsurance + monthlyInsurance) * 100) / 100,
    });
  }
  
  return table;
};
