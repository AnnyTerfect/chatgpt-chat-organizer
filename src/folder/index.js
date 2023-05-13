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
  const organizedChats = loadOrganizedChats();
  organizedChats.foldered = organizedChats.foldered.map(folder => ({
    ...folder,
    chats: folder.chats.map(chatId => chats.find(chat => chat.id === chatId))
  }));
  organizedChats.unfoldered = organizedChats.unfoldered.map(chatId => chats.find(chat => chat.id === chatId));
  return organizedChats;
}

export { loadOrganizedChats, saveOrganizedChats, organizeChatsByFolder };