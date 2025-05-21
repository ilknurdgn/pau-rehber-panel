import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./GenericDetail.css";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import DataTable from "../../components/dataTable/DataTable.js";
import BaseModal from "../../components/baseModal/BaseModal.js";

const ENTITY_ENDPOINT_MAP = {
  users: "admin/users",
  admins: "admins",
  faculties: "faculties",
  departments: "departments",
};

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
  OTHER: "Diğer",
};

const ENTITY_TITLE_MAP = {
    users: "Kullanıcı Bilgisi",
    admins: "Admin Bilgisi",
    faculties: "Fakülte Bilgisi",
    departments: "Bölüm Bilgisi"
  };



  const ENTITY_FIELD_MAP = {
    users: [
      { key: "id", label: "Id" },
      { key: "email", label: "Email" },
      { key: "firstName", label: "İsim" },
      { key: "lastName", label: "Soyisim" },
      { key: "phoneNumber", label: "Telefon Numarası" },
      { key: "disabilityStatus", label: "Engel Durumu" },
      { key: "departmentName", label: "Bölüm" }
    ],
    faculties: [
      { key: "id", label: "Id" },
      { key: "facultyName", label: "Fakülte Adı" },
      { key: "floorCount", label: "Kat Sayısı" },
    ],
    admins: [
      { key: "id", label: "Id" },
      { key: "firstName", label: "Ad" },
      { key: "lastName", label: "Soyad" },
      { key: "email", label: "Email" },
      { key: "role", label: "Rol" }
    ],
    departments: [
      { key: "id", label: "Id" },
      { key: "departmentName", label: "Bölüm Adı" },
      { key: "facultyName", label: "Bağlı Fakülte" }
    ]
  };
  

export default function GenericDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
const [newDepartmentName, setNewDepartmentName] = useState("");
  const [openDepartments, setOpenDepartments] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
const [updateData, setUpdateData] = useState({
  id: null,
  departmentName: '',
});


