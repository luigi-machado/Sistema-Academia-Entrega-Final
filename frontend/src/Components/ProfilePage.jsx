import React, { useState } from 'react';
import "../Assets/ProfilePage.css";

const ProfilePage = ({ ProfileData }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(ProfileData)[0]);

  const renderContent = (data) => {
    if (Array.isArray(data)) {
      return (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {typeof item === 'object' ? (
                <ul>
                  {Object.entries(item).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              ) : item}
            </li>
          ))}
        </ul>
      );
    } else if (typeof data === 'object') {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      );
    } else {
      return <p>{data}</p>;
    }
  };

  return (
    <div className="profile-page">
      {/* Barra de Navegação (Tabs) */}
      <div className="tabs">
        {Object.keys(ProfileData).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="content">
        {renderContent(ProfileData[activeTab])}
      </div>
    </div>
  );
};

export default ProfilePage;
