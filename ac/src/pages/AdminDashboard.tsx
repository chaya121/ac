import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-3">

        <h4 className="mb-3">📋 Admin Dashboard</h4>

        {/* Product */}
        <div className="card p-3 mb-3 shadow-sm">
          <h5>ข้อมูลสินค้า</h5>

          <div className="row g-2">
            <div className="col-md-3">
              <input className="form-control" placeholder="สินค้า" />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="ผ้า" />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="จำนวน" />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="ราคา" />
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="card p-3 mb-3 shadow-sm">
          <h5>รูปสินค้า</h5>
          <input type="file" className="form-control" />
        </div>

        {/* Production */}
        <div className="card p-3 mb-3 shadow-sm">
          <h5>Production</h5>

          <div className="row g-2">
            <div className="col-md-4">
              <input className="form-control" placeholder="เข้า" />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="เสร็จ" />
            </div>
            <div className="col-md-4">
              <div className="bg-danger text-white text-center p-3 rounded">
                คงเหลือ
                <h4>0</h4>
              </div>
            </div>
          </div>
        </div>

        {/* QC */}
        <div className="card p-3 shadow-sm">
          <h5>QC</h5>

          {["Cutting", "Sewing", "Final"].map((item) => (
            <div className="row g-2 mb-2" key={item}>
              <div className="col-md-3">{item}</div>
              <div className="col-md-3">
                <input className="form-control" placeholder="ทั้งหมด" />
              </div>
              <div className="col-md-3">
                <input className="form-control" placeholder="ผ่าน" />
              </div>
              <div className="col-md-3">
                <div className="bg-light text-center p-2 rounded">
                  Fail: 0
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}