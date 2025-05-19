import React from 'react';
import './Home.css';
import logo from '../../assets/logo.png';

export default function Home() {
  const quickLinks = [
    { title: 'Kullanıcı Yönetimi', icon: '👥', link: '/users', description: 'Kullanıcıları görüntüle, ekle, düzenle veya sil' },
    { title: 'Destek Talepleri', icon: '🎯', link: '/support', description: 'Gelen destek taleplerini yönet' },
    { title: 'Ayarlar', icon: '⚙️', link: '/settings', description: 'Sistem ayarlarını yapılandır' }
  ];

  return (
    <div className="home-wrapper">
    <div className="home-container">
      <div className="welcome-section">
        <img src={logo} alt="Pamukkale Üniversitesi Logo" className="home-logo" />
        <h1>Pamukkale Üniversitesi Pau Rehber Panel</h1>
        <p>Engelli öğrenciler için destek ve rehberlik yönetim sistemi</p>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2>Hoş Geldiniz</h2>
          <p>
            Pamukkale Üniversitesi Pau Rehber Panel'e hoş geldiniz. Bu panel üzerinden engelli öğrencilerimiz için 
            destek ve rehberlik hizmetlerini yönetebilirsiniz.
          </p>
        </div>
      </div>

      <div className="quick-links-section">
        <h2>Hızlı Erişim</h2>
        <div className="quick-links-grid">
          {quickLinks.map((link, index) => (
            <a key={index} href={link.link} className="quick-link-card">
              <div className="link-icon">{link.icon}</div>
              <div className="link-content">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
} 