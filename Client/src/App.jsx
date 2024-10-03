import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, useEffect } from "react";
import ProtectRoute from "./components/auth/ProtectRoute";
import { Suspense } from "react";
import { LayoutLoader } from "./components/layout/Loader";
import axios from "axios";
import { server } from "./constants/config";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManageMent"));

let user = true;

const App = () => {
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });

  return (
    <Router>
      <Suspense fallback={<LayoutLoader />}>
        {" "}
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route element={<ProtectRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />

            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/chats" element={<ChatManagement />} />
            <Route path="/admin/messages" element={<MessageManagement />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
