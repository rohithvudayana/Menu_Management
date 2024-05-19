Guestara
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/arvind3417/pixelwand.git
cd pixelwand
Install dependencies:

bash
Copy code
npm install
Environment Setup
Make sure your .env file looks like this or you can visit .env.example:

makefile
Copy code
JWT_ACCESS_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
CONNECTIONSTR="your-mongo-connection-string-url"
Running the Application
To run in development mode, use:

bash
Copy code
npm run dev
Documentation
The following documentation is based on the examples in the task (i.e., the current state of the database):

Pixelwand API Documentation

Tests
Integration Testing:

[image or description of tests]
