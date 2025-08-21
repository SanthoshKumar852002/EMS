
import Header from "../components/Header";
import OverviewCards from "../components/Overviewcards";
import LeaveSummary from "../components/LeaveSummary";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Main Content */}
      <div className="flex-1 bg-white text-black p-6">
        {/* Top Header */}
        <Header
          title="💼 Employee Management System"
          subtitle="📊 Admin Dashboard Overview"
        />

        {/* Overview Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <OverviewCards />
        </section>

        {/* Leave Summary Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">📝 Leave Summary</h2>
          <LeaveSummary />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
