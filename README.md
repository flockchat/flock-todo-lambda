# flock-todo-lambda

A simple todo app for Flock using AWS Lambda and API Gateway.

# ToDo App Architecture

![ToDo app architecture](/images/todo-app-architecture.png)

# Installation

## 1. Download source

```
git clone git@github.com:flockchat/flock-todo-lambda.git
```

## 2. Install dependencies

```
cd flock-todo-lambda
npm install
```

## 3. Setup app in [FlockOS developer dashboard](https://dev.flock.co)

### Create FlockOS app
![Create Flock app](/images/create-flock-app.png)

### Configure FlockOS app
![Configure Flock app](/images/configure-flock-app.png)

## 4. Setup RDS and create your tables 

Use [schema.sql](/schema.sql) for this.

## 5. Update config.js with app id, secret and RDS credentials

On creating FLockOS app, you will get app id and secret like following:

![FlockOS app details](/images/flock-app-id-and-secret.png)

Put these and RDS credentials in config.js file

## 6. Setup the Lambda function on AWS

### Choose basic hello-world lambda function template on aws

![Hello-world lambda](/images/lambda-hello-world.png)

### Configuring lambda function

Use the "Upload .ZIP file' for 'Code entry type' and upload the zip of whole source code in the 'Function package' option.

![Lambda configuration](/images/lambda-configuration.png)

## 7. Setup API Gateway

### Create resources and methods on API gateway

Make sure you check "use Lambda Proxy Integration" checkbox. 

![API gateway configuration](/images/api-gateway-configure.png)

### Deploy API gateway

You will get your API endpoint URL after deployment (the one shown in red box below).

![API gateway deployment](/images/api-gateway-deploy.png)

## 8. Install and test your app
