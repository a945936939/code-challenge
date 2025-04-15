declare module "payment" {
  const Payment: {
    fns: {
      validateCardNumber: (number: string) => boolean;
    };
  };
  export default Payment;
}
