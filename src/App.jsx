import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CommandPanel from './panels/CommandPanel'
import ForgePanel from './panels/ForgePanel'
import HangarPanel from './panels/HangarPanel'
import './index.css'

function App() {
  const [activePanel, setActivePanel] = useState('command')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [agentStatus, setAgentStatus] = useState('online') // online | busy | offline

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate agent status changes
  useEffect(() => {
    const statuses = ['online', 'busy', 'online', 'online', 'busy']
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length
      setAgentStatus(statuses[i])
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const panelTitles = {
    command: { title: 'Command Center', subtitle: 'Agent Control & Monitoring' },
    forge: { title: 'The Forge', subtitle: 'Creative Pipeline & Video Ops' },
    hangar: { title: 'The Hangar', subtitle: 'Project Portfolio' },
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'command':
        return <CommandPanel agentStatus={agentStatus} />
      case 'forge':
        return <ForgePanel />
      case 'hangar':
        return <HangarPanel />
      default:
        return <CommandPanel agentStatus={agentStatus} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        agentStatus={agentStatus}
      />
      <div className="main-content">
        <Topbar
          title={panelTitles[activePanel].title}
          subtitle={panelTitles[activePanel].subtitle}
          currentTime={currentTime}
          agentStatus={agentStatus}
        />
        <div className="page-content">
          {renderPanel()}
        </div>
      </div>
    </div>
  )
}

export default App
