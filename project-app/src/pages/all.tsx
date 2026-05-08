import { Button } from "@/components/ui/button"
import { increment, decrement } from "@/redux/counter/counterSlice"
import { type AppDispatch, type RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"

export function App() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector((state: RootState) => state.user)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <h2>{count}</h2>
        <div className="flex">
          <Button className="mt-2" onClick={() => dispatch(decrement())}>
            Decrement
          </Button>
          <Button className="mt-2" onClick={() => dispatch(increment())}>
            Increment
          </Button>
        </div>
      </div>
      User:{currentUser.isAuthenticated ? "Authenticated" : "Not Authenticated"}
      <hr />
      User:{currentUser.isAdmin ? "Admin" : "Not Admin"}
      <Button>Toggle</Button>
    </div>
  )
}

export default App
