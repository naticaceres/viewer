import React from 'react';
import './App.scss';
import DxfViewer from './components/dxfViewer/dxfViewer';
//import SampleConfiguration from './components/sampleConfiguration';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <SampleConfiguration /> */}
      <DxfViewer />
    </div>
  );
};

export default App;
