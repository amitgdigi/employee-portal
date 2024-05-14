import React, { useEffect, useState } from 'react';
import roomsApi from '../common/apis/roomsApi';
import messagesApi from '../common/apis/messagesApi';
import ActionCable from 'actioncable';

const Chats = ({ userData }) => {

  const [roomField, setRoomField] = useState("")
  const [messageField, setMessageField] = useState("")
  const [usersList, setUsersList] = useState([])
  const [roomsList, setRoomsList] = useState([])
  const [messagesList, setMessagesList] = useState([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [params, setParams] = useState({ item: 15 });
  const queryParams = () => new URLSearchParams(params).toString();

  useEffect(() => {
    const cable = ActionCable.createConsumer('/cable');
    const chatChannel = cable.subscriptions.create('MessagesChannel', {
      received: (data) => {
        const user = usersList.find((u) => data.user_id === u.id) || currentUser
        const newMessage = { id: data.id, user_id: user.id, username: user.name, content: data.content, };
        setMessagesList(list => [...list, newMessage]);
      }
    });
    return () => {
      chatChannel.unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.get();
      setUsersList(response.data.users)
      setRoomsList(response.data.rooms);
      setCurrentUser(response.data.current_user);
      setIsPrivate(response.data.room.is_private);
    } catch (error) {
      console.error("error:", error.message);
    };
  }

  const fetchMessages = async () => {
    try {
      const response = await messagesApi.index(queryParams());
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
      fetchRooms();
    } catch (error) {
      console.error(error);
    };
    setRoomField("");
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      await messagesApi.create({ message: { content: messageField }, is_private: isPrivate, room_id: roomId });
      setParams({ ...params, item: 15 })
      fetchMessages();
    } catch (error) {
      console.error(error);
    };
    setMessageField("");
  };

  const handleSelected = (id, msgFor, roomName) => {
    setSelectedRoom(roomName)
    setParams({ ...params, id: id, msg_of: msgFor, item: 15 });
  }

  useEffect(() => {
    if (params.id) {
      fetchMessages();
    }
  }, [params])

  const ListView = () => (
    <div className="">
      <div className="">
        {roomsList.length > 0 && (
          roomsList.map(room =>
            <div className="btn border w-100 bg-gray-200" key={room.id} onClick={() => handleSelected(room.id, "room", room.name)}>

              <div className="d-flex align-items-center flex-start m-1">
                <div
                  className="rounded-circle bg-primary flex-shrink-0 query-tile-icon text-center text-black"
                  style={{ width: "25px", height: "25px" }}
                >
                  {room.name.charAt(0).toUpperCase()}
                </div>
                <li className='sidebar' key={room.id}><i className="fw-bold">{room.name}</i></li>
              </div>
              <p className="text-center">{room.message || ""} </p>
            </div>
          )
        )}
        {userData && usersList.map(user =>
          <div className='btn border w-100 bg-gray-200' key={user.id} onClick={() => handleSelected(user.id, "user", user.username)} >
            <div className="d-flex align-items-center flex-start m-1">
              <div
                className="rounded-circle bg-primary flex-shrink-0 query-tile-icon text-center text-black"
                style={{ width: "25px", height: "25px" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <li className='sidebar' ><i className="fw-bold">{user.username}</i></li>
            </div>
            <p className="text-center">{user.message || ""} </p>
          </div>
        )}
      </div>
    </div>
  );

  const MessageListView = () => (
    <div className="chat-view" >
      <h3 className="text-center">{selectedRoom}</h3>
      <div className="list-group hide_scrollbar"
        style={{
          height: 'calc(100vh - 150px)', overflowY: 'auto', border: "1px solid #ccc",
        }} >
        {params.id && <span className='btn' onClick={() => setParams({ ...params, item: params.item += 5 })}>click to load previous messages</span>}
        {messagesList.map(message => (
          <li
            key={message.id}
            className={message.user_id === userData?.id ? "align-right d-flex justify-content-end" : "align-left d-flex justify-content-start"}
          >
            <span className="message-content bg-light p-2 m-2 rounded" >
              {params.msg_of === "room" && message.user_id !== userData?.id && `${message.username?.charAt(0).toUpperCase() + message.username.slice(1)}: `} {message.content}
            </span>
          </li>
        ))}
      </div>
    </div >
  );


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 " >
          <div className="sidebar-header py-3">
            <h1>Chat</h1>
          </div>
          <div className="sidebar-menu">
            <ul className="list-unstyled">
              <ListView />
            </ul>
          </div>
        </div>

        <div className="col-md-9 bg-secondary">
          <div className="message-board px-3 pb-3 " style={{ height: 'calc(105vh - 150px)' }}>
            <div className="message my-3">
              <MessageListView />
            </div>
          </div>
          <div className="message-input px-3 py-2">
            <form onSubmit={handleSendMessage}>
              {userData && <div className="input-group">
                <input
                  className="form-control"
                  rows="3"
                  type='text'
                  value={messageField}
                  onChange={(e) => setMessageField(e.target.value)}
                  disabled={!params.id}
                  placeholder="Type a message..."
                />
                <div className="input-group-append">
                  <button className="m-1 btn btn-primary" disabled={!params.id || messageField.length < 1} type="submit">Send</button>
                </div>
              </div>}
            </form>
          </div>
        </div>
      </div >
    </div >
  );
};

export default Chats;
