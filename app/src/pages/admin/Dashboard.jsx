import './../page.css'
import './Dashboard.css'
import AdminTabs from '../../components/AdminTabs/AdminTabs'
import { useEffect, useState } from 'react'
import { Button } from 'flowbite-react'
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [rerender, setRerender] = useState(false)
	const {isAdmin} = useAuth();
  const updateRerender = () => {
    setRerender((rerender) => !rerender)
  }

  const refresh = () => window.location.reload(true)
	
	useEffect(() => {
		console.log({"isAdmin": isAdmin});
	},[isAdmin])

  return (
    <div className="container mx-auto">
      <Button className="mx-auto" onClick={refresh}>Refresh</Button>
      <AdminTabs />
    </div>
  )
}

export default Dashboard
