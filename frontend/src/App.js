import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Home from './pages/Home/Home';

import './App.css';
import Navigation from './components/shared/Navigation/Navigation';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Authenticate from './pages/Authenticate/Authenticate';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';
import Room from './pages/Room/Room';
import User from './pages/User/User';

function App() {

  const { loading } = useLoadingWithRefresh();
  // console.log("environment variable: ", process.env.REACT_APP_BASE_URL)

  return (

    loading ? (<Loader message='Loading, please wait...'/>) : (
      <Router>
        <Navigation />
        <Routes>
          <Route exact path='/welcome'
            element={
              <WelcomeRoute redirectTo='/'>
                <Home />
              </WelcomeRoute>
            }
          />

          {/* Route protections */}
          <Route exact path='/'
            element={
              <ProtectedRoute redirectTo='/welcome'>
                <Rooms />
              </ProtectedRoute>
            }
          />

          <Route exact path='/room/:id'
            element={
              <ProtectedRoute redirectTo='/welcome'>
                <Room />
              </ProtectedRoute>
            }
          />

          <Route exact path='/user/:id'
            element={
              <ProtectedRoute redirectTo='/welcome'>
                <User />
              </ProtectedRoute>
            }
          />

          <Route path='/authenticate'
            element={
              <GuestRoute redirectTo='/'>
                <Authenticate />
              </GuestRoute>
            }
          />
          <Route path='/activate'
            element={
              <SemiProtectedRoute redirectTo='/authenticate' >
                Rooms
              </SemiProtectedRoute>
            }
          />
        </Routes>
      </Router>
    )
  );
}

const WelcomeRoute = ({ children, redirectTo }) => {

  const { isAuthenticated } = useSelector((state) => state.auth)

  return isAuthenticated ? <Navigate to={redirectTo} /> : children;
}

const ProtectedRoute = ({ children, redirectTo }) => {

  const { user, isAuthenticated } = useSelector((state) => state.auth)

  return !isAuthenticated ? <Navigate to={redirectTo} /> : (isAuthenticated && !user.activated) ? <Navigate to='/activate' /> : children;
}

const SemiProtectedRoute = ({ children, redirectTo }) => {

  const { user, isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    // if user is not authenticated - redirect to welcome page
    return <Navigate to={redirectTo} />
  }
  else if (isAuthenticated && !user.activated) {
    // if user is authenticated but not activated then display Activate component
    return <Activate />
  }
  else {
    // if user is authenticated as well as activated then show the Rooms component(props.children)
    return <Navigate to='/' />
  }
}

const GuestRoute = ({ children, redirectTo }) => {

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  if (!isAuthenticated) {
    return children
  }
  else if (isAuthenticated && !user.activated) {
    return <Navigate to='/activate' />
  }
  else {
    return <Navigate to={redirectTo} />
  }
}

export default App;
