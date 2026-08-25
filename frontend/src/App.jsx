import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ControlRoomLayout from './components/layout/ControlRoomLayout'
import VisitorLayout from './components/layout/VisitorLayout'
import Overview from './pages/control-room/Overview'
import LiveCity from './pages/control-room/LiveCity'
import Predictions from './pages/control-room/Predictions'
import Actions from './pages/control-room/Actions'
import Hospitality from './pages/control-room/Hospitality'
import Mobility from './pages/control-room/Mobility'
import Welfare from './pages/control-room/Welfare'
import Scenarios from './pages/control-room/Scenarios'
import Impact from './pages/control-room/Impact'
import GlassBox from './pages/control-room/GlassBox'
import VisitorHome from './pages/visitor/Home'
import VisitorDestination from './pages/visitor/Destination'
import VisitorPrivacy from './pages/visitor/Privacy'
import Plan from './pages/visitor/Plan'
import VisitorRoute from './pages/visitor/Route'
import Stay from './pages/visitor/Stay'
import Support from './pages/visitor/Support'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/control-room" element={<ControlRoomLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview"    element={<Overview />} />
        <Route path="live-city"   element={<LiveCity />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="actions"     element={<Actions />} />
        <Route path="hospitality" element={<Hospitality />} />
        <Route path="mobility"    element={<Mobility />} />
        <Route path="welfare"     element={<Welfare />} />
        <Route path="scenarios"   element={<Scenarios />} />
        <Route path="impact"      element={<Impact />} />
        <Route path="glass-box"   element={<GlassBox />} />
      </Route>
      <Route path="/visitor" element={<VisitorLayout />}>
        <Route index element={<VisitorHome />} />
        <Route path="destination/:destinationId" element={<VisitorDestination />} />
        <Route path="privacy" element={<VisitorPrivacy />} />
        <Route path="plan"    element={<Plan />} />
        <Route path="route"   element={<VisitorRoute />} />
        <Route path="stay"    element={<Stay />} />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
  )
}
