import React, { Component } from "react"




  const newProductPage = () => {
    return(
      <form className="new-product-form">
        <h1>
          <span className="font-weight-bold">Create New Product</span>
        </h1>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Product type
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </div>
        <button className="btn-lg btn-dark btn-block">Create Product</button>
      </form>
    );
  }
export default newProductPage