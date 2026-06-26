import React from 'react';

export default function ViewModal({ record, isOpen, onClose, onEdit }) {
  if (!isOpen || !record) return null;

  const steps = record.steps || [];
  const totalSec = steps.reduce((s, r) => s + (parseInt(r.time) || 0), 0);
  const totalMin = Math.floor(totalSec / 60);
  const totalSecRem = totalSec % 60;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="modal-content" style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '24px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ✕
        </button>

        <h2 style={{ marginBottom: '20px', color: 'var(--primary)' }}>รายละเอียดใบดี</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div><strong>วันที่:</strong> {record.dispDate || record.date || '-'}</div>
          <div><strong>Mer:</strong> {record.merText || '-'}</div>
          <div><strong>แบรนด์:</strong> {record.brand || '-'}</div>
          <div><strong>ลูกค้า:</strong> {record.customer || '-'}</div>
          <div><strong>ชื่อรุ่น:</strong> {record.model || '-'}</div>
          <div><strong>ชนิดเสื้อผ้า:</strong> {record.clothingType || '-'}</div>
          <div><strong>จำนวนผลิต:</strong> {record.qty || 0} ตัว</div>
          <div><strong>ไซส์:</strong> {record.size || '-'}</div>
          <div><strong>จำนวนสี:</strong> {record.colors || 0} สี</div>
          <div><strong>จำนวน/สี:</strong> {record.perColor || 0} ตัว/สี</div>
          <div><strong>มีตัวอย่างจริง:</strong> {record.sampleReal ? 'ใช่' : 'ไม่ใช่'}</div>
          <div><strong>ตีราคาจากรูป:</strong> {record.samplePic ? 'ใช่' : 'ไม่ใช่'}</div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>รายละเอียดงาน:</strong>
          <p style={{ marginTop: '4px', padding: '8px', background: '#f5f5f5', borderRadius: '6px' }}>
            {record.detail || '-'}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>เพิ่มเติม:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '8px' }}>
            <div>ปัก: {record.chk?.pak ? `ใช่ (${record.chk.pak_n || '-'})` : 'ไม่มี'}</div>
            <div>พิมพ์: {record.chk?.print ? `ใช่ (${record.chk.print_n || '-'})` : 'ไม่มี'}</div>
            <div>ตัวรีดป้ายไซส์: {record.chk?.tag ? 'มี' : 'ไม่มี'}</div>
            <div>ตัวรีดใหญ่: {record.chk?.big ? `มี (${record.chk.big_n || '-'})` : 'ไม่มี'}</div>
            <div>รีดวีราเน่รองปัก: {record.chk?.rib ? 'มี' : 'ไม่มี'}</div>
            <div>ส่งซัก: {record.chk?.send ? `มี (${record.chk.send_n || '-'})` : 'ไม่มี'}</div>
            <div>ตัวรีดเล็ก: {record.chk?.small ? `มี (${record.chk.small_n || '-'})` : 'ไม่มี'}</div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>ผู้ดูแล (เมอร์):</strong> {record.supervisor || '-'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div><strong>จำนวนคนเย็บ:</strong> {record.sewers || 0} คน</div>
          <div><strong>ตัว/ชม:</strong> {record.rate || 0} ตัว</div>
          <div><strong>ประเมินค่าแรง:</strong> {record.estWage || 0} บาท</div>
          <div><strong>ราคา Confirmed:</strong> {record.confirmed || '-'}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div>
            <strong>Note ฝ่ายผลิต:</strong>
            <p style={{ marginTop: '4px', padding: '8px', background: '#f5f5f5', borderRadius: '6px', fontSize: '13px' }}>
              {record.noteProd || '-'}
            </p>
          </div>
          <div>
            <strong>Note ฝ่ายขาย:</strong>
            <p style={{ marginTop: '4px', padding: '8px', background: '#f5f5f5', borderRadius: '6px', fontSize: '13px' }}>
              {record.noteSales || '-'}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>ขั้นตอนการเย็บ ({steps.length} ขั้นตอน, เวลารวม: {totalMin} นาที {totalSecRem} วินาที):</strong>
          {steps.length > 0 ? (
            <table style={{ width: '100%', marginTop: '8px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f0f7ff' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>ลำดับ</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>ชิ้นส่วน</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>ขั้นตอน</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>เครื่องจักร</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>เวลา (วิ)</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>คน</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{step.part || '-'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{step.step || '-'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{step.machine || '-'}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{step.time || 0}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{step.workers || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ marginTop: '8px', color: '#999' }}>ไม่มีขั้นตอนการเย็บ</p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>ข้อควรระวัง:</strong>
          <p style={{ marginTop: '4px', padding: '8px', background: '#fff3cd', borderRadius: '6px' }}>
            {record.warning || '-'}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>วิธีแก้ไข:</strong>
          <p style={{ marginTop: '4px', padding: '8px', background: '#d4edda', borderRadius: '6px' }}>
            {record.solution || '-'}
          </p>
        </div>

        <div style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
          <strong style={{ display: 'block', marginBottom: '12px' }}>ผลิตจริง:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <div><strong>เริ่มเย็บจริง:</strong> {record.actual?.start || '-'}</div>
            <div><strong>จบเย็บจริง:</strong> {record.actual?.end || '-'}</div>
            <div><strong>คนเย็บจริง:</strong> {record.actual?.sewers || 0} คน</div>
            <div><strong>วันเย็บจริง:</strong> {record.actual?.days || 0} วัน</div>
            <div><strong>ตัว/ชม (จริง):</strong> {record.actual?.rate || 0}</div>
            <div><strong>ค่าแรงจริง:</strong> {record.actual?.wage || 0} บาท</div>
            <div><strong>ทุนรวมจริง:</strong> {record.actual?.total || 0} บาท</div>
          </div>
          <div style={{ marginTop: '8px' }}>
            <strong>หมายเหตุจริง:</strong>
            <p style={{ marginTop: '4px', padding: '8px', background: 'white', borderRadius: '6px', fontSize: '13px' }}>
              {record.actual?.remark || '-'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ปิด
          </button>
          <button
            onClick={() => {
              onEdit(record.id);
              onClose();
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✏️ แก้ไขข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
