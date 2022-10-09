import './single.scss'
import Sidebar from '../components/sidebar/Sidebar'
import { getAllProjects } from '../helpers/contractCalls'
import { useState } from 'react'
import { useEffect } from 'react'

const SeeProjects = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const seeProjects = async () => {
      const projects = await getAllProjects()
      setProjects(projects)
    }
    seeProjects()
  }, [])

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <center>
            <div className="left">
              <h1>Projects List</h1>
              {projects.map((data, key) => (
                <div key={'project-list-' + key}>
                  <b>ID:</b>
                  {key + 1}
                  <br />
                  <b>Title:</b>
                  {data.title}
                  <br />
                  <b>Description:</b>
                  {data.description}
                  <br />
                  <br />
                </div>
              ))}
            </div>
          </center>
          <div className="right"></div>
        </div>
      </div>
    </div>
  )
}

export default SeeProjects
