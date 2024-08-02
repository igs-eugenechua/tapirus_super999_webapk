let host = 'https://tapirus-alt.jinjinjin777.com'
let port = '443'
let ArkKey = ''

export default {
  async SendDirect(ArkData, Platform = 'web', GameCode = '') {
    let sn = 0;
    ArkData.cmd_sn = sn;
    ArkData.platform = Platform;
    sn += 1;
    try {
      const result = await this.clientPost('/drtcmd', ArkData);

      if (result.code === 0) {
        return { code: 0, msg: result.msg };
      } else {
        return { code: 874, msg: result.msg, sn: sn };
      }
    } catch (e) {
      return { code: 874, msg: 'ArkClient -> SendDirectCommand 錯誤' };
    }
  },
  async clientPost(path, ArkData = null, timeout = 5000) {
    const data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(ArkData)));
    const URL = `${host}:${port}${path}`

    if (ArkKey === '') {
      const status = await this.getArkKey();
      if (status.code !== 0) {
        return { code: 872, msg: 'connect to GameServer false' };
      }
    }
    const shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.setHMACKey(ArkKey, 'TEXT');
    shaObj.update(data);
    const ArkSign = shaObj.getHMAC('HEX');

    const ArkForm = { ark_sign: ArkSign, ark_data: data };
    const Body = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(ArkForm)));

    const Request = axios.create(
      { 
        headers: { 'Content-type': 'multipart/form-data', Accept: 'text/plain' },
        timeout: 5000 
      }
    )
    try {
      const result = await Request.post(URL, Body);
      if (result.status === 200) {
        if (result.data === '') {
          return { code: 0, msg: '' };
        }

        const ArkResult = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(result.data));
        return { code: 0, msg: JSON.parse(ArkResult) };
      } else {
        return { code: 872, msg: result.statusText };
      }
    } catch (e) {
      return { code: 871, msg: e.toString() };
    }
  },
  async getArkKey() {
    try {
      const result = await this.clientRequest('/');
      if (result.code !== 0) {
        return { code: 872, msg: 'ArkClient Connection Server Error.' };
      }
      
      ArkKey = result.msg;
      return { code: result.code, msg: 'ArkClient Connection Server success' };
    } catch (e) {
      return { code: 872, msg: 'ArkClient Connection Server False' };
    }
  },
  async clientRequest(path) {
    const URL = `${host}:${port}${path}`
    const Request = axios.create(
      { 
        headers: { 'Content-type': 'multipart/form-data', Accept: 'text/plain' },
        timeout: 5000 
      }
    )
  
    try {
      const result = await Request.get(URL);
      if (result.status === 200) {
        return { code: 0, msg: result.data };
      } else {
        return { code: 871, msg: result.statusText };
      }
    } catch (e) {
      return { code: 871, msg: e.toString() };
    }
  },  
};
