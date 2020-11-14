import Request from "./request";
import Serializer from "./serializer";

function cleanLocalAuthorizationStorage() {
  localStorage.removeItem("_dzq_authorization_access_token");
  localStorage.removeItem("_dzq_authorization_token_type");
  localStorage.removeItem("_dzq_authorization_refresh_token");
  localStorage.removeItem("_dzq_userinfo");
  localStorage.removeItem("_dzq_authorization_expires_in");
  return true;
}

export default {
  async authentication() {
    return await new Promise(async (resolve, reject) => {
      let returnData = false;
      let Authorization = localStorage.getItem(
        "_dzq_authorization_access_token"
      );
      if (Authorization) {
        Request.setAuthorization(Authorization);
        let User = localStorage.getItem("_dzq_userinfo");
        let AuthorizationExpiresIn = localStorage.getItem(
          "_dzq_authorization_expires_in"
        );
        if (
          User &&
          User !== "undefined" &&
          AuthorizationExpiresIn &&
          Number(AuthorizationExpiresIn) > Date.now()
        ) {
          AuthorizationExpiresIn = Number(AuthorizationExpiresIn);
          User = JSON.parse(User);
          await Request.get("/users/" + User["id"])
            .then((userInfo) => {
              userInfo = Serializer(userInfo)["data"];
              returnData = userInfo;
              localStorage.setItem("_dzq_userinfo", JSON.stringify(userInfo));
            })
            .catch((err) => {
              returnData = false;
              Request.removeAuthorization();
              cleanLocalAuthorizationStorage();
            });
          //当token有效期小于1天 就刷新
          if (AuthorizationExpiresIn < Date.now() + 86400000) {
            const RefreshToken = localStorage.getItem(
              "_dzq_authorization_refresh_token"
            );
            await Request.post("/refresh-token", {
              data: {
                attributes: {
                  refresh_token: RefreshToken,
                  grant_type: "refresh_token",
                },
              },
            })
              .then((tokenInfo) => {
                tokenInfo = Serializer(tokenInfo)["data"];
                Authorization = tokenInfo["access_token"];
                localStorage.setItem(
                  "_dzq_authorization_refresh_token",
                  tokenInfo["refresh_token"]
                );
                localStorage.setItem(
                  "_dzq_authorization_access_token",
                  tokenInfo["access_token"]
                );
                localStorage.setItem(
                  "_dzq_authorization_token_type",
                  tokenInfo["token_type"]
                );
                localStorage.setItem(
                  "_dzq_authorization_expires_in",
                  String(Date.now() + tokenInfo["expires_in"] * 1000)
                );
              })
              .catch((err) => {
                returnData = false;
                Request.removeAuthorization();
                cleanLocalAuthorizationStorage();
              });
          }
          if (returnData !== false) {
            Request.setAuthorization(Authorization);
            resolve(returnData);
          } else {
            reject(returnData);
          }
        } else {
          Request.removeAuthorization();
          cleanLocalAuthorizationStorage();
          reject(false);
        }
      }
    });
  },
  loginSuccess(loginData, notSerializer = false) {
    if (notSerializer === false) {
      loginData = Serializer(loginData)["data"];
    }
    localStorage.setItem(
      "_dzq_authorization_access_token",
      loginData["access_token"]
    );
    localStorage.setItem(
      "_dzq_authorization_refresh_token",
      loginData["refresh_token"]
    );
    localStorage.setItem(
      "_dzq_authorization_expires_in",
      Date.now() * 1000 + loginData["expires_in"]
    );
    localStorage.setItem(
      "_dzq_authorization_token_type",
      loginData["token_type"]
    );
    localStorage.setItem("_dzq_userinfo", JSON.stringify(loginData["users"]));
    Request.setAuthorization(loginData["access_token"]);
    return loginData["users"];
  },
  logout() {
    Request.removeAuthorization();
    return cleanLocalAuthorizationStorage();
  },
};
