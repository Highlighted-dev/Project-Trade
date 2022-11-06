import React from 'react';
import '../../css/Settings/AdminSettings.css';

const AdminSettings = () => {
  return (
    <div id="AdminSettings">
      <div id="ReloadData">
        <div className="description">
          <h2>Reload Data</h2>
          <span>
            Here you can reload data from external API. <br />
            This process can take up to few hours depending on your server perfomance.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
