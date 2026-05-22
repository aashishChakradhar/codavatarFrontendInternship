import { Outlet } from "react-router-dom"

import { AppSidebar } from "../sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { ToastMessage } from "@/components/toast/toast"
import { data } from "@/data/navData"

export default function AdminLayout() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  if (!currentUser || !currentUser.isAdmin) return

  const sidebarData = data

  const toast = useSelector((state: RootState) => state.toast)
  return (
    <SidebarProvider>
      <AppSidebar pvtData={sidebarData} />
      <SidebarInset>
        <header className="sticky top-0 z-2 flex h-16 shrink-0 items-center justify-between gap-2 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-8"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
      {toast.toastStatus && (
        <ToastMessage
          toastId={toast.toastId}
          status={toast.toastStatus}
          message={toast.toastMessage}
        />
      )}
    </SidebarProvider>
  )
}
