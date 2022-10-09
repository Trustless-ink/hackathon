import './single.scss'
import Sidebar from '../components/sidebar/Sidebar'
import { useContext, useState } from 'react'
import Context from '../helpers/Context'
import { fundNFTCall } from '../helpers/contractCalls'

const FundProject = () => {
  const { contextValue } = useContext(Context)
  const [inputs, setInputs] = useState({
    id: '',
    amount: '',
  })

  const onInputChange = (e) => {
    setInputs((i) => ({
      ...i,
      [e.target.name]: e.target.value,
    }))
  }

  const fundProject = async () => {
    const { status } = await fundNFTCall(inputs, contextValue)
    console.log(status)
  }

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
              <input
                type="text"
                className="cool-button"
                value={inputs.id}
                name="id"
                onChange={onInputChange}
              />
              <br />
              <br />
              <label>Funding Amount in ETH</label>
              <br />
              <input
                type="number"
                className="cool-button"
                value={inputs.amount}
                name="amount"
                onChange={onInputChange}
              />
              <br />
              <br />
              <div onClick={fundProject}>
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

export default FundProject
