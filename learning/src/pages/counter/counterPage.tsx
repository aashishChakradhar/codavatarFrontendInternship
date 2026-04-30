import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@/state/store";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
} from "@/state/counter/counterSlice";
import ErrorBoundary from "@/components/errorBoundry/errorBoundry";
import { Button } from "@/components/ui/button";

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="">
      <p>Counter</p>
      <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      {count}
      <Button onClick={() => dispatch(incrementAsync(10))}>Increment</Button>
    </div>
  );
}

export default function CounterPage() {
  return (
    <ErrorBoundary>
      <Counter />
    </ErrorBoundary>
  );
}
