import { Tabs } from 'flowbite-react'
import { useRef, useState } from 'react'
import { HiUserCircle } from 'react-icons/hi'
import { MdDashboard, MdLibraryAdd } from 'react-icons/md'
import FormArticle from '../FormArticle/FormArticle'
import ArticlesListFlowbite from '../../pages/admin/ArticlesListFlowbite'

function AdminTabs() {
  const tabsRef = useRef()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Tabs
        style="fullWidth"
        aria-label="Default tabs"
        ref={tabsRef}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >

        <Tabs.Item title="Utilisateurs" icon={HiUserCircle}>
          <p>Liste Utilisateurs</p>
        </Tabs.Item>
        <Tabs.Item active title="Stock" icon={MdDashboard}>
          <ArticlesListFlowbite />
        </Tabs.Item>
        <Tabs.Item title="Ajout" icon={MdLibraryAdd}>
          <FormArticle />
        </Tabs.Item>
      </Tabs>
    </>
  )
}

export default AdminTabs
