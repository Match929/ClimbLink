const BASE_URL = 'http://localhost:8080/api';

// 统一请求方法
function request(url, method, data) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    
    const header = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    
    uni.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          uni.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

export default {
  get(url, data) {
    return request(url, 'GET', data);
  },
  post(url, data) {
    return request(url, 'POST', data);
  },
  put(url, data) {
    return request(url, 'PUT', data);
  },
  delete(url, data) {
    return request(url, 'DELETE', data);
  }
};
