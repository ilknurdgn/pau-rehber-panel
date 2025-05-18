import React, { useEffect, useState } from 'react';
import './UserList.css';
import DataTable from '../../components/dataTable/DataTable';
import BaseModal from '../../components/baseModal/BaseModal';

const API_URL = 'https://paurehber.ilknurdogan.dev/api/admin/users/';
const FACULTIES_API = 'https://paurehber.ilknurdogan.dev/api/faculties/';
const DEPARTMENTS_API = 'https://paurehber.ilknurdogan.dev/api/departments/';

const disabilityLabels = {
  VISUALLY_IMPAIRED: "Görme Engelli",
  HEARING_IMPAIRED: "İşitme Engelli",
  ORTHOPEDICALLY_IMPAIRED: "Ortopedik Engelli",
  SPEECH_IMPAIRED: "Konuşma Engelli",
  AUTISM_SPECTRUM_DISORDER: "Otizm Spektrum Bozukluğu",
  DOWN_SYNDROME: "Down Sendromu",
  PSYCHOLOGICAL_DISORDER: "Psikolojik Engelli",
  INTELLECTUALLY_DISABLED: "Zihinsel Engelli",
  CHRONIC_DISEASE: "Kronik Hastalığı Olan",
  OTHER: "Diğer"
};

export default function UserList() {
  // Data states
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    disabilityStatus: 'OTHER',
    facultyId: 0,
    departmentId: 0
  });

  const [updateData, setUpdateData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    disabilityStatus: ''
  });

  // Initial load: users + faculties
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        const ures = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        const uj = await ures.json();
        if (!ures.ok || !uj.success) throw new Error(uj.message);
        setUsers(uj.payload);

        const fres = await fetch(FACULTIES_API);
        const fj = await fres.json();
        if (fj.success) setFaculties(fj.payload);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Load departments on create form's faculty change
  const handleFacultyChange = async (e) => {
    const fid = Number(e.target.value);
    setFormData(prev => ({ ...prev, facultyId: fid, departmentId: 0 }));
    if (!fid) return setDepartmentOptions([]);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${DEPARTMENTS_API}?facultyId=${fid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dj = await res.json();
      setDepartmentOptions(res.ok && dj.success ? dj.payload : []);
    } catch {
      setDepartmentOptions([]);
    }
  };

  // Create handler
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const cres = await fetch(API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const cj = await cres.json();
      if (!cres.ok || !cj.success) throw new Error(cj.message);
      setIsCreateOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', password: '', facultyId: 0, departmentId: 0, disabilityStatus: 'OTHER' });
      setLoading(true);
      const ures2 = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      const uj2 = await ures2.json();
      setUsers(uj2.payload);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Update handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber || undefined,
        password: updateData.password || undefined,
        disabilityStatus: updateData.disabilityStatus
      };
      const res = await fetch(`${API_URL}${updateData.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const dj = await res.json();
      if (!res.ok || !dj.success) throw new Error(dj.message);
      setIsUpdateOpen(false);
      setLoading(true);
      const ures = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      const uj = await ures.json();
      setUsers(uj.payload);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Silinsin mi?')) return;
    try {
      const token = localStorage.getItem('token');
      const dres = await fetch(`${API_URL}${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!dres.ok) throw new Error('Silme hatası');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  // Open update modal
  const openUpdate = (user) => {
    setUpdateData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      password: '',
      disabilityStatus: user.disabilityStatus
    });
    setIsUpdateOpen(true);
  };

  // Table data
  const data = users.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`,
    phoneNumber: u.phoneNumber || '-',
    disabilityLabel: disabilityLabels[u.disabilityStatus] || '-'
  }));
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'profilePhotoUrl', label: 'Foto', type: 'image' },
    { key: 'fullName', label: 'Kullanıcı' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Telefon' },
    { key: 'disabilityLabel', label: 'Engel Durumu' },
    { key: 'departmentName', label: 'Bölüm' }
  ];

  return (
    <div className="userlist-page">
      <div className="userlist-header">
        <h2>Kullanıcılar</h2>
        <button className="create-user-btn" onClick={() => setIsCreateOpen(true)}>Yeni Kullanıcı</button>
      </div>
      {loading
        ? <p>Yükleniyor...</p>
        : error
          ? <p>{error}</p>
          : <DataTable data={data} columns={columns} onEdit={openUpdate} onDelete={handleDelete} />
      }

      {/* Create Modal */}
      {isCreateOpen && (
        <BaseModal title="Yeni Kullanıcı" isOpen onClose={() => setIsCreateOpen(false)}>
          <form onSubmit={handleCreate}>
            {/* First Name */}
            <div className="form-group">
              <input value={formData.firstName}
                     placeholder='Ad'
                     onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                     required />
            </div>
            {/* Last Name */}
            <div className="form-group">
              <input value={formData.lastName}
                     placeholder='Soyad'
                     onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                     required />
            </div>
            {/* Email */}
            <div className="form-group">
              <input type="email"
                     placeholder='Email'
                     value={formData.email}
                     onChange={e => setFormData({ ...formData, email: e.target.value })}
                     required />
            </div>
            {/* Password */}
            <div className="form-group">
              <input type="password"
                     placeholder='Şifre'
                     value={formData.password}
                     onChange={e => setFormData({ ...formData, password: e.target.value })}
                     required />
            </div>
            {/* Disability */}
            <div className="form-group">
              <select value={formData.disabilityStatus}
                      onChange={e => setFormData({ ...formData, disabilityStatus: e.target.value })}
                      required>
                {Object.entries(disabilityLabels).map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
              </select>
            </div>
            {/* Faculty */}
            <div className="form-group">
              <select value={formData.facultyId}
                      onChange={handleFacultyChange}
                      required>
                <option value={0}>Seçin</option>
                {faculties.map(f => <option key={f.id} value={f.id}>{f.facultyName}</option>)}
              </select>
            </div>
            {/* Department */}
            <div className="form-group">
              <select value={formData.departmentId}
                      onChange={e => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                      required disabled={!formData.facultyId}>
                <option value={0}>Seçin</option>
                {departmentOptions.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
              </select>
            </div>
            <div className="modal-buttons">
              <button type="submit" className="modal-confirm">Kaydet</button>
            </div>
          </form>
        </BaseModal>
      )}

      {/* Update Modal */}
      {isUpdateOpen && (
        <BaseModal title="Kullanıcıyı Güncelle" isOpen onClose={() => setIsUpdateOpen(false)}>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <input
                value={updateData.firstName}
                placeholder='Ad'
                onChange={e => setUpdateData({ ...updateData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                value={updateData.lastName}
                placeholder='Soyad'
                onChange={e => setUpdateData({ ...updateData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder='Email'
                value={updateData.email}
                onChange={e => setUpdateData({ ...updateData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                value={updateData.phoneNumber}
                placeholder='Telefon'
                onChange={e => setUpdateData({ ...updateData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder='Yeni Şifre'
                value={updateData.password}
                onChange={e => setUpdateData({ ...updateData, password: e.target.value })}
              />
            </div>
            <div className="form-group">
              <select
                value={updateData.disabilityStatus}
                onChange={e => setUpdateData({ ...updateData, disabilityStatus: e.target.value })}
                required
              >
                {Object.entries(disabilityLabels).map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button type="submit" className="modal-confirm">Güncelle</button>
            </div>
          </form>
        </BaseModal>
      )}
    </div>
  );
}