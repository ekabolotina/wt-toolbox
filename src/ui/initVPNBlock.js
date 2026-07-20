import { checkVpnAction } from '../actions/checkVpnAction.js';

const vpnStatus = document.getElementById('vpnStatus');
const vpnIndicator = document.getElementById('vpnIndicator');
const vpnText = document.getElementById('vpnText');

function setVpnState(state) {
  vpnStatus.className = 'vpn-status ' + state;
  vpnIndicator.className = 'vpn-indicator ' + state;
}

export async function initVPNBlock() {
  setVpnState('checking');
  vpnText.textContent = 'Проверка VPN...';

  checkVpnAction
    .execute()
    .then((response) => {
      if (response) {
        setVpnState('online');
        vpnText.textContent = 'VPN подключён';
      } else {
        setVpnState('offline');
        vpnText.textContent = 'VPN отключён';
      }
    })
    .catch(() => {
      setVpnState('offline');
      vpnText.textContent = 'Ошибка проверки';
    });
}
