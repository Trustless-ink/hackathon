import './sidebar.scss'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StoreIcon from '@mui/icons-material/Store'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import InputOutlinedIcon from '@mui/icons-material/InputOutlined'

import { Link } from 'react-router-dom'
import Context from '../../helpers/Context'
import getWeb3 from '../../helpers/getWeb3'
import { useContext } from 'react'

const Sidebar = () => {
  const { contextValue, dispatchContextValue } = useContext(Context)

  const handleLogin = async () => {
    if (contextValue.loggedIn) {
      dispatchContextValue({
        type: 'logout',
      })
      return
    }
    try {
      // Get network provider (typically MetaMask) and web3 instance
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts from the provider (MetaMask)
      const accounts = await web3.eth.getAccounts()

      const networkId = await web3.eth.net.getId()

      dispatchContextValue({
        type: 'login',
        payload: { accounts, networkId },
      })
    } catch (error) {
      // Catch any errors for any of the above operations
      alert(
        `Failed to load web3, accounts, or contract. Did you migrate the contract or install MetaMask? Check console for details.`,
      )
      console.error(error)
    }
  }

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="logo">Trustless</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <Link to="/newproject" style={{ textDecoration: 'none' }}>
            <li>
              <StoreIcon className="icon" />
              <span>New Project</span>
            </li>
          </Link>
          <Link to="/seeprojects" style={{ textDecoration: 'none' }}>
            <li>
              <DashboardIcon className="icon" />
              <span>See Projects</span>
            </li>
          </Link>

          <Link to="/fundproject" style={{ textDecoration: 'none' }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Fund Projects</span>
            </li>
          </Link>
        </ul>
      </div>
      <button className="bottom" onClick={handleLogin}>
        <InputOutlinedIcon className="icon" />
        <span>{contextValue.loggedIn ? 'Logout' : 'login'}</span>
      </button>
    </div>
  )
}

export default Sidebar
