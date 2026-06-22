import React from 'react';
import { generatePDF } from '../utils/pdfGenerator';
import { utils, writeFile } from 'xlsx';

export default function DownloadPage({ records, onDelete, onLoad, showToast }) {
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
          จัดการข้อมูลใบดีทั้งหมด ดาวน์โหลด PDF หรือส่งออก Excel
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

      {records.length > 0 ? (
        <div id="downloadList">
          {records.map((r, i) => {
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
                      {dateStr} · เมอร์: {merStr}<br />
                      จำนวน: {r.qty || 0} · สี: {r.colors || 0}
                    </div>
                  </div>
                  <div className="rec-badge">
                    <span className="bn">{totalSteps}</span>
                    <span className="bl">ขั้นตอน</span>
                  </div>
                </div>
                <div className="rec-body">
                  <button className="btn-pdf" onClick={() => handlePdfDownload(r)}>
                    📄 ดาวน์โหลด PDF
                  </button>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="btn-del" style={{ flex: 1 }} onClick={() => confirmDelete(r.id)}>
                      🗑 ลบ
                    </button>
                    <button 
                      className="btn-del" 
                      style={{ flex: 1, borderColor: '#a0bcd0', color: '#1a5276' }} 
                      onClick={() => onLoad(r.id)}
                    >
                      ✏️ โหลดข้อมูล
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
          <p>ยังไม่มีบันทึกใบดี<br />กรุณากรอกและบันทึกก่อน</p>
        </div>
      )}
    </div>
  );
}
