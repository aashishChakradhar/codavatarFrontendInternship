import { Outlet } from "react-router-dom"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

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

import { data, receptionData } from "@/data/navData"
import { AppSidebar } from "../sidebar/app-sidebar"
import { ToastMessage } from "@/components/toast/toast"

export default function ReceptionLayout() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const toast = useSelector((state: RootState) => state.toast)
  if (!currentUser) return
  const sidebarData = currentUser.isAdmin
    ? { ...receptionData, teams: data.teams }
    : receptionData

  const page = location.pathname
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
  const pageTitle = page === "reception" ? "" : page

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
                  <BreadcrumbLink href="/reception">Reception</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
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
