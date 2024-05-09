import React, { useEffect, useState } from 'react';
import usersApi from '../common/apis/usersApi'
import roomsApi from '../common/apis/roomsApi';
import messagesApi from '../common/apis/messagesApi';

const Chats = ({ userData }) => {

  const [roomField, setRoomField] = useState("")
  const [messageField, setMessageField] = useState("")
  const [usersList, setUsersList] = useState([])
  const [roomsList, setRoomsList] = useState([])
  const [messagesList, setMessagesList] = useState([])
  const [selectedId, setSelectedId] = useState({})
  const [isPrivate, setIsPrivate] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [roomId, setRoomId] = useState(null)

  useEffect(() => {
    fetchUsers();
    fetchRooms();
  }, []);

  const fetchUsers = async () => {
    try {
      await usersApi.get();
    } catch (error) {
      console.error(error);
    };
  }

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.get();
      setUsersList(response.data.users)
      setRoomsList(response.data.rooms)
      setCurrentUser(response.data.current_user)
      setIsPrivate(response.data.single_room.is_private)

    } catch (error) {
      console.error("error:", error.message);
    };
  }

  const fetchMessages = async () => {
    const api = selectedId.name === "room" ? roomsApi : usersApi
    try {
      const response = await api.show(selectedId?.id);
      setMessagesList(response.data.messages)
      setRoomId(response.data.single_room.id)

    } catch (error) {
      console.error(error);
    };
  }

  const handleRoomCreate = async (event) => {
    event.preventDefault();
    try {
      await roomsApi.create({ room: { name: roomField } });
      fetchRooms()
    } catch (error) {

    };
    setRoomField("")
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      await messagesApi.create(roomId, { message: { content: messageField }, is_private: isPrivate });
      fetchMessages()
    } catch (error) {
      console.error(error);
    };
    setMessageField("")
  };

  const handleSelected = (id, name, user) => {
    setSelectedId({ id, name, user })
  }

  useEffect(() => {
    selectedId.id && fetchMessages();
  }, [selectedId])

  const UsersListView = () => (
    usersList.length > 0 && (
      <ul className=" m-2 list-group">
        <h3>Users</h3>
        {usersList.map(user =>
          <li key={user.id}> <i className="btn btn-primary m-3" onClick={() => handleSelected(user.id, "user", user.username)}>{user.username}</i></li>
        )}
      </ul>
    ))

  const RoomsListView = () => (
    roomsList.length > 0 && (
      <ul className="m-2 list-group">
        <h3>Rooms</h3>
        {roomsList.map(room =>
          <li key={room.id} > <i className="btn btn-primary m-3" onClick={() => handleSelected(room.id, "room", room.name)}>{room.name}</i></li>
        )}
      </ul>
    ))
  const MessageListView = () => (
    messagesList && (
      <ul className="m-2 list-group d-flex flex-column">
        <h3 className='text-center pb-3'>{selectedId.user}</h3>
        {messagesList?.map(message =>
          < li className={(userData.id == message.user_id) ? " align-right d-flex justify-content-end " : " align-left d-flex justify-content-start "} key={message.id} > {
            message.username + ": " + message.content + " "}
          </li>
        )}
      </ul >
    ))

  return (
    <div className='row'>
      <div className="col-md-4">
        <UsersListView />
        <form onSubmit={handleRoomCreate}>
          <div className='m-2'>
            <label htmlFor="room-field"></label>
            <input
              type="text"
              disabled={!currentUser}
              id="room-field"
              value={roomField}
              onChange={(e) => setRoomField(e.target.value)}
            />
          </div>
          <button disabled={roomField.length < 1} className='m-1 btn btn-secondary' type="submit">Create Room</button>
        </form>
        <RoomsListView />
      </div>
      <div className="col-md-8">
        <form className='m-2 p-2 bg-primary rounded ' onSubmit={handleSendMessage}>
          <MessageListView />
          <div className='m-2 d-flex flex-row'>
            <textarea
              type="text"
              className="form-control flex-grow-1"
              id="message-field"
              disabled={!selectedId.id}
              value={messageField}
              onChange={(e) => setMessageField(e.target.value)}
            />
            <button disabled={messageField.length < 1} className='m-1 btn btn-secondary' type="submit">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chats;