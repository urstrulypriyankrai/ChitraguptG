export const convertGstRateToNumber = (gstRate: string) => {
  switch (gstRate) {
    case "ZERO":
      return 0;
    case "FIVE":
      return 5;
    case "TWELVE":
      return 12;
    case "EIGHTEEN":
      return 18;
    default:
      return 0;
  }
};
export default convertGstRateToNumber;

export const convertGstRateToString = (gstRate: number) => {
  switch (gstRate) {
    case 0:
      return "ZERO";
    case 5:
      return "FIVE";
    case 12:
      return "TWELVE";

    case 18:
      return "EIGHTEEN";

    default:
      return "ZERO";
  }
};
