import { MenuCardComponent } from "@/components/menu/menu.component"
import { SearchBar } from "@/components/searchBar/searchBar"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import OrderSummary from "@/components/orders/orderCart/orderSummary"

function Menu() {
  const menus = useSelector((state: RootState) => state.menu.menus)

  return (
    <div className="flex w-full flex-col flex-wrap justify-center gap-5">
      <div className="sticky top-15 z-1 flex justify-between gap-4 border-b bg-background py-3 md:top-12">
        <SearchBar />
        <OrderSummary />
      </div>
      <div className="flex h-full w-full flex-1 flex-wrap justify-center gap-5">
        {menus.map((dish) => (
          <div key={dish.id}>
            <MenuCardComponent {...dish} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
