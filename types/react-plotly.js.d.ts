declare module "react-plotly.js" {
  import * as React from "react";
  import { PlotParams } from "plotly.js";

  const Plot: React.ComponentClass<PlotParams>;
  export default Plot;
}
