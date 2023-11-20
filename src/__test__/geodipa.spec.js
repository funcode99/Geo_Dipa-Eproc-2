import renderer from "react-test-renderer";
// disaat seperti ini yang error malah react-syntax-highlighter nya
import FormParameter from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/FormParameter";

it("test", () => {
  const component = renderer.create(<FormParameter />);
  //   selama test nya gak lolos, gak bisa lanjut baris dibawah nya
  //   console.log("isi component", component);
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
});
