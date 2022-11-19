import { toast } from 'react-toastify';
import '../../css/Settings/AdminSettings.css';

function AdminSettings() {
  function confirmFetch() {
    toast('Fetch confirmed', { type: 'success' });
  }
  return (
    <div id="AdminSettings">
      <div id="ReloadData">
        <div className="description">
          <h2>Reload Data</h2>
          <span>
            Here you can reload data from external API. This process can take up to few hours
            depending on your server perfomance.
          </span>
        </div>
        <div className="content">
          <div className="form">
            <div className="formItem">
              <button type="button" onClick={confirmFetch}>
                Fetch everything
              </button>
            </div>
            <div className="formItem">
              <button type="button">Fetch prices</button>
            </div>
            <div className="formItem">
              <button type="button">Fetch sales</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
