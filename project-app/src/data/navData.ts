// This is sample data.

import type { ElementType } from "react"
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react"
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined"
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined"
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined"
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined"
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined"

export interface TeamsDataInterface {
  name: string
  logo: ElementType
  plan: string
  path: string
}
export interface NavMainDataInterface {
  title: string
  url: string
  icon?: ElementType
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}
export interface ProjectsDataInterface {
  name: string
  url: string
  icon: ElementType
}
export interface NavigationDataInterface {
  teams: TeamsDataInterface[]
  navMain: NavMainDataInterface[]
  projects: ProjectsDataInterface[] | null
}

export const data: NavigationDataInterface = {
  teams: [
    {
      name: "Restify Admin",
      logo: GalleryVerticalEnd,
      plan: "Admin",
      path: "/",
    },
    {
      name: "Restify Kitchen",
      logo: AudioWaveform,
      plan: "Kitchen",
      path: "/kitchen/",
    },
    {
      name: "Restify Reception",
      logo: AudioWaveform,
      plan: "Kitchen",
      path: "/reception/",
    },
    {
      name: "Restify Restro",
      logo: Command,
      plan: "Restro",
      path: "/restro/",
    },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: TimelineOutlinedIcon,
      isActive: true,
    },
    {
      title: "Menu",
      url: "/menu",
      icon: MenuBookOutlinedIcon,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: RestaurantOutlinedIcon,
      isActive: true,
    },
    {
      title: "Table",
      url: "/tables",
      icon: ChairOutlinedIcon,
      isActive: true,
    },
    {
      title: "Checkout",
      url: "/checkout",
      icon: PrintOutlinedIcon,
      isActive: true,
    },
  ],

  projects: null,
}

export const restroData: NavigationDataInterface = {
  teams: [
    {
      name: "Restify Restro",
      logo: GalleryVerticalEnd,
      plan: "Restro",
      path: "/restro/",
    },
  ],

  navMain: [
    {
      title: "Menu",
      url: "/menu",
      icon: MenuBookOutlinedIcon,
      isActive: true,
    },
    {
      title: "Table",
      url: "/table",
      icon: ChairOutlinedIcon,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/order",
      icon: RestaurantOutlinedIcon,
      isActive: true,
    },
  ],

  projects: null,
}

export const receptionData: NavigationDataInterface = {
  teams: [
    {
      name: "Restify Reception",
      logo: GalleryVerticalEnd,
      plan: "Reception",
      path: "/reception/",
    },
  ],

  navMain: [
    {
      title: "Table",
      url: "/tables",
      icon: ChairOutlinedIcon,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: RestaurantOutlinedIcon,
      isActive: true,
    },
    {
      title: "Checkout",
      url: "/checkout",
      icon: PrintOutlinedIcon,
      isActive: true,
    },
  ],

  projects: null,
}

export const kitchenData: NavigationDataInterface = {
  teams: [
    {
      name: "Restify Kitchen",
      logo: AudioWaveform,
      plan: "Kitchen",
      path: "/kitchen/",
    },
  ],

  navMain: [
    {
      title: "Orders",
      url: "order",
      icon: RestaurantOutlinedIcon,
    },
  ],

  projects: null,
}
