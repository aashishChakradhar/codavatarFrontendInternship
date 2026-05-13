import Menu from "@/components/menu"
import useLoadMenu from "@/hooks/use-loadMenu"

export default function MenuPage() {
  useLoadMenu()
  return (
    <>
      <Menu />
    </>
  )
}
