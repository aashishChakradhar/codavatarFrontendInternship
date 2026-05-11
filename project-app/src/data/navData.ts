// This is sample data.

import type { ElementType } from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined"
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined"
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined"

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
      name: "Restify Reception",
      logo: GalleryVerticalEnd,
      plan: "Reception",
      path: "/reception/",
    },
    {
      name: "Restify Kitchen",
      logo: AudioWaveform,
      plan: "Kitchen",
      path: "/kitchen/",
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
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      // isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
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
    // {
    //   title: "Cart",
    //   url: "/cart",
    //   icon: SquareTerminal,
    // isActive: true,
    // items: [
    //   {
    //     title: "History",
    //     url: "#",
    //   },
    //   {
    //     title: "Starred",
    //     url: "#",
    //   },
    //   {
    //     title: "Settings",
    //     url: "#",
    //   },
    // ],
    // },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],

  projects: null,
  // [
  // {
  //   name: "Restro Design Engineering",
  //   url: "#",
  //   icon: Frame,
  // },
  // {
  //   name: "Sales & Marketing",
  //   url: "#",
  //   icon: PieChart,
  // },
  // {
  //   name: "Travel",
  //   url: "#",
  //   icon: Map,
  // },
  // ],
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
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      // isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],

  projects: [
    {
      name: "Reception Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
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
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: SquareTerminal,
    //   isActive: true,
    // },
    {
      title: "Orders",
      url: "order",
      icon: SquareTerminal,
      // isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },

    //   {
    //     title: "Models",
    //     url: "#",
    //     icon: Bot,
    //     items: [
    //       {
    //         title: "Genesis",
    //         url: "#",
    //       },
    //       {
    //         title: "Explorer",
    //         url: "#",
    //       },
    //       {
    //         title: "Quantum",
    //         url: "#",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Documentation",
    //     url: "#",
    //     icon: BookOpen,
    //     items: [
    //       {
    //         title: "Introduction",
    //         url: "#",
    //       },
    //       {
    //         title: "Get Started",
    //         url: "#",
    //       },
    //       {
    //         title: "Tutorials",
    //         url: "#",
    //       },
    //       {
    //         title: "Changelog",
    //         url: "#",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings2,
    //     items: [
    //       {
    //         title: "General",
    //         url: "#",
    //       },
    //       {
    //         title: "Team",
    //         url: "#",
    //       },
    //       {
    //         title: "Billing",
    //         url: "#",
    //       },
    //       {
    //         title: "Limits",
    //         url: "#",
    //       },
    //     ],
    //   },
  ],

  projects: null,
  // projects: [
  //   {
  //     name: "Kitchen Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}
