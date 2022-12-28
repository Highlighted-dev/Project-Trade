import { IModal } from '../../../@types/Modal';
import '../../css/Settings/AdminSettings.css';
import useModalStore from '../Modal/ModalStore';

function AdminSettings() {
  const modalSetup = useModalStore((state: IModal) => state.modalSetup);
  function confirmFetch(e: React.MouseEvent<HTMLButtonElement>) {
    switch (e.currentTarget.id) {
      case 'fetchEverything':
        modalSetup({
          id: 'fetchEverything',
          title: 'Confirm fetch',
          text: 'Are you sure you want to fetch all the data from external API? This may take up to few hours',
        });
        break;
      case 'fetchPrices':
        modalSetup({
          id: 'fetchPrices',
          title: 'Confirm fetch',
          text: 'Are you sure you want to fetch prices data? This may take up to few hours',
        });
        break;
      case 'fetchSales':
        modalSetup({
          id: 'fetchSales',
          title: 'Confirm fetch',
          text: 'Are you sure you want to fetch sales data? This may take up to few hours',
        });
        break;
      default:
        break;
    }
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
              <button type="button" onClick={confirmFetch} id="fetchEverything">
                Fetch everything
              </button>
            </div>
            <div className="formItem">
              <button type="button" onClick={confirmFetch} id="fetchPrices">
                Fetch prices
              </button>
            </div>
            <div className="formItem">
              <button type="button" onClick={confirmFetch} id="fetchSales">
                Fetch sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
