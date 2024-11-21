export function formatToIndianCurrency(amount: number) {
  let amountStr = amount.toString();
  let [integer, decimal] = amountStr.split(".");
  let formattedInteger = integer.replace(
    /\B(?=(\d{3})+(?!\d))/g, // Regular expression for Indian numbering system
    ","
  );
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
}
