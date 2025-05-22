import './App.css';
import AppContent from './components/AppContent';

function App() {
  return (
    <div
      id='main_container'
      className='h-screen w-screen flex items-center justify-center'
    >
      {/* our root component that holds the app */}
      <AppContent />
    </div>
  );
}

export default App;
