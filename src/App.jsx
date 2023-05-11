import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatFolder from "./components/ChatFolder";
import AddFolderButton from "./components/Button/AddFolder";
import { organizeChatsByFolder, saveOrganizedChatsToFolder } from "./folder";
import { getAllChat, changeChatTitle, deleteChat } from "./requests";
import { Box, Divider } from "@mui/material";

function debounce(func, delay) {
  let timerId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timerId);

    timerId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

function App() {
  const [currentChatId, setCurrentChatId] = useState(
    location.href.split("/").pop()
  );
  const [loaded, setLoaded] = useState(false);
  const [allChat, setAllChat] = useState([]);
  const [organizedChats, setOrganizedChats] = useState({
    foldered: [],
    unfoldered: [],
  });

  const update = () => {
    getAllChat()
      .then((allChat) => {
        setAllChat(allChat);
        return allChat;
      })
      .then(organizeChatsByFolder)
      .then(setOrganizedChats)
      .then(() => setLoaded(true));
  };

  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
    const debouncedUpdate = debounce(update, 500);
    // Observe title change
    const titleElement = document.querySelector("title");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.tagName === "TITLE") {
          debouncedUpdate();
        }
      });
    }, []);

    const config = {
      childList: true,
    };
    observer.observe(titleElement, config);
    return () => {
      observer && observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveOrganizedChatsToFolder(organizedChats);
  }, [organizedChats, loaded]);

  function handleClickAddFolder() {
    const newFolder = {
      id: Math.random().toString(36).slice(-8),
      name: "New folder",
      chats: [],
    };
    setOrganizedChats({
      ...organizedChats,
      foldered: [...organizedChats.foldered, newFolder],
    });
  }

  function handleSetOpen(id, open) {
    const newFoldered = organizedChats.foldered
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((folder) => {
        if (folder.id === id) {
          folder.open = open;
        }
        return folder;
      });
    setOrganizedChats({
      ...organizedChats,
      foldered: newFoldered,
    });
  }

  function handleClickChat(id) {
    const propsKey = Object.keys(document.querySelector("ol li")).find((key) =>
      key.startsWith("__reactProps")
    );
    const elementToClick = Array.from(document.querySelectorAll("ol li")).find(
      (element) => {
        const props = element[propsKey].children.props;
        return props && props.id === id;
      }
    );
    if (elementToClick) {
      elementToClick.children[0].click();
      setCurrentChatId(id);
    } else {
      // If the chat is not selected, change the url to the chat
      location.href = `/c/${id}`;
    }
  }

  function handleChangeTitle(id, title) {
    const newFoldered = organizedChats.foldered.map((folder) => {
      if (folder.id === id) {
        folder.name = title;
      }
      return folder;
    });
    setOrganizedChats({
      ...organizedChats,
      foldered: newFoldered,
    });
  }

  function handleChangeChatTitle(id, title) {
    changeChatTitle(id, title)
      .then((res) => {
        if (!res) {
          throw new Error("Failed to change chat title");
        }
      })
      .then(() => {
        const newFoldered = organizedChats.foldered.map((folder) => {
          const newChats = folder.chats.map((chat) => {
            if (chat.id === id) {
              chat.title = title;
            }
            return chat;
          });
          return {
            ...folder,
            chats: newChats,
          };
        });
        const newUnfoldered = organizedChats.unfoldered.map((chat) => {
          if (chat.id === id) {
            chat.title = title;
          }
          return chat;
        });
        setOrganizedChats({
          ...organizedChats,
          foldered: newFoldered,
          unfoldered: newUnfoldered,
        });
      })
      .catch(console.error);
  }

  function handleMoveChat(id, targetFolderId) {
    const newFoldered = organizedChats.foldered.map((folder) => {
      // Remove from source chat
      const newChats = folder.chats.filter((chat) => chat.id !== id);
      if (folder.id === targetFolderId) {
        const unFoldered = organizedChats.unfoldered.find(
          (chat) => chat.id === id
        );
        // Source chat unfoldered
        if (unFoldered) {
          newChats.push(unFoldered);
        } else {
          // Source chat foldered
          const sourceFolder = organizedChats.foldered.find((folder) =>
            folder.chats.find((chat) => chat.id === id)
          );
          const sourceChat = sourceFolder.chats.find((chat) => chat.id === id);
          newChats.push(sourceChat);
        }
      }
      return {
        ...folder,
        chats: newChats,
      };
    });
    const newUnfoldered = targetFolderId
      ? organizedChats.unfoldered.filter((chat) => chat.id !== id) // Remove from unfoldered
      : [
          ...organizedChats.unfoldered,
          organizedChats.foldered
            .find((folder) => folder.chats.find((chat) => chat.id === id))
            .chats.find((chat) => chat.id === id),
        ]; // Remove from source chat
    setOrganizedChats({
      ...organizedChats,
      foldered: newFoldered,
      unfoldered: newUnfoldered,
    });
  }

  function handleDeleteFolder(id) {
    const newUnfoldered = organizedChats.unfoldered.concat(
      organizedChats.foldered.find((folder) => folder.id === id).chats
    );
    const newFoldered = organizedChats.foldered.filter(
      (folder) => folder.id !== id
    );
    setOrganizedChats({
      ...organizedChats,
      foldered: newFoldered,
      unfoldered: newUnfoldered,
    });
  }

  function handleDeleteChat(id) {
    const propsKey = Object.keys(document.querySelector("ol li")).find((key) =>
      key.startsWith("__reactProps")
    );
    const elementToRemove = Array.from(document.querySelectorAll("ol li")).find(
      (element) => {
        const props = element[propsKey].children.props;
        return props && props.id === id;
      }
    );
    if (elementToRemove) {
      elementToRemove.remove();
      console.log("remove successfully");
    } else {
      throw new Error(
        `Failed to find chat. id: ${id}, propsKey: ${propsKey}`
      );
    }
    deleteChat(id)
      .then((res) => {
        if (!res) {
          throw new Error("Failed to delete chat");
        }
      })
      .then(() => {
        const newFoldered = organizedChats.foldered.map((folder) => {
          const newChats = folder.chats.filter((chat) => chat.id !== id);
          return {
            ...folder,
            chats: newChats,
          };
        });
        const newUnfoldered = organizedChats.unfoldered.filter(
          (chat) => chat.id !== id
        );
        // Update current chat
        setAllChat(allChat.filter((chat) => chat.id !== id));
        setOrganizedChats({
          ...organizedChats,
          foldered: newFoldered,
          unfoldered: newUnfoldered,
        });
      })
      .catch(console.error);
  }

  return (
    <div className="App">
      <AddFolderButton onClick={handleClickAddFolder} />
      {organizedChats &&
        organizedChats.foldered &&
        organizedChats.foldered
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((folder) => (
            <Box key={folder.id}>
              <ChatFolder
                id={folder.id}
                title={folder.name}
                chats={folder.chats}
                onChangeTitle={(newTitle) =>
                  handleChangeTitle(folder.id, newTitle)
                }
                onChangeChatTitle={handleChangeChatTitle}
                onMoveChat={handleMoveChat}
                onDeleteFolder={handleDeleteFolder}
                onDeleteChat={handleDeleteChat}
                onClickChat={handleClickChat}
                editable={true}
                open={folder.open}
                setOpen={(open) => handleSetOpen(folder.id, open)}
                currentChatId={currentChatId}
              />
              <Divider />
            </Box>
          ))}
      {
        <ChatList
          chats={organizedChats.unfoldered}
          editable={false}
          currentChatId={currentChatId}
          onChangeChatTitle={handleChangeChatTitle}
          onMoveChat={handleMoveChat}
          onDeleteChat={handleDeleteChat}
          onClickChat={handleClickChat}
        />
      }
    </div>
  );
}

export default App;
