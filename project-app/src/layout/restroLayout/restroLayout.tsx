import { Outlet, useLocation, useNavigate } from "react-router-dom"
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined"
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined"

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

import { data, restroData } from "@/data/navData"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
export default function RestroLayout() {
  const currentUser = useSelector((state: RootState) => state.user)
  const location = useLocation()
  const sidebarData = currentUser.isAdmin
    ? { ...restroData, teams: data.teams }
    : restroData
  const page = location.pathname
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())

  const pageTitle = page === "restro" ? "" : page

  const navigate = useNavigate()
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
                  <BreadcrumbLink href="/restro">Restro</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-end gap-1 pr-4">
            <Button variant={"outline"} onClick={() => navigate("menu")}>
              <MenuBookOutlinedIcon />
            </Button>
            <Button variant={"outline"} onClick={() => navigate("order")}>
              <RestaurantOutlinedIcon />
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
