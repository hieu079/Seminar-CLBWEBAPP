// App.js
import './App.css'; // Có thể loại bỏ nếu không dùng
import { routes } from './Routers';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((item, index) => {
          let { path, component } = item;
          // Ở đây, 'component' là tham chiếu đến component, KHÔNG phải JSX
          return <Route key={index} path={path} Component={component}></Route>
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
