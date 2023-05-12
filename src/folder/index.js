function loadOrganizedChats() {
  try {
    return JSON.parse(localStorage.organizedChats);
  }
  catch (e) {
    return {
      foldered: [],
      unfoldered: []
    }
  }
}

function saveOrganizedChats(organizedChats) {
  localStorage.organizedChats = JSON.stringify(organizedChats);
}

function organizeChatsByFolder(chats) {
  const folders = getFolder();

  return {
    foldered: folders.map((folder) => {
      return {
        id: folder.id,
        name: folder.name,
        open: folder.open,
        chats: chats.filter((chat) => {
          return folder.chats.some((chatId) => chatId === chat.id);
        })
      }
    }),
    unfoldered: chats.filter((chat) => {
      return !folders.some((folder) => {
        return folder.chats.some((chatId) => chatId === chat.id);
      });
    })
  }
}

export { loadOrganizedChats, saveOrganizedChats, organizeChatsByFolder };