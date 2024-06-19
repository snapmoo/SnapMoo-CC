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
**AUTH:**
- POST Register user
/register

- POST Login user
/login

USER:
- GET user profile
/user

- PUT update user profile
/user

**HISTORY:**
- POST add prediction history for the authenticated user
/history

- GET prediction history for the authenticated user
/history

- GET all bookmarked history for the authenticated user
/history/save

- PUT update saved status for a history record for the authenticated user
/history/save/:id

**REPORT:**
- GET all reports
/report

- GET report by ID
/report/:id

- POST new report
/report

**ARTICLE:**
- GET all articles /articles


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
Create a temporary api that can be run locally using port 8080.
After completing the creation, we tried it on postman. After trying it for the register and login section, it has run well, but the others still need adjustments.
After knowing there are some that need adjustments, we reported it to the team, especially to the MD team and they provided some adjustments as well.
Then we made a new one and can run on local.

## Stage 3: Configuration with Firestore and Cloud Storage Buckets
After creating local-only, we then made adjustments so that it could be configured with firestore as our database repository. We had a little trouble configuring it at first, but after communicating with Advisor, we were able to get it done. After that, we also configured the cloud storage bucket that will store photos for user profiles and cow scan photos from the app later.

## Stage 4: Upload to Github
After the creation is complete, we start to upload to the github repository that was created earlier. This is useful for deploying later in the cloud run.

## Stage 5: Deploy Cloud Run
After all the preparations had been completed, we then deployed the rest api that we had created earlier using cloud run. After deploying, the base URL has been obtained and can be used by the MD team.

## Stage 6: Adjustment and Monitoring
After the deployment is complete, we then make adjustments, starting from the presence of wrong endpoints, leaked data and other adjustments needed by the application. Finally, we monitor whether it is running properly.
