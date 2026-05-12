import { Button } from "@/components/ui/button"
import { increment, decrement } from "@/redux/counter/counterSlice"
import { type AppDispatch, type RootState } from "@/redux/store"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

export function App() {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch<AppDispatch>()

  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  if (!currentUser) return

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/")
        // console.log(response.status)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()
        setData(
          typeof json === "string"
            ? json
            : (json?.message ?? JSON.stringify(json))
        )
        console.log("test")
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("An unknown error occured")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

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
      User:{currentUser ? "Authenticated" : "Not Authenticated"}
      <hr />
      User:{currentUser.isAdmin ? "Admin" : "Not Admin"}
      <Button>Toggle</Button>
      <div>
        Server connection
        {data}
      </div>
    </div>
  )
}

export default App
