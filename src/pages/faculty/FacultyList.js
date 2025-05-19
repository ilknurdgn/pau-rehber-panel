import React, { useEffect, useState } from 'react';
import './FacultyList.css';
import DataTable from '../../components/dataTable/DataTable';
import BaseModal from '../../components/baseModal/BaseModal';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://paurehber.ilknurdogan.dev/api/faculties/';

export default function FacultyList() {
  const navigate = useNavigate();

  // Data states
  const [faculties, setFaculties] = useState([]);
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    facultyName: '',
    floorCount: 1,
    logoFile: null
  });
  const [updateData, setUpdateData] = useState({
    id: null,
    facultyName: '',
    floorCount: 1,
    logoFile: null
  });

  // Fetch all faculties
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Liste alınamadı');
      setFaculties(Array.isArray(json.payload) ? json.payload : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // Detail view
  const handleDetail = (id) => navigate(`/faculties/${id}`);

  // Create faculty
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append(
        'request',
        new Blob([
          JSON.stringify({
            facultyName: formData.facultyName,
            floorCount: formData.floorCount
          })
        ], { type: 'application/json' })
      );
      if (formData.logoFile) fd.append('file', formData.logoFile);

      const res = await fetch(`${API_URL}create`, {
        method: 'POST',
        body: fd
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setIsCreateOpen(false);
      setFormData({ facultyName: '', floorCount: 1, logoFile: null });
      await fetchFaculties();
    } catch (e) {
      alert(e.message);
    }
  };

  // Open update modal
  const openUpdate = (fac) => {
    setUpdateData({
      id: fac.id,
      facultyName: fac.facultyName,
      floorCount: fac.floorCount,
      logoFile: null
    });
    setIsUpdateOpen(true);
  };

  // Update faculty
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append(
        'request',
        new Blob([
          JSON.stringify({
            facultyName: updateData.facultyName,
            floorCount: updateData.floorCount
          })
        ], { type: 'application/json' })
      );
      if (updateData.logoFile) fd.append('file', updateData.logoFile);

      const res = await fetch(`${API_URL}${updateData.id}`, {
        method: 'PATCH',
        body: fd
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setIsUpdateOpen(false);
      await fetchFaculties();
    } catch (e) {
      alert(e.message);
    }
  };

  // Delete faculty
  const handleDelete = async (id) => {
    if (!window.confirm('Silinsin mi?')) return;
    try {
      const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Silme hatası');
      setFaculties(prev => prev.filter(f => f.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  // Table data
  const data = faculties.map(f => ({ ...f }));
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'facultyLogoUrl', label: 'Logo', type: 'image' },
    { key: 'facultyName', label: 'Fakülte Adı' }
  ];

  return (
    <div className="facultylist-page">
      <div className="facultylist-header">
        <h2>Fakülteler</h2>
        <button className='create-facultylist-btn' onClick={() => setIsCreateOpen(true)}>Yeni Fakülte</button>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          onDetail={handleDetail}
          onEdit={openUpdate}
          onDelete={handleDelete}
        />
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <BaseModal title="Yeni Fakülte" isOpen onClose={() => setIsCreateOpen(false)}>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Fakülte Adı</label>
              <input
                value={formData.facultyName}
                onChange={e => setFormData({ ...formData, facultyName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Kat Sayısı</label>
              <input
                type="number"
                min="1"
                value={formData.floorCount}
                onChange={e => setFormData({ ...formData, floorCount: +e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFormData({ ...formData, logoFile: e.target.files[0] })}
              />
            </div>
            <div className="modal-buttons">
              <button className='modal-confirm' type="submit">Kaydet</button>
            </div>
          </form>
        </BaseModal>
      )}

      {/* Update Modal */}
      {isUpdateOpen && (
        <BaseModal title="Fakülte Güncelle" isOpen onClose={() => setIsUpdateOpen(false)}>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Fakülte Adı</label>
              <input
                value={updateData.facultyName}
                onChange={e => setUpdateData({ ...updateData, facultyName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Kat Sayısı</label>
              <input
                type="number"
                min="1"
                value={updateData.floorCount}
                onChange={e => setUpdateData({ ...updateData, floorCount: +e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setUpdateData({ ...updateData, logoFile: e.target.files[0] })}
              />
            </div>
            <div className="modal-buttons">
              <button className='modal-confirm' type="submit">Güncelle</button>
            </div>
          </form>
        </BaseModal>
      )}
    </div>
  );
}
