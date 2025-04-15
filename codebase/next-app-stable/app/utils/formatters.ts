type FormatFunction = (value: string) => string;

export const formatCardNumber: FormatFunction = (value) => {
  // Only allow numbers and remove all other characters
  const numericValue = value.replace(/\D/g, "").slice(0, 16);

  // Add spaces after every 4 digits
  const parts = numericValue.match(/.{1,4}/g) || [];
  return parts.join(" ");
};

export const formatExpiryDate: FormatFunction = (value) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 4);
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  return cleaned;
};

export const formatCVV: FormatFunction = (value) => {
  return value.replace(/\D/g, "").slice(0, 4);
};
