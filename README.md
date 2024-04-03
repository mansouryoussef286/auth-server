# Centralized Authentication Service
This API provides a centralized service for handling user authentication using **OAuth2.0** for your backend applications. It abstracts the logic of connecting to identity providers (currently supporting Auth0) and handles user authentication. Applications can integrate with this API using API keys and secrets instead of implementing their own authentication flows. 
Based on **Asymetric encryption** for extra security of the encryption keys.

<br>
<br>

## Features:
* Delegated Authentication: Offloads authentication logic from individual applications.
* Supports Auth0: Integrates with Auth0 for user authentication. (Note: This can be extended to support other providers in the future.)
* User Management: Creates and stores user information in a centralized database.
* API Authentication: Applications authenticate with the API using API keys and secrets.
* Client applications authenticate using this auth server that connects to Identity Provider using. [**Authorization code flow**](#auth-code-flow) [**refrence**](#code-flow-ref)
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
  * There is a method mentioned in Auth0 quick start.  [**here**](#auth0-quick-start)
  * But I preferred using the native way with no extra packages to download.  [**here**](#auth0-native-authorize)
  * Example using Angular:
    ```javascript
    Authenticate() {
  		let url = this.GetAuthenticationUrl();
  		window.open(url, "_self");
  	}
  
  	private GetAuthenticationUrl(): string {
  		// Don't use values directly in your code 
  		let response_type = 'code';
  		let client_id = '7AtMgepqMwqvlgtKhV2vQy7YmWYCr3oI'; // IP client id
  		let scope = 'openid profile email offline_access'; 
  		let redirect_uri = 'http://localhost:4200/auth'; // Same as set in the IP tenant
  		let state = 'STATE'; // To compare with returned state with code for extra security
  
  		this.State = state;
  		return `${this.TenantBaseUrl}authorize?response_type=${response_type}&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
  	}
    ```
* then the web app send it to its api
* then the api communicate with my auth server to handle the backend authentication
* Example using .Net core api
  ```csharp
        public async Task<AuthServerAuthenticationResModel> Authenticate(string code)
        {
            // Replace the URL with the actual API endpoint
            var apiUrl = (_configuration["Auth-Server:ApiUrl"] ?? "") + "authenticate";
            var authServerApiId = _configuration["Auth-Server:ApiId"] ?? "";
            var authServerApiSecret = _configuration["Auth-Server:ApiSecret"] ?? "";

            var reqModel = new AuthServerAuthenticationReqModel()
            {
                Code = code,
                ApiId = authServerApiId,
                ApiSecret = authServerApiSecret
            };


            var jsonContent = JsonConvert.SerializeObject(reqModel);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(apiUrl, content);

            response.EnsureSuccessStatusCode();

            // Read and deserialize the response content
            var responseContent = await response.Content.ReadAsStringAsync();
            var authenticationResModel = JsonConvert.DeserializeObject<AuthServerAuthenticationResModel>(responseContent);

            if (authenticationResModel != null && authenticationResModel.Success == true)
            {
                await CheckUserInDbById(authenticationResModel.CurrentUser);
                return authenticationResModel;

            }
            else
            {
                authenticationResModel = new AuthServerAuthenticationResModel();
                authenticationResModel.Success = false;
                return authenticationResModel;
            }
        }
  ```
  
<br>

#### Authentication Flow:
* Client's Application send user authentication requests to the API.
* The API validates the request using the provided API key and secret of the client.
* The API handles user authentication with Auth0 (or other providers' apis dynamically).
* Upon successful authentication, the API returns a user object and tokens to the application.
* Client app communicate with its api as is using the access token and the will validate the token using the *RSA Public X509 Certificate* or *Public key* obtained from the Auth-server *private key*.

<br>
<br>

## Architecture:

### Auth Server API Architecture with Hexagonal Architecture (NestJS)
This document describes the architecture of your Auth Server API built using NestJS and the hexagonal architecture pattern. The hexagonal architecture helps to decouple the core domain logic from the infrastructure and application layers, promoting maintainability and testability.

### Folder Structure:
The project is organized into three main folders:

* #### App:
  This folder contains the application layer logic responsible for handling incoming requests, routing, and interacting with the domain layer.
  * Controllers: NestJS controllers reside here, defining API endpoints and orchestrating domain layer interactions.
  * Services: Application services can be defined here to encapsulate reusable business logic related to user authentication and management.

* #### Data:
  This folder contains code related to data access and persistence.
  * Repositories: Implementations for domain-specific repositories reside here, responsible for CRUD operations on user data. They interact with the chosen persistence layer (e.g., database) without exposing implementation details to the domain layer.
  * Adapters: If necessary, adapter classes can be defined here to bridge the gap between the domain models and the specific database technology (e.g., TypeORM, Mongoose).

* #### Domain:
  This folder houses the core domain logic of the application.
  * Entities: Domain entities represent user data and encapsulate business rules related to user validation and state management.
  * Ports: Interfaces defining the operations the domain layer expects from the external world (e.g., user repository, authentication service).

### Dependency Flow:
The dependency flow follows the hexagonal architecture principles:

* App Layer: Depends on the Domain layer through its ports.
* Domain Layer: Depends on its own ports (abstractions) and not on any specific implementation details of the data layer or external services.

This approach ensures that the domain logic remains independent of specific technologies and frameworks, facilitating testing and future changes.

### Benefits of Hexagonal Architecture:
Decoupling: The domain layer is independent of the infrastructure and application layers.
Testability: Domain logic can be easily tested in isolation without involving external dependencies.
Maintainability: Changes can be made to one layer without impacting others.
Flexibility: Different implementations can be plugged in for different infrastructure needs.
By adopting this hexagonal architecture approach, you create a robust and maintainable foundation for your Auth Server API in NestJS.


<br>
<br>

## Additional Notes:

This is a simple README file, and specific details may need to be adjusted based on your implementation.
Security is paramount for authentication systems. Ensure proper security practices like secure password hashing and access control are implemented.
Consider including API documentation tools like Swagger or OpenAPI to generate interactive API documentation.
Feel free to 
Further Development:
* Support for additional identity providers beyond Auth0, like Keycloak (an open source option).
* Implement user roles and permissions (currently it's kept for each individual api client).
* Implement refresh tokens invalidations to old ones when a new one is issued.
* Implement encryption keys rotation for added security.

This Centralized Authentication API provides a robust foundation for managing user authentication across your applications, promoting code reusability and streamlining your backend development.

<br>

## Contributing

We welcome contributions from everyone, regardless of skill level. Here are some ways you can contribute:

- **Submit Bug Reports:** If you find any issues or unexpected behavior, please [open an issue](https://github.com/mansouryoussef286/auth-server/issues) on GitHub and provide as much detail as possible.
  
- **Request Features:** If you have ideas for new features or improvements, feel free to [submit a feature request](https://github.com/mansouryoussef286/auth-server/issues) or discuss them in the [discussions](https://github.com/mansouryoussef286/auth-server/discussions) section.

- **Contribute Code:** If you want to contribute code, please follow these steps:
  1. Fork the repository.
  2. Create a new branch for your feature or bug fix.
  3. Make your changes and ensure the tests pass.
  4. Commit your changes and push your branch to your fork.
  5. Open a pull request from your fork's branch to the main repository's `main` branch.

- **Provide Feedback:** Your feedback is valuable. If you have any suggestions for improving the project or the documentation, please let us know.

<br>

## Api Refrences

* <img id="code-flow-ref"> https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow
* <img id="auth0-quick-start"> https://manage.auth0.com/dashboard/us/dev-i4yy6aosmfbqnxq3/applications/7AtMgepqMwqvlgtKhV2vQy7YmWYCr3oI/quickstart
* <img id="auth0-native-authorize"> https://auth0.com/docs/api/authentication#social


## License:

This project is licensed under the MIT License: https://opensource.org/licenses/MIT.


