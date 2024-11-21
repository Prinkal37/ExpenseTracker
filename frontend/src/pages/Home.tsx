import Credit from "../components/Credit"
import Debit from "../components/Debit"
import Receivable from "../components/Receivable"
import Topbar from "../components/Topbar"
import TotalAmount from "../components/TotalAmount"
import '../App.css'
import Debt from "../components/Debt"


const Home = () => {
  return (
    <div className="border-2 border-black rounded-xl w-96 h-[45rem] overflow-scroll scroll-container">
      <Topbar />
      <TotalAmount />
      <Credit />
      <Debit />
      <Receivable />
      <Debt />
    </div>
  )
}

export default Home
