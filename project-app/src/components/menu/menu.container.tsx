import { MenuCardComponent } from "@/components/menu/menu.component"
import { SearchBar } from "@/components/searchBar/searchBar"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMenu } from "@/redux/menu/menuSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import OrderSummary from "@/components/orders/orderCart/orderSummary"

function Menu() {
  const dispatch = useDispatch<AppDispatch>()
  const { menus, status, error } = useSelector((state: RootState) => state.menu)

  useEffect(() => {
    if (status === "idle") dispatch(fetchMenu())
  }, [dispatch, status])

  if (status === "pending") {
    return <div className="text-sm">Loading Menu...</div>
  }

  if (status === "failed") {
    return (
      <div className="text-sm text-red-500">
        Error loading Menu
        <hr />
        {error}
      </div>
    )
  }
  return (
    <div className="flex w-full flex-col flex-wrap justify-center gap-5">
      <div className="sticky top-15 z-1 flex justify-between gap-4 border-b bg-background py-3 md:top-12">
        <SearchBar />
        <OrderSummary />
      </div>
      <div className="flex w-full flex-wrap justify-center gap-5">
        {menus.map((item, index) => (
          <div key={index}>
            <MenuCardComponent {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
