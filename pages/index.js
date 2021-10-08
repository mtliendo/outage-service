import { useState, useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { listTeams } from '../src/graphql/queries'
import { onUpdateTeam } from '../src/graphql/subscriptions'
export default function Home() {
	const [teams, setTeams] = useState([
		{
			id: 1,
			name: 'Internet',
			description: 'routine maintainence',
			healthStatus: 'HEALTHY',
		},
	])

	useEffect(() => {
		// todo: fetch the latest Teams
		// todo: setup subscription to listen for changes
		// ! unsubscribe when the component goes away
		API.graphql({ query: listTeams })
			.then((data) => console.log(data))
			.catch((e) => console.log(e))
	}, [])

	useEffect(() => {
		const subscription = API.graphql(graphqlOperation(onUpdateTeam)).subscribe({
			next: ({ provider, value }) => console.log({ provider, value }),
			error: (error) => console.warn(error),
		})

		return () => subscription.unsubscribe()
	}, [])
	return (
		<div style={{ width: '60vw', margin: '0 auto' }}>
			<h1 style={{ textAlign: 'center' }}>Public Outage Service</h1>
			{teams.map((team) => (
				<article
					key={team.id}
					style={{ display: 'flex', justifyContent: 'space-between' }}
				>
					<div>
						<h3>{team.name}</h3>
						<p>{team.description}</p>
					</div>
					<div
						style={{
							width: '50px',
							height: '50px',
							border: '1px solid black',
							backgroundColor: `${
								team.healthStatus === 'HEALTHY' ? 'lightgreen' : 'red'
							} `,
						}}
					/>
				</article>
			))}
		</div>
	)
}

// {
// "query": "mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id name description healthStatus createdAt updatedAt } }",
// "operationName": "updateTeam",
// "variables": {
// "input": {
// "id": "<id>",
// "name": "<name>",
// "description": "<description>",
// "healthStatus": "<healthStatus>",
// "updatedAt": "<updatedAt>"
// }
// }
// }
// {
// "query": "mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id name description healthStatus createdAt updatedAt } }",
// "operationName": "updateTeam",
// "variables": {
// "input": {
// "id": "1a",
// "healthStatus": "HEALTHY",
// }
// }
// }
