import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy } from "react"
import ProtectRoute from "./components/auth/ProtectRoute"
import { Suspense } from "react"
import { LayoutLoader } from "./components/layout/Loader"

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Groups = lazy(() => import('./pages/Groups'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))

let user = true;

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LayoutLoader />}> <Routes>
        <Route
          path="/login"
          element={
            <ProtectRoute user={!user} redirect="/">
              <Login />
            </ProtectRoute>
          }
        />
        <Route element={<ProtectRoute user={user} />} >
          <Route path='/' element={<Home />} />
          <Route path='/chat/:chatId' element={<Chat />} />
          <Route path='/groups' element={<Groups />} />


          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes></Suspense>

    </Router>
  )
}

export default App