import { ToastContainer } from "react-toastify";
import Routing from "./routing/routing";
import { Toaster } from "react-hot-toast";
import Chatbot from "./components/student/contact/Chatbot";
import "./App.css";

function App() {

  return (
    <>
      <ToastContainer />
      <Toaster />
      <Chatbot />
      <Routing />
    </>
  );
}

export default App;
