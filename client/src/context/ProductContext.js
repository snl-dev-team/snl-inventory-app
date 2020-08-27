import React, { createContext, useState } from "react";

export const ProductContext = React.createContext();
const ProductContextProvider = (props) => {
  const [product, setProduct] = useState({ text: "Select a Product" });


  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {props.children}
    </ProductContext.Provider>
  );
};
export default ProductContextProvider;
