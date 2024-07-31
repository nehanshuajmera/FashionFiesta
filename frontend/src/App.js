import './App.css';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/homepage/homepage.component';
import { ShopPage } from './pages/shop/shop.component';
import { Header } from './universal/header/header.component';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/shop' element={<ShopPage />} />
      </Routes>
    </div>
  )
}

export default App;