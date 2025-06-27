const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to the MERN Blog!</h1>
    <p className="text-lg text-gray-700 mb-6 max-w-xl">
      Discover, create, and share amazing blog posts. Log in or register to get started, or browse the latest posts on the dashboard.
    </p>
    <a href="/dashboard" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition">Go to Dashboard</a>
  </div>
);

export default Home; 