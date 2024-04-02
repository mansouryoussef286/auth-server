# Centralized Authentication Service
This API provides a centralized service for handling user authentication using **OAuth2.0** for your backend applications. It abstracts the logic of connecting to identity providers (currently supporting Auth0) and handles user authentication. Applications can integrate with this API using API keys and secrets instead of implementing their own authentication flows.

<br>
<br>

## Features:
* Delegated Authentication: Offloads authentication logic from individual applications.
* Supports Auth0: Integrates with Auth0 for user authentication. (Note: This can be extended to support other providers in the future.)
* User Management: Creates and stores user information in a centralized database.
* API Authentication: Applications authenticate with the API using API keys and secrets.
* Client applications authenticate using this auth server that connects to Identity Provider using. [**Authorization code flow**](#auth-code-flow)
* offers refresh token and smaller spans access token for extra security. [**Refresh token flow**](#refresh-token-flow)

<br>
<br>

## Code Flow Sequence Diagrams
<details open>
  <!-- Dropdown Title -->
  <summary>
    <h2>Authorization code flow:</h2>
  </summary>
  <!-- Dropdown Part -->
  <img style="max-height:500px;" src="/ReadmeAssets/Auth server - Auth code flow.png" alt="auth access token flow" id="auth-code-flow">
</details>

<details open style="margin: 0;">
  <!-- Dropdown Title -->
  <summary>
    <h2>Refresh token flow:</h2>
  </summary>
  <!-- Dropdown Part -->
  <img style="max-height:500px;" src="/ReadmeAssets/refresh token flow 2.png" alt="auth refresh token flow" id="refresh-token-flow">
</details>

<br>
<br>

## Installation:
Prerequisites:
* Node.js and npm (or yarn) installed on your system.
* A MySQL database server 
* Clone the Repository:

```Bash
git clone https://github.com/mansouryoussef286/auth-server.git
```

Install Dependencies:
```Bash
cd auth-server
npm install  # or yarn install
```

<br>
<br>

## Database
<details>
  <summary>
    <h2>Run this Database DDl script:</h2>
  </summary>
  
  ```SQL
    CREATE DATABASE `auth-server` /*!40100 DEFAULT */ /*!80016 DEFAULT ENCRYPTION='N' */;

    -- `auth-server`.clients definition
    CREATE TABLE `clients` (
      `Id` int NOT NULL AUTO_INCREMENT,
      `ApiId` varchar(100) DEFAULT NULL,
      `ApiSecret` varchar(100) DEFAULT NULL,
      `ProviderClientId` varchar(100) NOT NULL,
      `ProviderClientSecret` varchar(100) NOT NULL,
      `RedirectUrl` varchar(100) DEFAULT NULL,
      `IsActive` bit(1) NOT NULL,
      PRIMARY KEY (`Id`)
    );
    
    -- `auth-server`.users definition
    CREATE TABLE `users` (
      `Id` int NOT NULL AUTO_INCREMENT,
      `Email` varchar(100) NOT NULL,
      `FirstName` varchar(100) NOT NULL,
      `LastName` varchar(100) NOT NULL,
      `ProfilePicPath` varchar(100) DEFAULT NULL,
      PRIMARY KEY (`Id`)
    );
  ```
</details>

<br>
<br>

## Usage:

### Create Api Keys:

#### create encrypted private key:
```Bash
openssl genpkey -algorithm RSA -outform PEM -aes256 -out encrypted-private-key.pem
```
add pass phrase

#### decrypt the key:
```Bash
openssl rsa -in encrypted-private-key.pem -out decrypted-private-key.pem
```

#### generate the public key from private decrypted key:

```Bash
openssl rsa -in decrypted-private-key.pem -pubout -out public-key.pem
```

#### generate x509 certificate from public key to use in .net app
```Bash
openssl req -new -x509 -key decrypted-private-key.pem -out certificate.pem
```
<br>

#### Application Registration:
* Register your backend applications with this API to obtain API keys and secrets.
* Register client application on the Identity Provider tenant
<br>

#### Start the Server:
```Bash
npm start  # or yarn start
```
<br>

#### Client Setup:
Add authentication code in the Clients' api and web application 
* to allow the tenant to authenticate the user and return the authorization code
* then the web app send it to its api
* then the api communicate with my auth server to handle the backend authentication 
<br>

#### Authentication Flow:
* Client's Application send user authentication requests to the API.
* The API validates the request using the provided API key and secret of the client.
* The API handles user authentication with Auth0 (or other providers' apis dynamically).
* Upon successful authentication, the API returns a user object and tokens to the application.
* Client app communicate with its api as is using the access token and the will validate the token using the *RSA Public X509 Certificate* or *Public key* obtained from the Auth-server *private key*.

<br>
<br>



## License:

This project is licensed under the MIT License: https://opensource.org/licenses/MIT.


## Additional Notes:

This is a sample README file, and specific details may need to be adjusted based on your implementation.
Security is paramount for authentication systems. Ensure proper security practices like secure password hashing and access control are implemented.
Consider including API documentation tools like Swagger or OpenAPI to generate interactive API documentation.
Further Development:

Support for additional identity providers beyond Auth0.
Integration with social login options.
Implement user roles and permissions.
Implement token-based authentication and refresh tokens.
This Centralized Authentication API provides a robust foundation for managing user authentication across your applications, promoting code reusability and streamlining your backend development.
...


## Api Refrences
https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow
