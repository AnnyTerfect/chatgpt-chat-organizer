let authorization = "";

function checkAndJSON(res) {
  return new Promise((resolve, reject) => {
    if (res.status === 200) {
      resolve(res.json());
    } else {
      reject(res);
    }
  });
}

function getAuth() {
  if (authorization) {
    return Promise.resolve(authorization);
  } else {
    const url = "/api/auth/session";
    return fetch(url)
      .then(checkAndJSON)
      .then((json) => {
        authorization = json.accessToken;
        return json.accessToken
      });
  }
}

function deleteChat(chatId) {
  const url = `/backend-api/conversation/${chatId}`;
  return getAuth()
    .then((authorization) => {
      return fetch(url, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization,
        },
        body: JSON.stringify({
          is_visible: false,
        }),
      });
    })
    .then(checkAndJSON)
    .then((json) => {
      if (json.success) {
        return true;
      } else {
        return false;
      }
    });
}

function changeChatTitle(chatId, title) {
  const url = `/backend-api/conversation/${chatId}`;
  return getAuth()
    .then((authorization) => {
      return fetch(url, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization,
        },
        body: JSON.stringify({
          title,
        }),
      });
    })
    .then(checkAndJSON)
    .then((json) => {
      if (json.success) {
        return true;
      } else {
        return false;
      }
    });
}

function getAllChat() {
  const url = "/backend-api/conversations?offset=0&limit=100&order=updated";
  return getAuth()
    .then((authorization) => {
      return fetch(url, {
        headers: {
          authorization,
        },
      });
    })
    .then(checkAndJSON)
    .then((json) => {
      if (json.items) {
        return json.items;
      } else {
        return [];
      }
    });
}

export { deleteChat, getAllChat, changeChatTitle };
