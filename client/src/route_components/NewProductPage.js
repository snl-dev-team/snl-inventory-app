import React, { useContext } from "react";
import SimpleMenu from "../components/NewProductPage/DropDownButton";
import ContainedButton from "../components/NewProductPage/CreateProduct";
import { makeStyles } from "@material-ui/core/styles";
import Forms from "../components/Forms";
import ProductContext from "../context/ProductContext";

const Styles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
const NewProductPage = (props) => {
  const classes = Styles();
  const { setProduct } = useContext(ProductContext);
  const changeProduct = (s) => {
    setProduct(s);
  };

  return (
    <div>
      <h1 className={classes.root}>
        <span>CREATE A NEW PRODUCT</span>
      </h1>
      <SimpleMenu onChoose={(s) => changeProduct(s)} />
      <div className={classes.root}></div>
      <div className={classes.root}></div>
      <div className={classes.root}></div>
      <div className={classes.root}>
        <ContainedButton />
      </div>
    </div>
  );
};

export default NewProductPage;
