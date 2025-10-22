// src/App.tsx
// import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    // 1. Set the main container to at least the full screen height
    // 2. Use flexbox to arrange children in a column
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}

      {/* 3. The 'main' area will grow to fill all available space, pushing the footer down */}
      <main className="flex-grow">
        <HomePage />
      </main>

      <Footer />
    </div>
  );
}

export default App;