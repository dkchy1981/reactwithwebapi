import logo from './logo.svg';
import './App.css';
import MyComponent from './components/MyComponent/MyComponent'
import Products from './components/Products/Products'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MyComponent/>
        <Products/>
      </header>
    </div>
  );
}

export default App;
