import React, { use, useEffect, useState } from 'react';
import './UserList.css';
import { FaUser } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

const API_URL = 'https://paurehber.ilknurdogan.dev/api/admin/users/';

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

// Kullanıcıları fetch eden fonksiyonu component dışına taşıyorum
async function fetchUsers(setUsers, setError, setLoading) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Kullanıcılar alınamadı');
    setUsers(data.payload);
  } catch (err) {
    setError(err.message || 'Sunucu hatası');
  } finally {
    setLoading(false);
  }
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    disabilityStatus: 'OTHER',
    facultyId: 0,
    departmentId: 0
  });

  useEffect(() => {
    fetchUsers(setUsers, setError, setLoading);
  }, []);

  useEffect(() => {
    const fetchAllDepartments = async () => {
      let allDepartments = [];
      // Önce fakülteleri çek
      const facultiesRes = await fetch('https://paurehber.ilknurdogan.dev/api/faculties/');
      const facultiesData = await facultiesRes.json();
      if (facultiesData.success) {
        setFaculties(facultiesData.payload);
        // Her fakülte için bölümleri çek
        for (const faculty of facultiesData.payload) {
          const depRes = await fetch(`https://paurehber.ilknurdogan.dev/api/departments/?facultyId=${faculty.id}`);
          if (depRes.ok) {
            const depData = await depRes.json();
            if (depData.success) {
              allDepartments = allDepartments.concat(depData.payload);
            }
          }
        }
        setDepartments(allDepartments);
      }
    };
    fetchAllDepartments();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Bu kullanıcıyı silmek istiyor musunuz?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Silme işlemi başarısız');
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      alert(err.message || 'Sunucu hatası');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const token = localStorage.getItem('token');
      const requestData = {
        ...formData,
        facultyId: Number(formData.facultyId),
        departmentId: Number(formData.departmentId)
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Kullanıcı eklenemedi');
      setIsModalOpen(false);
      setFormData({
        firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
        disabilityStatus: 'OTHER', facultyId: 0, departmentId: 0
      });
      // Yeni kullanıcıyı eklemek yerine kullanıcı listesini tekrar fetch et
      fetchUsers(setUsers, setError, setLoading);
    } catch (err) {
      alert(err.message || 'Sunucu hatası');
    }
  };

  const handleFacultyChange = async (e) => {
    const facultyId = Number(e.target.value);
    setFormData(prev => ({ ...prev, facultyId, departmentId: 0 }));
    // Sadece seçili fakültenin bölümlerini filtrele
    setFilteredDepartments(departments.filter(d => d.facultyId === facultyId));
  };

  return (
    <div className="userlist-page">
      <div className="userlist-header">
        <h2>Kullanıcılar</h2>
        <button className="create-user-btn" onClick={() => setIsModalOpen(true)}>
          Yeni Kullanıcı Oluştur
        </button>
      </div>

      {loading ? <p className="loading-text">Yükleniyor...</p> : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="userlist-table-wrapper">
          <table className="userlist-table">
            <thead>
              <tr>
                <th>ID</th><th>Profil Fotoğrafı</th><th>Kullanıcı</th><th>Email</th><th>Engel Durumu</th><th>Bölüm</th><th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.profilePhotoUrl ? <img src={user.profilePhotoUrl} alt="Profil" className="user-avatar" /> : <div className="user-avatar-placeholder"><FaUser /></div>}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td>{disabilityLabels[user.disabilityStatus] || "-"}</td>
                    <td>{user.departmentName}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn"><FiEdit /></button>
                        <button className="delete-btn" onClick={() => handleDelete(user.id)}><RiDeleteBinLine /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <h3>Yeni Kullanıcı Oluştur</h3>
            <form onSubmit={handleFormSubmit}>
              <input type="text" placeholder="Ad" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              <input type="text" placeholder="Soyad" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <input type="password" placeholder="Şifre" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <select value={formData.disabilityStatus} onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.value })}>
                <option value="VISUALLY_IMPAIRED">Görme Engelli</option>
                <option value="HEARING_IMPAIRED">İşitme Engelli</option>
                <option value="ORTHOPEDICALLY_IMPAIRED">Ortopedik Engelli</option>
                <option value="SPEECH_IMPAIRED">Konuşma Engelli</option>
                <option value="AUTISM_SPECTRUM_DISORDER">Otizm Spektrum Bozukluğu</option>
                <option value="DOWN_SYNDROME">Down Sendromu</option>
                <option value="PSYCHOLOGICAL_DISORDER">Psikolojik Engelli</option>
                <option value="INTELLECTUALLY_DISABLED">Zihinsel Engelli</option>
                <option value="CHRONIC_DISEASE">Kronik Hastalığı Olan</option>
                <option value="OTHER">Diğer</option>
              </select>
              <select value={formData.facultyId} onChange={handleFacultyChange} required>
                <option value={0}>Fakülte Seçin</option>
                {faculties.map(f => <option key={f.id} value={f.id}>{f.facultyName}</option>)}
              </select>
              <select value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })} required disabled={!filteredDepartments.length}>
                <option value={0}>Bölüm Seçin</option>
                {filteredDepartments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
              </select>
              <div className="modal-buttons">
                <button type="submit" className="modal-confirm">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}