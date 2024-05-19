export class createCustomApiError extends Error {
  // Define the status code for the error
  statusCode: number;

  // Constructor to initialize the error message and status code
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
