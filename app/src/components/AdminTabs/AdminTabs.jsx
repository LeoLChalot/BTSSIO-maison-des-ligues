import { Button, Tabs } from 'flowbite-react'
import { useRef, useState } from 'react'
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi'
import { MdDashboard } from 'react-icons/md'
import ArticlesList from '../../pages/admin/ArticlesList'
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
        <Tabs.Item active title="Utilisateurs" icon={HiUserCircle}>
          <p>Liste Utilisateurs</p>
        </Tabs.Item>
        <Tabs.Item title="Stock" icon={MdDashboard}>
          <ArticlesListFlowbite />
        </Tabs.Item>
        <Tabs.Item title="Ajout" icon={HiAdjustments}>
          <FormArticle />
        </Tabs.Item>
        <Tabs.Item title="Edition" icon={HiClipboardList}>

        </Tabs.Item>
      </Tabs>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Active tab: {activeTab}
      </div>
    </>
  )
}

export default AdminTabs
