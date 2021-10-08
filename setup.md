1. create a nextjs app: `npx create-next-app outage-service`
2. `cd outage-service`
3. `npm i -g @aws-amplify/cli` (at least version 6.1)
4. `npm i aws-amplify @aws-amplify/ui-react 👈 probably won't need the components
5. `amplify add api`

```graphql
type Team
	@model
	@auth(
		rules: [
			{ allow: public, operations: [read] }
			{ allow: private, provider: iam, operations: [create, update] }
		]
	) {
	id: ID!
	name: String!
	description: String
	healthStatus: HEALTH_STATUS!
}

enum HEALTH_STATUS {
	HEALTHY
	UNHEALTHY
}
```

---

### Configure Eventbridge

1. Setup API Destination with graphql endpoint
2. Set `x-api-key` as auth header in the "Connection" dropdown
3. Create the event bus with a policy that allows the following(?):

### Choose which sections to include in the policy to match your use case. Be sure to remove all lines that start with ###, including the ### at the end of the line.

### The policy must include the following:

{
"Version": "2012-10-17",
"Statement": [
{

        "Sid": "allow_account_to_put_events",
        "Effect": "Allow",
        "Principal": {
          "AWS": "<ACCOUNT_ID>"
        },
        "Action": "events:PutEvents",
        "Resource": "arn:aws:events:us-east-1:521776702104:event-bus/Outages-Event-Bus"
      },

]
}

```js
{
"source": ["team.status"],
"detail-type": ["Update Team Health"]
}
```

```js
{
"id": "$.id",
"name": "$.detail.name",
"description": "$.detail.description",
"healthStatus": "$.detail.healthStatus",
"updatedAt": "$.time"
}
```

// This HAS TO BE A STRING!!!

```js
{
"query": "mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id name description healthStatus createdAt updatedAt } }",
"operationName": "UpdateTeam",
"variables": {
"input": {
"id": "<id>",
"name": "<name>",
"description": "<description>",
"healthStatus": "<healthStatus>",
"updatedAt": "<updatedAt>"
}
}
}
```

```js
// sample event
{
"id":"134",
"account":"222",
"time":"2021-09-30T04:06:02Z",
"region":"us-east-1",
"resources":"all",
"source": "team.status",
"detail-type": "Update Team Health",
"detail":{
"id":"123",
"name":"internet",
"description":"BACK TO NORMAL",
"healthStatus":"HEALTHY"
}
}
```

```js
//sample query
{
  "data": {
    "listTeams": {
      "items": [
        {
          "createdAt": "2021-09-30T04:06:02Z",
          "description": "HOpe this works!",
          "healthStatus": "UNHEALTHY",
          "id": "123456",
          "name": "Internet",
          "updatedAt": "2021-09-30T04:35:34.862Z"
        }
      ]
    }
  }
}

```

// ! working create transformer and template:

{"description":"$.detail.description","healthStatus":"$.detail.healthStatus","name":"$.detail.name","updatedAt":"$.time"}

{ "query": "mutation CreateTeam($input: CreateTeamInput!) { createTeam(input: $input) { id } }", "operationName": "CreateTeam", "variables": { "input": { "healthStatus": <healthStatus>, "name": <name>, "description": <description> } } }

{ "query": "mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id } }", "operationName": "UpdateTeam", "variables": { "input": { "id": "0a097488-c26c-4816-8ceb-b0054c374217", "healthStatus": <healthStatus>, "name": <name>, "description": "successfully changed" } } }
