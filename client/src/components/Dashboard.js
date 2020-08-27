import React from "react";
import LotCard from "./cards/LotCard";
import SkuCard from "./cards/SkuCard";
import MatCard from "./cards/MatCard";
import "../styles/Dashboard.css";

const Dashboard = (props) => {
  const renderCards = () => {
    if (props.view === 1) {
      return props.data.skus.map((sku, i) => {
        return (
          <div className="grid-item-container" key={i}>
            <SkuCard sku={sku} />
          </div>
        );
      });
    } else if (props.view === 0) {
      return props.data.lots.map((lot, i) => {
        return (
          <div className="grid-item-container" key={i}>
            <LotCard lot={lot} />
          </div>
        );
      });
    } else {
      return props.data.mats.map((mat, i) => {
        return (
          <div className="grid-item-container" key={i}>
            <MatCard mat={mat} />
          </div>
        );
      });
    }
  };
  return (
    <>
      <div className="card-grid">{renderCards()}</div>
    </>
  );
};

export default Dashboard;
