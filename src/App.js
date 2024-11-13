import { BrowserRouter } from "react-router-dom";
import "./App.css";
import RouteList from "./Config/RouteList";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLos
      icon={true}
      draggable
      pauseOnHover
      theme="light"
    />
      <RouteList />
    </BrowserRouter>
  );
}

export default App;
