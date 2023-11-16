import './App.css';
import SideNav from './components/SideNav';
import { Outlet } from 'react-router';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document.title = 'Fit Fusion';
  }, []);

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