const openUpdateModal = (department) => {
  setUpdateData({
    id: department.id,
    departmentName: department.departmentName,
  });
  setIsUpdateOpen(true);
};

  const entityType = location.pathname.split("/")[1];


  const fetchDepartments = async () => {
    try {
      const depRes = await fetch(`https://paurehber.ilknurdogan.dev/api/departments/?facultyId=${id}`);
      const depJson = await depRes.json();
      if (depRes.ok && depJson.success) {
        setRelated(depJson.payload);
      }
    } catch (err) {
      console.error("Departman listesi alınamadı:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const endpointPath = ENTITY_ENDPOINT_MAP[entityType];
        if (!endpointPath) throw new Error(`Desteklenmeyen entity tipi: ${entityType}`);

        const res = await fetch(`https://paurehber.ilknurdogan.dev/api/${endpointPath}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);

        setItem(json.payload);

        const depRes = await fetch(
          `https://paurehber.ilknurdogan.dev/api/departments/?facultyId=${id}`
        );
        const depJson = await depRes.json();
        if (depRes.ok && depJson.success) setRelated(depJson.payload);
      } catch (err) {
        console.error("Detay getirilemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, entityType]);

  

  if (loading) return <p>Yükleniyor...</p>;
  if (!item) return <p>Detay bilgisi bulunamadı.</p>;

  const imageUrl =
    entityType === "users"
      ? item.profilePhotoUrl
      : entityType === "faculties"
      ? item.facultyLogoUrl
      : null;


      const departmentColumns = [
        { key: 'id', label: 'ID' },
        { key: 'departmentName', label: 'Bölüm Adı' },
        {
          key: 'actions',
          label: '',
        }
      ];


      const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("https://paurehber.ilknurdogan.dev/api/departments/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              departmentName: newDepartmentName,
              facultyId: Number(id),
            }),
          });
      
          const data = await res.json();
      
          if (res.ok && data.success) {
            setIsCreateOpen(false);
            setNewDepartmentName("");
            await fetchDepartments(); 
          } else {
            alert("Ekleme başarısız: " + (data.message || "Sunucudan veri gelmedi."));
          }
        } catch (err) {
          console.error("Oluşturma hatası:", err);
          alert("Beklenmeyen bir hata oluştu.");
        }
      };
      
      
      
  
  const handleEditDepartment = async (deptId, newName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://paurehber.ilknurdogan.dev/api/departments/${deptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ departmentName: newName }),
      });
  
      const data = await res.json();
      if (res.ok && data.success) {
        setRelated(prev =>
          prev.map(dep => (dep.id === deptId ? { ...dep, departmentName: newName } : dep))
        );
      } else {
        alert("Düzenleme başarısız: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDeleteDepartment = async (deptId) => {
    if (!window.confirm("Bu bölümü silmek istediğinizden emin misiniz?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://paurehber.ilknurdogan.dev/api/departments/${deptId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.ok) {
        setRelated(prev => prev.filter(dep => dep.id !== deptId));
      } else {
        const data = await res.json();
        alert("Silme başarısız: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  return (
    <div className="detail-page">
    <div className="detail-header"onClick={() => navigate(-1)}>
    <button className="back-button" >
    <FiChevronLeft />
      </button>
      <h2 className="detail-title">{ENTITY_TITLE_MAP[entityType] || "Detay Bilgisi"}</h2>
    </div>

      <div className="detail-container">
        {imageUrl && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={imageUrl}
              alt="Profil"
              className="detail-profile-img"
            />
          </div>
        )}

<table className="detail-table">
  <tbody>
    {(ENTITY_FIELD_MAP[entityType] || []).map(({ key, label }) => (
      <tr key={key}>
        <td>{label}</td>
        <td>
          {key === "disabilityStatus"
            ? disabilityLabels[item[key]] || item[key] || "-"
            : item[key] || "-"}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>

      {related.length > 0 && (
  <div className="related-section">
    <div className="departments-header" onClick={() => setOpenDepartments(prev => !prev)}>
        <button className="departments-toggle-btn">
          {openDepartments ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <h3>Fakülteye Ait Bölümler</h3>
    </div>

    {openDepartments && (
  <div className="departments-body">
    <div className="departments-toolbar">
      <button className="detail-create-department-btn" onClick={() => setIsCreateOpen(true)}>
        Yeni Bölüm
      </button>
    </div>
    <DataTable
      data={related}
      columns={departmentColumns}
      onEdit={openUpdateModal}
      onDelete={handleDeleteDepartment}
    />
  </div>
)}
  </div>
)}

{isCreateOpen && (
  <BaseModal title="Yeni Bölüm Ekle" isOpen onClose={() => setIsCreateOpen(false)}>
    <form onSubmit={handleCreateDepartment}>
      <div className="form-group">
        <label>Bölüm Adı</label>
        <input
          type="text"
          value={newDepartmentName}
          onChange={(e) => setNewDepartmentName(e.target.value)}
          required
        />
      </div>
      <div className="modal-buttons">
        <button className="modal-confirm" type="submit">Ekle</button>
      </div>
    </form>
  </BaseModal>
)}



{isUpdateOpen && (
  <BaseModal title="Bölüm Güncelle" isOpen onClose={() => setIsUpdateOpen(false)}>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleEditDepartment(updateData.id, updateData.departmentName);
        setIsUpdateOpen(false);
      }}
    >
      <div className="form-group">
        <label>Yeni Bölüm Adı</label>
        <input
          type="text"
          value={updateData.departmentName}
          onChange={(e) =>
            setUpdateData({ ...updateData, departmentName: e.target.value })
          }
          required
        />
      </div>
      <div className="modal-buttons">
        <button className="modal-confirm" type="submit">Güncelle</button>
      </div>
    </form>
  </BaseModal>
)}
    </div>
  );
}
