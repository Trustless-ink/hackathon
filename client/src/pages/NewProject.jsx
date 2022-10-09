import './single.scss'
import Sidebar from '../components/sidebar/Sidebar'
import { useContext, useState } from 'react'
import Context from '../helpers/Context'
import { mintProjectNFT } from '../helpers/contractCalls'

const NewProject = () => {
  const { contextValue } = useContext(Context)
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    funding: '',
    intervals: '',
    milestones: '',
  })

  const onInputChange = (e) => {
    setInputs((i) => ({
      ...i,
      [e.target.name]: e.target.value,
    }))
  }

  const createNewProject = async () => {
    const { status } = await mintProjectNFT(inputs, contextValue)
    console.log(status)
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <center>
            <div className="left">
              <h1>Create Project</h1>
              <label>Project Title</label>
              <br />
              <input
                type="text"
                className="cool-button"
                name="title"
                value={inputs.title}
                onChange={onInputChange}
              />
              <br />
              <br />
              <label>Description</label>
              <br />
              <input
                type="text"
                className="cool-button"
                name="description"
                value={inputs.description}
                onChange={onInputChange}
              />
              <br />
              <br />
              <label>Funding Requirements</label>
              <br />
              <input
                type="number"
                className="cool-button"
                name="funding"
                value={inputs.funding}
                onChange={onInputChange}
              />
              <br />
              <br />
              <label>Time Intervals</label>
              <br />
              <input
                type="number"
                className="cool-button"
                name="intervals"
                value={inputs.intervals}
                onChange={onInputChange}
              />
              <br />
              <br />
              <label>Milestones</label>
              <br />
              <input
                type="number"
                className="cool-button"
                name="milestones"
                value={inputs.milestones}
                onChange={onInputChange}
              />
              <br />
              <br />
              <div onClick={createNewProject}>
                <h1 className="cool-button">Submit</h1>
              </div>
            </div>
          </center>
          <div className="right"></div>
        </div>
      </div>
    </div>
  )
}

export default NewProject
