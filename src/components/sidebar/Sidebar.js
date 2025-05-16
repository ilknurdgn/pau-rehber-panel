import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './Sidebar.css';
import { FiMapPin } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";

const Sidebar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(true);
  const [openNavMenu, setOpenNavMenu] = useState(true);

  return (
    <aside className="sidebar">
      {/* Kullanıcı İşlemleri */}
      <div className="sidebar-section">
        <div className="sidebar-title" onClick={() => setOpenUserMenu(prev => !prev)}>
          <div className="sidebar-title-left">
            <span className="sidebar-icon"><FaRegUser /></span>
            <span>Kullanıcı İşlemleri</span>
          </div>
          <span className="sidebar-chevron">
            {openUserMenu ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
        {openUserMenu && (
          <>
            <NavLink to="/users" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <div className="sidebar-link-content">
                <span className="sidebar-icon-placeholder" />
                <span>Kullanıcılar</span>
              </div>
            </NavLink>
            <NavLink to="/super-admins" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <div className="sidebar-link-content">
                <span className="sidebar-icon-placeholder" />
                <span>Super Adminler</span>
              </div>
            </NavLink>
            <NavLink to="/support-admins" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <div className="sidebar-link-content">
                <span className="sidebar-icon-placeholder" />
                <span>Destek Adminler</span>
              </div>
            </NavLink>
          </>
        )}
      </div>

      {/* Navigasyon İşlemleri */}
      <div className="sidebar-section">
        <div className="sidebar-title" onClick={() => setOpenNavMenu(prev => !prev)}>
          <div className="sidebar-title-left">
            <span className="sidebar-icon"><FiMapPin /></span>
            <span>Navigasyon İşlemleri</span>
          </div>
          <span className="sidebar-chevron">
            {openNavMenu ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
        {openNavMenu && (
          <>
            <NavLink to="/faculties" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <div className="sidebar-link-content">
                <span className="sidebar-icon-placeholder" />
                <span>Fakülteler</span>
              </div>
            </NavLink>
            <NavLink to="/access-point" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <div className="sidebar-link-content">
                <span className="sidebar-icon-placeholder" />
                <span>Access Point</span>
              </div>
            </NavLink>
            <NavLink to="/fingerprinting" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <div className="sidebar-link-content">
                <span className="sidebar-icon-placeholder" />
                <span>FingerPrinting</span>
              </div>
            </NavLink>
            <NavLink to="/node" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <div className="sidebar-link-content">
                <span className="sidebar-icon-placeholder" />
                <span>Node</span>
              </div>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
