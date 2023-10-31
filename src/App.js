import './App.css';
import { Outlet } from 'react-router';

function App() {
  return (
    <div className="App">
      <div className='page-container'>
        <Outlet/>
      </div>
    </div>
  );
}

export default App;
