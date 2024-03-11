import './../page.css'
import './Dashboard.css'
import AdminTabs from '../../components/AdminTabs/AdminTabs'
import { useEffect, useState } from 'react'
import { Button } from 'flowbite-react'



const Dashboard = () => {
  const [rerender, setRerender] = useState(false)

  const updateRerender = () => {
    setRerender((rerender) => !rerender)
  }

  const refresh = () => window.location.reload(true)


  return (
    <div className="container mx-auto">
      <Button className="mx-auto" onClick={refresh}>Refresh</Button>
      <AdminTabs />
    </div>
  )
}

export default Dashboard
