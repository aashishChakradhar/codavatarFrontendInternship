import { UserRound } from "lucide-react"
import { Phone } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import moment from "moment"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Input } from "@/components/ui/input"
import { useState, type ChangeEvent } from "react"
import { ToastMessage } from "../toast/toast"

export function BillingComponent(props: {
  flatItems: any[]
  totalAmount: number
  discountOption: string
  setDiscountOption: (s: string) => void
  discountValue: number
  handleDiscountAmount: (e: ChangeEvent<HTMLInputElement>) => void
  discounted: number
  handleCheckout: (
    fullName: string,
    phoneNumber: string,
    payMethod: string
  ) => void
}) {
  const {
    flatItems,
    totalAmount,
    discountOption,
    setDiscountOption,
    discountValue,
    handleDiscountAmount,
    discounted,
    handleCheckout,
  } = props
  const [fullName, setFullName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const payMethod = "cash"
  const [showValidationToast, setShowValidationToast] = useState(false)

  const onConfirm = () => {
    if (!fullName.trim() || !phone.trim()) {
      setShowValidationToast(true)
      setTimeout(() => setShowValidationToast(false), 2500)
      return
    }
    handleCheckout(fullName, phone, payMethod)
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="box-border flex flex-col border-2 border-white p-5">
        <div className="flex justify-between">
          <span className="ml-auto">
            Date: {moment().format("MMMM Do YYYY")}
          </span>
        </div>
        <div>
          <Field className="max-w-xs">
            <FieldLabel htmlFor="inline-end-input">Full Name</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="inline-end-input"
                type="text"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={(e) =>
                  setFullName((e.target as HTMLInputElement).value)
                }
              />
              <InputGroupAddon align="inline-end">
                <UserRound />
              </InputGroupAddon>
            </InputGroup>

            <FieldLabel htmlFor="inline-end-input">Phone</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="inline-end-input"
                type="tel"
                placeholder="98********"
                required
                value={phone}
                onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
              />
              <InputGroupAddon align="inline-end">
                <Phone />
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>Icon positioned at the end.</FieldDescription>
          </Field>
        </div>
        <Table className="mx-auto w-lg">
          <TableCaption>Thank you for visiting us.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">S.N</TableHead>
              <TableHead>Dish</TableHead>
              <TableHead className="w-30 text-right">Rate</TableHead>
              <TableHead className="w-30 text-center">Quantity</TableHead>
              <TableHead className="w-35 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatItems.map((content, idx) => (
              <TableRow key={`${content.id}-${idx}`}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-medium">
                  {content.dish.name}
                </TableCell>
                <TableCell className="text-right">
                  Rs. {(content.dish as any)?.price ?? 0}
                </TableCell>
                <TableCell className="text-center">
                  {content.quantity}
                </TableCell>
                <TableCell className="text-right">
                  Rs.{" "}
                  {(content.dish as any)?.price * Number(content.quantity ?? 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Amount</TableCell>
              <TableCell className="text-right">Rs. {totalAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Discount</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-sm">
                      {discountOption}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel></DropdownMenuLabel>
                      <DropdownMenuItem
                        onSelect={() => setDiscountOption("Rs")}
                      >
                        Rs.
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setDiscountOption("%")}
                      >{`%`}</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="pl-0 text-right">
                <Input
                  value={discountValue}
                  onChange={(e) => handleDiscountAmount(e)}
                  onFocus={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full rounded-sm text-right"
                  placeholder={
                    discountOption === "%" ? "Enter %" : "Enter Discount"
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Discounted Amount</TableCell>
              <TableCell className="text-right">Rs. {discounted}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Button className="max-w-40 self-end" onClick={onConfirm}>
          Confirm Pay
        </Button>
        {showValidationToast && (
          <ToastMessage
            toastId="bill-payment"
            status="error"
            message="Please enter full name and phone number"
          />
        )}
      </div>
    </div>
  )
}
