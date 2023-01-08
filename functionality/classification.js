import React from "react";

const classification =  function(creditType) {
  if (
    creditType === "Energy Efficiency - Domestic" ||
    creditType === "Energy Efficiency - Industrial" ||
    creditType === "Energy Efficiency - Public Sector" ||
    creditType === "Energy Efficiency Transport Sector" ||
    creditType === "Energy Efficiency Agriculture Sector" ||
    creditType === "Energy Efficiency Commercial Sector"
  ) {
    return true
  } else {
    return false
  }

}

export default classification;
