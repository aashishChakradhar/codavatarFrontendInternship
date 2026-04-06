import ConverterContainer from "../../components/converter/converterContainer.component";
import ConverterPresentation from "../../components/converter/converterPresentation.component";
import ConverterClass from "../../components/currencyConverter/currencyConverter.component";

const JunkApp = () => (
  <div>
    <ConverterClass />
    <ConverterContainer
      render={(props) => <ConverterPresentation {...props} />}
    />
  </div>
);

export default JunkApp;
