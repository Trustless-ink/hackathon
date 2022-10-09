import './sidebar.scss'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StoreIcon from '@mui/icons-material/Store'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import InputOutlinedIcon from '@mui/icons-material/InputOutlined'
import { Link } from 'react-router-dom'

const Sidebar = () => {
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

          <Link to="/fundprojects" style={{ textDecoration: 'none' }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Fund Projects</span>
            </li>
          </Link>

          <Link to="/logout" style={{ textDecoration: 'none' }}>
            <li>
              <InputOutlinedIcon className="icon" />
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom"></div>
    </div>
  )
}

export default Sidebar
