import React from "react";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { NavLink } from "react-router-dom";

const newProductButton = () => {
  return (
    <div>
      <NavLink to="/createnewproduct" variant="body2">
        {
          <div claseName="create new product">
            <IconButton color="white">
              <AddIcon />
            </IconButton>
          </div>
        }
      </NavLink>
    </div>
  );
};
export default newProductButton;
