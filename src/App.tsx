import MessageBox from "components/MessageBox";
import { useAppSelector } from "config/store";
import Channel from "pages/Channel";
import ChatServer from "pages/Channel/ChatServer";
import MyFriends from "pages/Channel/MyFriends";
import DirectMessages from "pages/Channel/MyFriends/DirectMessages";
import InvitePage from "pages/Invite";
import Login from "pages/Login";
import Register from "pages/Register";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Login />,
  //     action: () => {
  //       return redirect("/register");
  //     },
  //   },
  //   {
  //     path: "register",
  //     element: <Register />,
  //   },
  //   {
  //     path: "channel",
  //     element: <Channel />,
  //     children: [
  //       {
  //         path: "@me",
  //         element: <MyFriends />,
  //       },
  //       {
  //         path: "@me/:channelId",
  //         element: <DirectMessages />,
  //       },
  //       {
  //         path: ":serverId",
  //         element: <ChatServer />,
  //       },
  //     ],
  //   },
  // ]);
  return (
    <>
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invite/:inviteId" element={<InvitePage />} />
        <Route path="/channel" element={<Channel />}>
          <Route path="@me" element={<MyFriends />} />
          <Route path="@me/:channelId" element={<DirectMessages />} />
          <Route path=":serverId" element={<ChatServer />}>
            <Route path=":channelId" element={<MessageBox />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
