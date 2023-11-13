import './App.css';
import SideNav from './components/SideNav';
import { Outlet } from 'react-router';


function App() {
  return (
    <div className="App">
      <hr className='top-bar'></hr>
      <SideNav/>
      <div className='page-container'>
        <Outlet/>
      </div>
    </div>
  );
}

export default App;

