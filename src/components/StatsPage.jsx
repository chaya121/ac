import React, { useMemo } from 'react';

export default function StatsPage({ records }) {
  const stats = useMemo(() => {
    const tot = records.length;
    let sTot = 0;
    let qTot = 0;
    const groups = {};

    records.forEach(r => {
      const steps = r.steps || [];
      sTot += steps.length;
      qTot += parseInt(r.qty || 0, 10);
      
      const n = r.brand || r.model || r.customer || 'ไม่ระบุ';
      if (!groups[n]) {
        groups[n] = { count: 0, qty: 0 };
      }
      groups[n].count++;
      groups[n].qty += parseInt(r.qty || 0, 10);
    });

    const arr = Object.keys(groups)
      .map(k => ({ name: k, ...groups[k] }))
      .sort((a, b) => b.count - a.count);

    return {
      totalForms: tot,
      totalSteps: sTot,
      avgSteps: tot ? (sTot / tot).toFixed(1) : 0,
      totalQty: qTot,
      groupedStats: arr,
    };
  }, [records]);

  return (
    <div className="page active">
      <div className="stat-hdr">
        <h2>📊 สถิติการผลิต</h2>
        <p>ข้อมูลรวมทั้งหมด</p>
      </div>
      
      <div className="stat-grid">
        <div className="stat-box">
          <div className="sn">{stats.totalForms}</div>
          <div className="sl">ใบดีทั้งหมด</div>
        </div>
        <div className="stat-box">
          <div className="sn">{stats.totalSteps}</div>
          <div className="sl">ขั้นตอนรวม</div>
        </div>
        <div className="stat-box">
          <div className="sn">{stats.avgSteps}</div>
          <div className="sl">เฉลี่ยขั้นตอน/ใบ</div>
        </div>
        <div className="stat-box">
          <div className="sn">{stats.totalQty.toLocaleString()}</div>
          <div className="sl">ตัวผลิตรวม</div>
        </div>
      </div>

      <div className="form-card" style={{ padding: '16px 18px' }}>
        <div className="sec-label">👕 สถิติตามรุ่น / แบรนด์</div>
        
        {stats.groupedStats.length > 0 ? (
          <div>
            {stats.groupedStats.map((x, i) => (
              <div className="type-row" key={i}>
                <div className="ic">👕</div>
                <div className="inf">
                  <div className="nm">{x.name}</div>
                  <div className="dt">ผลิต {x.qty.toLocaleString()} ตัว</div>
                </div>
                <div className="type-badge">
                  <span className="tn">{x.count}</span>
                  <span className="tl">ใบดี</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty" style={{ padding: '28px' }}>
            <div className="ei" style={{ fontSize: '42px' }}>📊</div>
            <p>ยังไม่มีข้อมูล</p>
          </div>
        )}
      </div>
    </div>
  );
}
