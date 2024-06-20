![alt text](https://github.com/snapmoo/snapmoo/blob/main/assets/Cloud%20Computing/gcp%20(1).jpg?raw-true)

# Overview
Cloud Computing is responsible for managing the flow of applications to the database. To manage all this, we need an API that we create using Node JS Express and then deploy through Cloud Run.

# Architecture

![alt text](https://github.com/snapmoo/snapmoo/blob/main/assets/Cloud%20Computing/infrastuktur.drawio%20(2).png?raw-true)

The Architecture overview of the Snapmoo application encompasses the entire process from utilizing Node.js Express to generate endpoints, while seamlessly integrating with Google Cloud Platform

# Endpoint
## Base URL: https://apksnapmoo-ialuzwj3ca-et.a.run.app  
### BRANCH: /api
This is the source code for the endpoints available in our GitHub repository for further exploration. There are API source codes such as AUTH, USER, HISTORY, and REPORT API source codes  

| Method | Endpoint                                  | Description                                         |
|--------|-------------------------------------------|-----------------------------------------------------|
| **AUTH** |
| POST   | /register                                 | Register user                                       |
| POST   | /login                                    | Login user                                          |
| **USER** |
| GET    | /user                                     | Get user profile                                    |
| PUT    | /user                                     | Update user profile                                 |
| **HISTORY** |
| POST   | /history                                  | Add prediction history for the authenticated user   |
| GET    | /history                                  | Get prediction history for the authenticated user   |
| GET    | /history/save                             | Get all bookmarked history for the authenticated user |
| PUT    | /history/save/:id                         | Update saved status for a history record            |
| **REPORT** |
| GET    | /report                                   | Get all reports                                     |
| GET    | /report/:id                               | Get report by ID                                    |
| POST   | /report                                   | New report                                          |
| **ARTICLE** |
| GET    | /articles                                 | Get all articles                                    |



# Deploy 

![alt text](https://github.com/snapmoo/snapmoo/blob/main/assets/Cloud%20Computing/cloudrun.jpeg?raw-true)
Built using the Express framework, the API deployed using Cloud Run, and retrieving data from a database deployed using Firestore.

# Tool
- VS Code
- Postman
- Node js
- Express
- Google Cloud Platform
- Github

# Timeline
## Stage 1: Preparation for API Creation
In the first stage we prepare the things needed in making rest api, starting fromnNode js , postman, etc. to asking the MD what contract api is needed and claiming GCP dollars from Bangkit to deploy later. 

## Stage 2: Temporary API Creation
At this stage we try to create a temporary API according to what has been requested by the MD team. as for some of the stages as follows:
1. Create a temporary api that can be run locally using port 8080.  
2. After completing the creation, we tried it on postman.
3. After trying it for the register and login section, it has run well, but the others still need adjustments.
4. After knowing there are some that need adjustments, we reported it to the team, especially to the MD team and they provided some adjustments as well.
5. Then we made a new one and can run on local.

## Stage 3: Configuration with Firestore and Cloud Storage Buckets
After creating local-only, we then made adjustments so that it could be configured with firestore as our database repository. We had a little trouble configuring it at first, but after communicating with Advisor, we were able to get it done. After that, we also configured the cloud storage bucket that will store photos for user profiles and cow scan photos from the app later.

## Stage 4: Upload to Github
After the creation is complete, we start to upload to the github repository that was created earlier. This is useful for deploying later in the cloud run.

## Stage 5: Deploy Cloud Run
After all the preparations had been completed, we then deployed the rest api that we had created earlier using cloud run. After deploying, the base URL has been obtained and can be used by the MD team.

## Stage 6: Adjustment and Monitoring
After the deployment is complete, we then make adjustments, starting from the presence of wrong endpoints, leaked data and other adjustments needed by the application. Finally, we monitor whether it is running properly.
