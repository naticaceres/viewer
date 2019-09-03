import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import Header from "./components/header/header";
import DxfViewer from "./components/dxfViewer/dxfViewer";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <div id="container" />
      <DxfViewer />
    </div>
  );
};

export default App;
