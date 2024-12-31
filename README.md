# learning-management

to run:

- spin up dynamo db with Java command:
  - java -Djava.library.path=/Users/joaovictorlira/dynamodb_local/DynamoDBLocal_lib -jar /Users/joaovictorlira/dynamodb_local/DynamoDBLocal.jar -sharedDb -dbPath {{argument_1}}
- access dynamo db with aws credentials
  - aws configure &&
    aws dynamodb list-tables --endpoint-url {{argument_1}}
- to spin up the api on server folder: run 
  - npm run dev
- finally to spin up the frontend on client folder:
  - npm run dev
