import Navbar from "../components/Navbar";

export default function ManagerDashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-3">

        <h4 className="mb-3">📊 Manager Dashboard</h4>

        {/* KPI */}
        <div className="row g-3 mb-3">
          {["Confirm", "Ship", "Progress", "QC Fail"].map((item, i) => (
            <div className="col-md-3 col-6" key={i}>
              <div className="card text-center p-3 shadow-sm">
                <h6>{item}</h6>
                <h4>0</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Report */}
        <div className="card p-3 shadow-sm">
          <h5>📅 รายงาน</h5>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ช่วงเวลา</th>
                  <th>ยอดเงิน</th>
                  <th>เสร็จ</th>
                  <th>คงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Week 1</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}