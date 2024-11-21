import AddInputs from "../components/AddInputs";
import AddTotalAmount from "../components/AddTotalAmount";
import PieChart from "../components/PieChart";
import Topbar from "../components/Topbar"
import "../App.css"

const AddPage = () => {
  return (
    <div className="border-2 border-black rounded-xl w-96 h-[45rem]  overflow-scroll scroll-container">
      <Topbar />
      <AddInputs />
      <AddTotalAmount />
      <PieChart />
    </div>
  )
}

export default AddPage;
