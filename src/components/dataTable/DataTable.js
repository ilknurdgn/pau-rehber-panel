import React from 'react';
import { FaUser } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import './DataTable.css';

export default function DataTable({ data, columns, onDetail, onEdit, onDelete, onImageClick }) {
  return (
    <div className="datatable-wrapper">
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.label}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {columns.map((col, i) => (
                <td key={i}>
                  {col.type === 'image' && item[col.key] !== undefined ? (
                    <div onClick={() => onImageClick?.(item)} style={{ cursor: 'pointer' }}>
                      {item[col.key] ? (
                        <img src={item[col.key]} alt="img" className="datatable-avatar" />
                      ) : (
                        <div className="datatable-avatar-placeholder"><FaUser /></div>
                      )}
                    </div>
                  ) : (
                    item[col.key]
                  )}
                </td>
              ))}
              <td>
                <div className="datatable-actions">
                {onDetail && (
                    <button className="detail-btn" onClick={() => onDetail(item.id)}><MdOutlineRemoveRedEye /></button>
                  )}
                  {onEdit && (
                    <button className="edit-btn" onClick={() => onEdit(item)}><FiEdit /></button>
                  )}
                  {onDelete && (
                    <button className="delete-btn" onClick={() => onDelete(item.id)}><RiDeleteBinLine /></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}