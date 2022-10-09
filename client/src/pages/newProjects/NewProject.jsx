import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'

const NewProject = () => {
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <center>
            <div className="left">
              <label>Project Name</label>
              <br />
              <input type="text" className="cool-button" />
              <br />
              <br />
              <label>Description</label>
              <br />
              <input type="text" className="cool-button" />
              <br />
              <br />
              <h1 className="cool-button">Submit</h1>
            </div>
          </center>
          <div className="right"></div>
        </div>
      </div>
    </div>
  )
}

export default NewProject
