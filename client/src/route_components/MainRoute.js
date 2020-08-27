import React, { useState } from "react";
import * as resource from "../test_data/schema.json";
import searchService from "../services/searchService";
import Dashboard from "../components/Dashboard";
import PrimarySearchAppBar from "../components/navBar";

const MainRoute = () => {
  const [data /*setData*/] = useState(resource.default);
  const [filteredData, setFilteredData] = useState(data);
  // lot = 0; sku = 1; mat = 2
  const [view, setView] = useState(1);

  const filterData = (searchString) => {
    setFilteredData(searchService(data, searchString));
  };

  const toggleView = (view) => {
    setView(view);
  };

  return (
    <>
      <PrimarySearchAppBar
        onSearch={(s) => filterData(s)}
        onSet={(v) => toggleView(v)}
        view={view}
      />
      <Dashboard data={filteredData} view={view} />
    </>
  );
};

export default MainRoute;
