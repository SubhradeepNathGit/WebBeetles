import { ToastContainer } from "react-toastify";
import "./App.css";
import Routing from "./routing/routing"; 
import { Toaster } from "react-hot-toast";

function App() {
 
  return (
    <>
    <ToastContainer/>
    <Toaster />
      <Routing />
    </>
  );
}

export default App;
