Base URL: https://apksnapmoo-ialuzwj3ca-et.a.run.app

AUTH:
POST Register user
/register
POST Login user
/login

USER:
GET user profile 
/user
PUT update user profile
/user

HISTORY:
POST add prediction history for the authenticated user 
/history
GET prediction history for the authenticated user 
/history
GET 
/history/save
PUT update saved status for a history record for the authenticated user
/history/save/:id 

Report
GET all reports /report
GET report by ID /report/:id 
POST new report /report
