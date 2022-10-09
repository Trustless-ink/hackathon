import './home.scss'
import Sidebar from '../../components/sidebar/Sidebar'

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <h1>WELCOME TO TRUSTLESS INK</h1>
      </div>
    </div>
  )
}

export default Home
