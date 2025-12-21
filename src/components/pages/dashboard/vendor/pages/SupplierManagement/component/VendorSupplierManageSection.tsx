import StatsCards from "../../../component/OverViewComponent/StatsCards";
import SupplierTable from "../../../component/OverViewComponent/SupplierTable";

export default function VendorSupplierManageSection() {

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-20">
      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center sm:text-left">
          Welcome Back, Arwen
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base text-center sm:text-left">
          Monitor all suppliers and their compliance status
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="px-4 sm:px-6 lg:px-0">
        <StatsCards />
      </div>

      {/* Supplier Table Section */}
      <div className="px-4 sm:px-6 lg:px-0">
        <SupplierTable  />
      </div>
    </div>
  );
}