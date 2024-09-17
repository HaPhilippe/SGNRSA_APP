// import cache from "../utils/cache";
// import * as Application from 'expo-application';
// import * as Crypto from 'expo-crypto';
import wait from '../helpers/wait'

export const API_URL = "http://127.0.0.1:2024";
const initialOptions = {
          method: 'GET',
          cacheData: false,
          checkInCacheFirst: false
}

/**
 * consomer une api avec les options par défaut
 * @param {string} url - le lien à appeler
 * @param {object} options - autres options comme les headers et le body
 * @returns { Promise }
 */
export default async function fetchApi(url, options = initialOptions) {
          // const body = initialOptions.body && typeof(initialOptions.body) == "object" ? JSON.stringify(initialOptions.body) : JSON.stringify({})
          // const authorizationToken = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, `${Application.applicationId}${body}${url}`);
          options = {
                    ...initialOptions,
                    ...options
          }
          const cacheFirst = options.method == "GET" && options.checkInCacheFirst
          if (cacheFirst) {
                    // const data = await cache.get(url)
                    if (data) {
                              return data
                    }
          }
          const userF = localStorage.getItem("user");
          const user = JSON.parse(userF);
          // await wait(200)
          const { cacheData, checkInCacheFirst, ...otherOptions } = options
          // var headers = {
          //           ...otherOptions.headers,
          //           'x-access-token': authorizationToken
          // }
          var headers
          if (user) {
                    headers = {
                              // ...headers,
                              authorization: `bearer ${user.token}`
                    };
          }
          const response = await fetch(API_URL + url, {
                    ...otherOptions,
                    headers: {...headers}
          });

          // const canIcache = options.method == "GET" && options.cacheData
          const canIcache = false
          if (response.ok) {
                    const data = await response.json();
                    if (canIcache) {
                              // cache.store(url, data)
                    }
                    return data
          } else {
                    if(response.status == 500) {
                              // store.dispatch(setToastAction(TOAST_TYPES.SYSTEM_ERROR))
                    }
                    throw await response.json();
          }
}