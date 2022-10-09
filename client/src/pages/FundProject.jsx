import './single.scss'
import Sidebar from '../components/sidebar/Sidebar'

const FundProject = () => {
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <div className="top">
          <center>
            <div className="left">
              <h1>Fund Project</h1>
              <label>Project ID</label>
              <br />
              <input type="text" className="cool-button" />
              <br />
              <br />
              <label>Funding Amount in ETH</label>
              <br />
              <input type="number" className="cool-button" />
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

export default FundProject
