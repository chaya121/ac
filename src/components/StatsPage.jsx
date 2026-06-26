import React, { useMemo, useState } from 'react';

export default function StatsPage({ records }) {
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterMer, setFilterMer] = useState('');

  const uniqueCustomers = useMemo(() => {
    const customers = new Set();
    records.forEach(r => {
      if (r.customer) customers.add(r.customer);
    });
    return Array.from(customers).sort();
  }, [records]);

  const uniqueMers = useMemo(() => {
    const mers = new Set();
    records.forEach(r => {
      if (r.merText) mers.add(r.merText);
    });
    return Array.from(mers).sort();
  }, [records]);

  const availableBrands = useMemo(() => {
    if (!filterCustomer) {
      const brands = new Set();
      records.forEach(r => {
        if (r.brand) brands.add(r.brand);
      });
      return Array.from(brands).sort();
    } else {
      const brands = new Set();
      records.forEach(r => {
        if (r.customer === filterCustomer && r.brand) brands.add(r.brand);
      });
      return Array.from(brands).sort();
    }
  }, [records, filterCustomer]);

  const handleCustomerChange = (e) => {
    setFilterCustomer(e.target.value);
    setFilterBrand('');
  };

  const handleMerChange = (e) => {
    setFilterMer(e.target.value);
  };

  const stats = useMemo(() => {
    const filteredRecords = records.filter(r => {
      const matchCustomer = !filterCustomer || r.customer === filterCustomer;
      const matchBrand = !filterBrand || r.brand === filterBrand;
      const matchMer = !filterMer || r.merText === filterMer;
      return matchCustomer && matchBrand && matchMer;
    });

    const tot = filteredRecords.length;
    let sTot = 0;
    let qTot = 0;
    let estPriceTotal = 0;
    let actualPriceTotal = 0;
    const groups = {};

    filteredRecords.forEach(r => {
      const steps = r.steps || [];
      sTot += steps.length;
      qTot += parseInt(r.qty || 0, 10);
      estPriceTotal += parseFloat(r.estWage || 0);
      actualPriceTotal += parseFloat(r.actual?.total || 0);
      
      const brand = r.brand || 'ไม่ระบุ';
      if (!groups[brand]) {
        groups[brand] = { count: 0, qty: 0, estPrice: 0, actualPrice: 0, customers: new Set() };
      }
      groups[brand].count++;
      groups[brand].qty += parseInt(r.qty || 0, 10);
      groups[brand].estPrice += parseFloat(r.estWage || 0);
      groups[brand].actualPrice += parseFloat(r.actual?.total || 0);
      if (r.customer) {
        groups[brand].customers.add(r.customer);
      }
    });

    const arr = Object.keys(groups)
      .map(k => ({ name: k, ...groups[k], customers: Array.from(groups[k].customers) }))
      .sort((a, b) => b.count - a.count);

    return {
      totalForms: tot,
      totalSteps: sTot,
      avgSteps: tot ? (sTot / tot).toFixed(1) : 0,
      totalQty: qTot,
      totalEstPrice: estPriceTotal,
      totalActualPrice: actualPriceTotal,
      groupedStats: arr,
    };
  }, [records, filterCustomer, filterBrand, filterMer]);

  return (
    <div className="page active">
      <div className="stat-hdr" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px' }}>📊 สถิติการผลิต</h2>
        <p style={{ fontSize: '16px' }}>ข้อมูลรวมทั้งหมด</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-box" style={{ padding: '20px' }}>
          <div className="sn" style={{ fontSize: '36px' }}>{stats.totalForms}</div>
          <div className="sl" style={{ fontSize: '16px' }}>ใบขั้นตอนการผลิต</div>
        </div>
      </div>

      <div className="form-card" style={{ padding: '20px 22px' }}>
        <div className="sec-label" style={{ fontSize: '16px' }}>🔍 กรองข้อมูล</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
          <div>
            <label style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>ลูกค้า</label>
            <select
              className="form-input"
              value={filterCustomer}
              onChange={handleCustomerChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' }}
            >
              <option value="">ทั้งหมด</option>
              {uniqueCustomers.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>แบรนด์</label>
            <select
              className="form-input"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' }}
              disabled={!filterCustomer}
            >
              <option value="">ทั้งหมด</option>
              {availableBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Mer</label>
            <select
              className="form-input"
              value={filterMer}
              onChange={handleMerChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px' }}
            >
              <option value="">ทั้งหมด</option>
              {uniqueMers.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        {(filterCustomer || filterBrand || filterMer) && (
          <div style={{ marginTop: '12px', fontSize: '15px', color: 'var(--primary)' }}>
            แสดง {stats.totalForms} รายการ
          </div>
        )}
      </div>

      <div className="form-card" style={{ padding: '20px 22px' }}>
        <div className="sec-label" style={{ fontSize: '16px' }}>👕 สถิติตามรุ่น / แบรนด์</div>
        
        {stats.groupedStats.length > 0 ? (
          <div>
            {stats.groupedStats.map((x, i) => (
              <div className="type-row" key={i} style={{ padding: '14px 0' }}>
                <div className="ic" style={{ fontSize: '28px' }}>👕</div>
                <div className="inf">
                  <div className="nm" style={{ fontSize: '16px' }}>{x.name}</div>
                  <div className="dt" style={{ fontSize: '14px' }}>
                    ผลิต {x.qty.toLocaleString()} ตัว · {x.count} ใบ
                  </div>
                  {x.customers.length > 0 && (
                    <div className="dt" style={{ fontSize: '14px', color: 'var(--muted)' }}>
                      ลูกค้า: {x.customers.join(', ')}
                    </div>
                  )}
                  <div className="dt" style={{ fontSize: '14px', color: 'var(--muted)' }}>
                    ราคาประมาณ: {x.estPrice.toLocaleString()} บาท · ราคาจริง: {x.actualPrice.toLocaleString()} บาท
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty" style={{ padding: '32px' }}>
            <div className="ei" style={{ fontSize: '48px' }}>📊</div>
            <p style={{ fontSize: '16px' }}>ยังไม่มีข้อมูล</p>
          </div>
        )}
      </div>
    </div>
  );
}
