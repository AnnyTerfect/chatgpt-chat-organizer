import { GM_info } from '$';

function checkUpdate() {
  const currentVersion = GM_info.script.version;
  const updateURL = GM_info.scriptUpdateURL || GM_info.script.updateURL || GM_info.script.downloadURL;
  return fetch(updateURL)
    .then(res => res.text())
    .then(text => {
      const match = text.match(/@version\s+(\d+\.\d+\.\d+)/);
      if (match && match[1] !== currentVersion) {
        return true;
      }
    })
    .catch(err => console.error('Error checking for script update: ', err));
}


export { checkUpdate };