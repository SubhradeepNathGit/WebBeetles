import { ToastContainer } from "react-toastify";
import Routing from "./routing/routing";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {

  return (
    <>
      <ToastContainer />
      <Toaster />
      <Routing />
    </>
  );
}

export default App;
