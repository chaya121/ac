import React, { useState, useMemo } from 'react';
import { generatePDF } from '../utils/pdfGenerator';
import { utils, writeFile } from 'xlsx';
import ViewModal from './ViewModal';

export default function DownloadPage({ records, onDelete, onLoad, showToast }) {
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [viewRecord, setViewRecord] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const uniqueCustomers = useMemo(() => {
    const customers = [...new Set(records.map(r => r.customer).filter(Boolean))];
    return customers.sort((a, b) => a.localeCompare(b, 'th'));
  }, [records]);

  const uniqueBrands = useMemo(() => {
    if (filterCustomer) {
      const brands = [...new Set(records.filter(r => r.customer === filterCustomer).map(r => r.brand).filter(Boolean))];
      return brands.sort((a, b) => a.localeCompare(b, 'th'));
    }
    const brands = [...new Set(records.map(r => r.brand).filter(Boolean))];
    return brands.sort((a, b) => a.localeCompare(b, 'th'));
  }, [records, filterCustomer]);

  const handleCustomerChange = (value) => {
    setFilterCustomer(value);
    setFilterBrand(''); // Reset brand when customer changes
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchCustomer = !filterCustomer || r.customer === filterCustomer;
      const matchBrand = !filterBrand || r.brand === filterBrand;
      return matchCustomer && matchBrand;
    });
  }, [records, filterCustomer, filterBrand]);
  const handleView = (record) => {
    setViewRecord(record);
    setIsViewModalOpen(true);
  };

  const handlePdfDownload = (record) => {
    generatePDF(
      record,
      () => showToast('กำลังสร้าง PDF...'),
      () => showToast('ดาวน์โหลดสำเร็จ'),
      () => showToast('เกิดข้อผิดพลาดในการสร้าง PDF', 'err')
    );
  };

  const confirmDelete = (id) => {
    if (window.confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
      onDelete(id);
    }
  };

  const handleExcelExport = () => {
    if (!records || records.length === 0) {
      showToast('ไม่มีข้อมูลใบดีสำหรับส่งออก', 'err');
      return;
    }
    
    try {
      const summaryData = records.map((r, idx) => {
        const steps = r.steps || [];
        const totalSec = steps.reduce((s, row) => s + (parseInt(row.time) || 0), 0);
        const totalMin = (totalSec / 60).toFixed(2);
        
        return {
          'ลำดับ': idx + 1,
          'วันที่': r.date || '-',
          'ผู้ประสานงาน (Mer)': r.merText || '-',
          'แบรนด์': r.brand || '-',
          'ลูกค้า': r.customer || '-',
          'ชื่อรุ่น': r.model || '-',
          'จำนวนผลิต (ตัว)': r.qty || 0,
          'ไซส์': r.size || '-',
          'จำนวนสี': r.colors || 0,
          'มีตัวอย่างจริง': r.sampleReal ? 'ใช่' : 'ไม่ใช่',
          'ตีราคาจากรูป': r.samplePic ? 'ใช่' : 'ไม่ใช่',
          'รายละเอียดงาน': r.detail || '-',
          'ปัก': r.chk?.pak ? `ปัก (${r.chk.pak_n})` : 'ไม่มี',
          'พิมพ์': r.chk?.print ? `พิมพ์ (${r.chk.print_n})` : 'ไม่มี',
          'ตัวรีดป้ายไซส์': r.chk?.tag ? 'มี' : 'ไม่มี',
          'ตัวรีดใหญ่': r.chk?.big ? `มี (${r.chk.big_n})` : 'ไม่มี',
          'รีดวีราเน่รองปัก': r.chk?.rib ? 'มี' : 'ไม่มี',
          'ส่งซัก': r.chk?.send ? `มี (${r.chk.send_n})` : 'ไม่มี',
          'ตัวรีดเล็ก': r.chk?.small ? `มี (${r.chk.small_n})` : 'ไม่มี',
          'Note ฝ่ายผลิต': r.noteProd || '-',
          'Note ฝ่ายขาย': r.noteSales || '-',
          'ผู้ดูแล (เมอร์)': r.supervisor || '-',
          'จำนวนคนเย็บ (ประเมิน)': r.sewers || 0,
          'ตัว/ชม (ประเมิน)': r.rate || 0,
          'ประเมินค่าแรง (บาท)': r.estWage || 0,
          'ราคา Confirmed': r.confirmed || '-',
          'ข้อควรระวัง': r.warning || '-',
          'วิธีแก้ไข': r.solution || '-',
          'เริ่มเย็บจริง': r.actual?.start || '-',
          'จบเย็บจริง': r.actual?.end || '-',
          'คนเย็บจริง': r.actual?.sewers || 0,
          'วันเย็บจริง': r.actual?.days || 0,
          'ตัว/ชม (จริง)': r.actual?.rate || 0,
          'ค่าแรงจริง': r.actual?.wage || 0,
          'ทุนรวมจริง': r.actual?.total || 0,
          'หมายเหตุจริง': r.actual?.remark || '-',
          'จำนวนขั้นตอนรวม': steps.length,
          'เวลาเย็บรวม (นาที)': totalMin
        };
      });

      const stepsData = [];
      records.forEach(r => {
        const steps = r.steps || [];
        steps.forEach((step, idx) => {
          stepsData.push({
            'แบรนด์': r.brand || '-',
            'ชื่อรุ่น': r.model || '-',
            'ลูกค้า': r.customer || '-',
            'ลำดับขั้นตอน': idx + 1,
            'ชิ้นส่วน': step.part || '-',
            'ขั้นตอนการเย็บ': step.step || '-',
            'เครื่องจักร': step.machine || '-',
            'เวลา (วินาที)': step.time || 0,
            'จำนวนคนงาน': step.workers || 1,
            'หมายเหตุ': step.note || '-'
          });
        });
      });

      const wb = utils.book_new();
      const wsSummary = utils.json_to_sheet(summaryData);
      const wsSteps = utils.json_to_sheet(stepsData);
      
      utils.book_append_sheet(wb, wsSummary, 'สรุปใบงานผลิต');
      utils.book_append_sheet(wb, wsSteps, 'ขั้นตอนการเย็บทั้งหมด');
      
      writeFile(wb, 'Apparel_Creations_Database.xlsx');
      showToast('ส่งออกไฟล์ Excel สำเร็จ');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการส่งออก Excel', 'err');
    }
  };

  return (
    <div className="page active">
      <div className="form-card" style={{ padding: '22px', textAlign: 'center' }}>
        <div style={{ fontSize: '50px', marginBottom: '8px' }}>📥</div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
          ประวัติใบดี & ดาวน์โหลด PDF
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
          จัดการข้อมูลใบขั้นตอนการผลิต ดาวน์โหลด PDF หรือส่งออก Excel
        </div>
        
        {/* Filter Section */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>กรองลูกค้า:</span>
            <select
              value={filterCustomer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
            >
              <option value="">ทั้งหมด</option>
              {uniqueCustomers.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>กรองแบรนด์:</span>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              disabled={!filterCustomer}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', opacity: filterCustomer ? 1 : 0.5 }}
            >
              <option value="">ทั้งหมด</option>
              {uniqueBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ fontSize: '14px', color: 'var(--primary)', marginTop: '10px', fontWeight: '600' }}>
          แสดง {filteredRecords.length} รายการ (จากทั้งหมด {records.length} รายการ)
        </div>

        <button
          className="btn-save"
          style={{
            background: records.length > 0 ? '#27ae60' : '#95a5a6',
            marginTop: '14px',
            width: '100%',
            cursor: records.length > 0 ? 'pointer' : 'not-allowed',
          }}
          onClick={handleExcelExport}
        >
          🟢 ส่งออกประวัติเป็น Excel (.xlsx)
        </button>
      </div>

      {filteredRecords.length > 0 ? (
        <div id="downloadList">
          {filteredRecords.map((r, i) => {
            const steps = r.steps || [];
            const totalSteps = steps.length;
            const title = r.model || r.brand || r.customer || '(ไม่ระบุ)';
            const dateStr = r.dispDate || 'ไม่ระบุวันที่';
            const merStr = Array.isArray(r.mer) ? r.mer.join(', ') : (r.mer || r.merText || '-');

            return (
              <div className="rec-card" key={r.id || i}>
                <div className="rec-hdr">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="rec-title">{title}</div>
                    <div className="rec-sub">
                      ลูกค้า: {r.customer || '-'} · แบรนด์: {r.brand || '-'}<br />
                      ราคาประมาณ: {r.estWage ? `${r.estWage.toLocaleString()} บาท` : '-'} · ราคาจริง: {r.actual?.total ? `${r.actual.total.toLocaleString()} บาท` : '-'}
                    </div>
                    <div className="rec-sub" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {dateStr} · เมอร์: {merStr} · จำนวน: {r.qty || 0} · สี: {r.colors || 0}
                    </div>
                  </div>
                  <div className="rec-badge">
                    <span className="bn">{totalSteps}</span>
                    <span className="bl">ขั้นตอน</span>
                  </div>
                </div>
                <div className="rec-body" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button className="btn-pdf" style={{ flex: 1 }} onClick={() => handleView(r)}>
                      👁 ดูข้อมูล
                    </button>
                    <button className="btn-pdf" style={{ flex: 1 }} onClick={() => handlePdfDownload(r)}>
                      📄 ดาวน์โหลด PDF
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-del" style={{ flex: 1 }} onClick={() => confirmDelete(r.id)}>
                      🗑 ลบ
                    </button>
                    <button 
                      className="btn-del" 
                      style={{ flex: 1, borderColor: '#a0bcd0', color: '#1a5276' }} 
                      onClick={() => onLoad(r.id)}
                    >
                      ✏️ แก้ไขข้อมูล
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <div className="ei">📋</div>
          <p>{records.length === 0 ? 'ยังไม่มีบันทึกใบดี<br />กรุณากรอกและบันทึกก่อน' : 'ไม่พบข้อมูลที่ตรงกับเงื่อนไขการกรอง'}</p>
        </div>
      )}

      <ViewModal
        record={viewRecord}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={onLoad}
      />
    </div>
  );
}
