import { useState } from 'react'
export default function Home() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Internet',
      description: 'routine maintainence',
      healthStatus: 'HEALTHY',
    },
  ])
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
