import React, { useEffect, useState } from 'react';
import './UserList.css';
import { FaUser } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";


const API_URL = 'https://paurehber.ilknurdogan.dev/api/admin/users/';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Kullanıcılar alınamadı');
        }

        setUsers(data.payload);
      } catch (err) {
        setError(err.message || 'Sunucu hatası');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="userlist-page">
      <div className="userlist-header">
        <h2>Kullanıcılar</h2>
        <button className="create-user-btn">Yeni Kullanıcı Oluştur</button>
      </div>

      {loading ? (
        <p className="loading-text">Yükleniyor...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="userlist-table-wrapper">
          <table className="userlist-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Profil Fotoğrafı</th>
                <th>Kullanıcı</th>
                <th>Email</th>
                <th>Engel Durumu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.profilePhotoUrl ? (
                      <img src={user.profilePhotoUrl} alt="Profil" className="user-avatar" />
                    ) : (
                      <div className="user-avatar-placeholder"><FaUser /></div>
                    )}
                  </td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                  <td>
                    {
                      user.disabilityStatus === 'OTHER' ? 'Diğer' :
                      user.disabilityStatus === 'VISUALLY_IMPAIRED' ? 'Görme Engelli' :
                      user.disabilityStatus === 'HEARING_IMPAIRED' ? 'İşitme Engelli' :
                      user.disabilityStatus === 'PHYSICALLY_IMPAIRED' ? 'Yürüme Engelli' :
                      user.disabilityStatus
                    }
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn"><FiEdit /></button>
                      <button className="delete-btn"><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
