import './single.scss'
import Sidebar from '../components/sidebar/Sidebar'
import {
  getAllProjects,
  getFounderProjects,
  getFundsAvailability,
  withdrawFundingCall,
} from '../helpers/contractCalls'
import { useState, useEffect, useContext } from 'react'
import Context from '../helpers/Context'

import { LinearProgress } from '@mui/material'

const FounderPortal = () => {
  const { contextValue } = useContext(Context)

  const [projects, setProjects] = useState([])
  const [ownedProjects, setOwnedProjects] = useState([])
  const [fundsAvailable, setFundsAvailable] = useState([])
  const [status, setStatus] = useState('')
  useEffect(() => {
    const seeProjects = async () => {
      const _ownedProjects = await getFounderProjects(contextValue)
      const availability = []
      for (let i = 0; i < _ownedProjects.length; ++i) {
        availability.push(await getFundsAvailability(_ownedProjects[i]))
      }
      setFundsAvailable(availability)

      setProjects(await getAllProjects())
      setOwnedProjects(_ownedProjects)
    }
    seeProjects()
  }, [contextValue])

  const withdrawFunding = async (tokenID) => {
    // await withdrawFundingCall(contextValue, tokenID)
    setStatus("Funds will be disbursed to your wallet")
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <center>
            <h1>Projects Founded</h1>
            {ownedProjects.map((projectID, key) => {
              return (
                <div className="left" key={'project-list-' + key}>
                  <div>
                    <h3>Project Details</h3>
                    <b>ID:</b>
                    {projectID}
                    <br />
                    <b>Title:</b>
                    {projects[projectID - 1].title}
                    <br />
                    <b>Description:</b>
                    {projects[projectID - 1].description}
                    <br />
                    <b>Balance:</b>
                    {projects[projectID - 1].projectBalance}
                    <br />
                    <b>Funding Goals:</b>
                    {projects[projectID - 1].projectGoal}
                    <br />
                    <b>Funding Available:</b>
                    {20000000000000000}
                    <br />
                    <br />
                    <LinearProgress
                      variant="determinate"
                      value={
                        (projects[projectID - 1].projectBalance /
                          projects[projectID - 1].projectGoal) *
                        100
                      }
                    />
                    <br />

                    <div onClick={async () => await withdrawFunding(projectID)}>
                      <h1 className="cool-button">Disburse Funding</h1>
                    </div>

                    <br />
                    {status}
                  </div>
                  <br />
                </div>
              )
            })}
          </center>
          <div className="right"></div>
        </div>
      </div>
    </div>
  )
}

export default FounderPortal
