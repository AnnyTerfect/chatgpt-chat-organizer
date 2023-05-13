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
    chats: folder.chats.filter(chat => chats.find(c => c.id === chat.id))
  }));
  organizedChats.unfoldered = chats.filter(chat => !organizedChats.foldered.find(folder => folder.chats.find(c => c.id === chat.id)));
  return organizedChats;
}

export { loadOrganizedChats, saveOrganizedChats, organizeChatsByFolder };