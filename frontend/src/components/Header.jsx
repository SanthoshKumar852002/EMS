const Header = ({ title, subtitle }) => (
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-md animate-pulse">{title}</h1>
    <p className="text-xl text-gray-300 mt-2">{subtitle}</p>
  </div>
);

export default Header;
