import { SidebarDesktopLinks, SidebarMobile } from '../panels/Sidebar'
import Style from './Layouts.module.css'

type ContentLayoutProps = {
  children: React.ReactNode
}


export const ContentLayout: React.FC<ContentLayoutProps> = ({ children }) => {
  return (
    <div className={Style.adminLayoutWrapper}>
      <div className={Style.adminLayout}>{children}</div>
      <SidebarDesktopLinks />
      <SidebarMobile />
    </div>
  )
}
