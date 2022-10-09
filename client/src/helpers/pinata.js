import axios from "axios";
import CID from "cids";
const key = "49e223db86fea36bd157";
const secret =
  "875eab25e2ec263b76609d3e42db721fb5236cb723eaa057696dbf396e10e784";

// Using the input data, upload the meta data with pinata's API
export const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      const cid = new CID(response.data.IpfsHash);
      const URI = cid.toV1().toString();
      return {
        success: true,
        URI: URI,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const getJSONfromIPFS = async (URI) => {
  const res = await axios.get(`https://${URI}.ipfs.nftstorage.link/`);
  return res.data;
};
