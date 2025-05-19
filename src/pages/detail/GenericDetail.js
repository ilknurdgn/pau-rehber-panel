import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./GenericDetail.css";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import DataTable from "../../components/dataTable/DataTable.js";

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
  const [openDepartments, setOpenDepartments] = useState(false);

  const entityType = location.pathname.split("/")[1];

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

        if (entityType === 'faculties') {
          const depRes = await fetch(
            `https://paurehber.ilknurdogan.dev/api/departments/?facultyId=${id}`
          );
          const depJson = await depRes.json();
          if (depRes.ok && depJson.success) setRelated(depJson.payload);
        }
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
    { key: 'departmentName', label: 'Bölüm Adı' }
  ];

  return (
    <div className="detail-page">
    <div className="detail-header">
    <button className="back-button" onClick={() => navigate(-1)}>
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

      {entityType === 'faculties' && (
          <div className="related-section">
            <div className="departments-header" onClick={() => setOpenDepartments(prev => !prev)}>
              <button>{openDepartments ? <FiChevronUp /> : <FiChevronDown />}</button>
              <h3>Bu Fakülteye Ait Bölümler</h3>
            </div>
            {openDepartments && (
              <DataTable data={related} columns={departmentColumns} />
            )}
          </div>
        )}
    </div>
  );
}
