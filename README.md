# 🚀 Serverless AI-Powered Task Tracker

A fully serverless web application built on AWS that allows users to securely manage tasks (Create, View, Update, Delete) and receive AI-powered task prioritization suggestions via Amazon Bedrock.  
This project demonstrates the integration of **React, Amplify, Lambda, API Gateway, DynamoDB, Cognito, and Bedrock** in a production-ready workflow with CI/CD.

---

## 📊 Features
- 🔐 **Secure Authentication** with Amazon Cognito (email-based login).
- 📋 **Task Management (CRUD)** with API Gateway + Lambda + DynamoDB.
- ⚡ **GraphQL API** via AppSync for clean queries and mutations.
- 🤖 **AI-Powered Task Prioritization** using Amazon Bedrock.
- 🚀 **CI/CD with Amplify** → GitHub push auto-deploys to Amplify hosting.
- 📈 **Monitoring & Logs** via CloudWatch.

---

## 🏗️ Architecture

**Frontend**: React (Amplify Hosting)  
**Backend**: Lambda (Node.js/Python) behind API Gateway/AppSync  
**Data Layer**: DynamoDB (Tasks table)  
**Auth**: Amazon Cognito (User Pool + App Client)  
**AI**: Amazon Bedrock (Foundation Model integration)  
**CI/CD**: Amplify connected to GitHub  
**Monitoring**: CloudWatch (logs + alarms)  

