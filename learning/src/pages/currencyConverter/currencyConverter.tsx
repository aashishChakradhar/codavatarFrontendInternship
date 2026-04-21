import { useState } from "react";

import ConverterClassComponent from "../../components/currencyConverter/currencyConverter.container";
import usePrompt from "../prompt";
import DisplayPortals from "../../components/portals/portals.component";

export default function Converter() {
  const [isDirty, setIsDirty] = useState<boolean>(true);

  return (
    <>
      <DisplayPortals
        title={"converter page"}
        content={"exiting converter page"}
      />
      <ConverterClassComponent />
    </>
  );
}
