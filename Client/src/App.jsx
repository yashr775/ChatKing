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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes></Suspense>

    </Router>
  )
}

export default App