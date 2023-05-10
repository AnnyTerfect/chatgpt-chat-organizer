function getFolder() {
  return localStorage.folders ? JSON.parse(localStorage.folders) : [];
}

function setFolder(folders) {
  localStorage.folders = JSON.stringify(folders);
}

function getChatsByFolderId(folderId) {
  const folders = getFolder();
  const folder = folders.find((folder) => folder.id === folderId);
  return folder ? folder.chats : [];
}

function addChatToFolder(folderId, chatId) {
  const folders = getFolder();
  const folder = folders.find((folder) => folder.id === folderId);
  if (folder) {
    folder.chats.push(chatId);
  } else {
    folders.push({
      id: folderId,
      chats: [chatId]
    });
  }
  setFolder(folders);
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

function saveOrganizedChatsToFolder(organizedChats) {
  const folders = organizedChats.foldered.map((folder) => {
    return {
      id: folder.id,
      name: folder.name,
      open: folder.open,
      chats: folder.chats.map((chat) => chat.id)
    }
  });
  setFolder(folders);
}

export { getFolder, getChatsByFolderId, addChatToFolder, organizeChatsByFolder, saveOrganizedChatsToFolder }