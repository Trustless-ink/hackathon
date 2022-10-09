import './single.scss'
import Sidebar from '../components/sidebar/Sidebar'
import {
  getAllProjects,
  getInvestorProjects,
  cancelFundingCall,
} from '../helpers/contractCalls'
import { useState, useEffect, useContext } from 'react'
import Context from '../helpers/Context'

import { LinearProgress } from '@mui/material'

const InvestorPortal = () => {
  const { contextValue } = useContext(Context)

  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('')
  const [ownedProjects, setOwnedProjects] = useState([])

  useEffect(() => {
    const seeProjects = async () => {
      const ownedProjects = await getInvestorProjects(contextValue)
      const projects = await getAllProjects()
      setOwnedProjects(ownedProjects)
      setProjects(projects)
    }
    seeProjects()
  }, [contextValue])

  const cancelFunding = async (tokenID) => {
    // await cancelFundingCall(contextValue, tokenID)
    setStatus(
      'Emergency break for project ' +
        tokenID +
        ' has been initiated, if support level reaches 33% threshold you will be refunded',
    )
  }
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <center>
            <h1>Supported Projects</h1>
            {ownedProjects.map((projectID, key) => (
              <>
                <div className="left">
                  <div key={'project-list-' + key}>
                    <h3>Project Details</h3>
                    <b>ID:</b>
                    {key + 1}
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
                    <br />
                    <div onClick={async () => await cancelFunding(projectID)}>
                      <h1 className="cool-button">Emergency Break</h1>
                    </div>
                  </div>
                </div>
                {status && <div className="bottom">{status}</div>}
              </>
            ))}
          </center>
          <div className="right"></div>
        </div>
      </div>
    </div>
  )
}

export default InvestorPortal
