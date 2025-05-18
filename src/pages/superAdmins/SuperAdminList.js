import React, { useEffect, useState } from 'react';
import './SuperAdminList.css';
import DataTable from '../../components/dataTable/DataTable';
import BaseModal from '../../components/baseModal/BaseModal';

// API endpoints
const LIST_API = 'https://paurehber.ilknurdogan.dev/api/admins/super-admins';
const CREATE_API = 'https://paurehber.ilknurdogan.dev/api/auth/register/admin';
const UPDATE_API_BASE = 'https://paurehber.ilknurdogan.dev/api/admins/';
const DELETE_API_BASE = 'https://paurehber.ilknurdogan.dev/api/admins/';
const FACULTIES_API = 'https://paurehber.ilknurdogan.dev/api/faculties/';

const ADMIN_ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' }
];

const roleLabels = {
  SUPER_ADMIN: 'Süper Admin'
};

export default function SuperAdminList() {
  // Data states
  const [admins, setAdmins] = useState([]);
  const [faculties, setFaculties] = useState([]);

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
    facultyId: 0,
    adminRole: ''
  });
  const [updateData, setUpdateData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: ''
  });

  // Initial load: super-admins + faculties
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        // fetch super-admins
        const ares = await fetch(LIST_API, { headers: { Authorization: `Bearer ${token}` } });
        const aj = await ares.json();
        if (!ares.ok || !aj.success) throw new Error(aj.message);
        setAdmins(aj.payload);
        // fetch faculties
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

  // Create handler
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const cres = await fetch(CREATE_API, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const cj = await cres.json();
      if (!cres.ok || !cj.success) throw new Error(cj.message);
      setIsCreateOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', password: '', facultyId: 0, adminRole: 'SUPPORT_ADMIN' });
      setLoading(true);
      // reload list
      const ares2 = await fetch(LIST_API, { headers: { Authorization: `Bearer ${token}` } });
      const aj2 = await ares2.json();
      setAdmins(aj2.payload);
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
      // build payload with only provided fields
      const payload = {};
      ['firstName','lastName','email','password','phoneNumber','role'].forEach(key => {
        const val = updateData[key];
        if (val != null && val !== '') payload[key] = val;
      });
      const ures = await fetch(`${UPDATE_API_BASE}${updateData.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const uj = await ures.json();
      if (!ures.ok || !uj.success) throw new Error(uj.message);
      setIsUpdateOpen(false);
      setLoading(true);
      const ares2 = await fetch(LIST_API, { headers: { Authorization: `Bearer ${token}` } });
      const aj2 = await ares2.json();
      setAdmins(aj2.payload);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Bu admin silinsin mi?')) return;
    try {
      const token = localStorage.getItem('token');
      const dres = await fetch(`${DELETE_API_BASE}${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!dres.ok) throw new Error('Silme hatası');
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  // Open modals
  const openUpdate = (admin) => {
    setUpdateData({
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      password: '',
      phoneNumber: admin.phoneNumber || '',
      role: admin.role
    });
    setIsUpdateOpen(true);
  };

  // Table data
  const data = admins.map(a => ({
    ...a,
    fullName: `${a.firstName} ${a.lastName}`,
    phoneNumber: a.phoneNumber || '-',
    roleLabel: roleLabels[a.role] || a.role
  }));

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'fullName', label: 'Ad Soyad' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Telefon' },
    { key: 'roleLabel', label: 'Rol' }
  ];

  return (
    <div className="superadmin-page">
      <div className="superadmin-header">
        <h2>Süper Adminler</h2>
        <button className="create-admin-btn" onClick={() => setIsCreateOpen(true)}>Yeni Admin</button>
      </div>
      {loading ? <p className="loading-text">Yükleniyor...</p>
       : error ? <p className="error-text">{error}</p>
       : <DataTable data={data} columns={columns} onEdit={openUpdate} onDelete={handleDelete} />}

      {isCreateOpen && (
        <BaseModal title="Yeni Admin Oluştur" isOpen onClose={() => setIsCreateOpen(false)}>
          <form onSubmit={handleCreate}>
            {/* First Name */}
            <div className="form-group">
              <input
                value={formData.firstName}
                placeholder='Ad'
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            {/* Last Name */}
            <div className="form-group">
              <input
                value={formData.lastName}
                placeholder='Soyad'
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                placeholder='Email'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            {/* Password */}
            <div className="form-group">
              <input
                type="password"
                placeholder='Şifre'
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            {/* Faculty */}
            <div className="form-group">
              <select
                value={formData.facultyId}
                onChange={e => setFormData({ ...formData, facultyId: Number(e.target.value) })}
                required
              >
                <option value={0}>Seçin</option>
                {faculties.map(f => <option key={f.id} value={f.id}>{f.facultyName}</option>)}
              </select>
            </div>
            {/* Role */}
            <div className="form-group">
              <select
                value={formData.adminRole}
                onChange={e => setFormData({ ...formData, adminRole: e.target.value })}
                required
              >
                <option value="">Seçin</option>
                {ADMIN_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="modal-buttons">
              <button type="submit" className="modal-confirm">Kaydet</button>
            </div>
          </form>
        </BaseModal>
      )}

      {isUpdateOpen && (
        <BaseModal title="Adminı Güncelle" isOpen onClose={() => setIsUpdateOpen(false)}>
          <form onSubmit={handleUpdate}>
            {/* First Name */}
            <div className="form-group">
              <input
                value={updateData.firstName}
                placeholder='Ad'
                onChange={e => setUpdateData({ ...updateData, firstName: e.target.value })}
                required
              />
            </div>
            {/* Last Name */}
            <div className="form-group">
              <input
                value={updateData.lastName}
                placeholder='Soyad'
                onChange={e => setUpdateData({ ...updateData, lastName: e.target.value })}
                required
              />
            </div>
            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                placeholder='Email'
                value={updateData.email}
                onChange={e => setUpdateData({ ...updateData, email: e.target.value })}
                required
              />
            </div>
            {/* Password */}
            <div className="form-group">
              <input
                type="password"
                placeholder='Şifre (Opsiyonel)'
                value={updateData.password}
                onChange={e => setUpdateData({ ...updateData, password: e.target.value })}
              />
            </div>
            {/* Phone */}
            <div className="form-group">
              <input
                placeholder='Telefon'
                value={updateData.phoneNumber}
                onChange={e => setUpdateData({ ...updateData, phoneNumber: e.target.value })}
              />
            </div>
            {/* Role */}
            <div className="form-group">
              <select
                value={updateData.role}
                placeholder='Rol'
                onChange={e => setUpdateData({ ...updateData, role: e.target.value })}
                required
              >
                <option value="">Seçin</option>
                {ADMIN_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
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