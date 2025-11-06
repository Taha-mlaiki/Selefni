export const calculateMonthlyPayment = (
  montant: number,
  tauxAnnuel: number,
  dureeMois: number,
  fraisFixes = 0,
  assurancePourcent = 0
) => {
  const tauxMensuel = tauxAnnuel / 100 / 12;
  const assuranceMensuelle = (montant * (assurancePourcent / 100)) / 12;

  let mensualite =
    (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -dureeMois));
  mensualite += assuranceMensuelle;
  mensualite += fraisFixes / dureeMois;

  return Number(mensualite.toFixed(2));
};

export const calculateTotalCost = (mensualite: number, dureeMois: number) =>
  Number((mensualite * dureeMois).toFixed(2));

export const calculateTAEG = (
  montant: number,
  totalCost: number,
  dureeMois: number
) => {
  const interest = totalCost - montant;
  return Number(((interest / montant) * 100 * 12) / dureeMois).toFixed(2);
};
