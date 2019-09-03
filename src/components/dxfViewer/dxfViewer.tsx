import * as React from 'react';
import FileManager from '../fileManager/fileManager';
import ViewerCanvas from '../viewerCanvas/viewerCanvas';
import Footer from '../footer';

declare global {
  interface Window {
    fileManager: any;
  }
}

export interface DxfViewerProps {}

export interface DxfViewerState {}

class DxfViewer extends React.Component<DxfViewerProps, DxfViewerState> {
  state = {
    fileParsed: {
      configuration: null,
      svg: (
        <svg width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="green"
            stroke-width="4"
            fill="yellow"
          />
        </svg>
      ),
      parsed: null,
    },
    canvasKey: 1,
    isEmbedded: false,
    configuration: {
      title: '',
      dxfString: '',
    },
    isLoaded: false,
  };

  handleFileParsed = (fileParsed: any) => {
    this.setState({ fileParsed, canvasKey: this.state.canvasKey++ });
  };

  componentDidMount() {
    const configurationElement = document.getElementById(
      'dxf-viewer-configuration',
    );
    if (!configurationElement) {
      // display 'oops something went wrong.'
      this.setState({ isEmbedded: false, isLoaded: true });
      return;
    }
    this.setState({ isEmbedded: true });

    const dxfData = configurationElement.children.namedItem(
      'dxf-viewer-configuration-data',
    );
    const dxfName = configurationElement.children.namedItem(
      'dxf-viewer-configuration-title',
    );
    if (dxfData == null) {
      // missing data - isloaded:true - display error
      return;
    }
    if (dxfName == null) {
      // missing title - isloaded:true - display error
      return;
    }

    const configuration = {
      dxfString: dxfData.textContent,
      title: dxfName.textContent,
    };

    this.setState({ configuration, isLoaded: true });
  }

  render() {
    return (
      this.state.isLoaded && (
        <div
          style={{
            height: 'inherit',
            display: 'grid',
            gridTemplateRows: '3rem auto 3rem',
          }}
        >
          <FileManager
            dxfString={this.state.configuration.dxfString}
            onFileParsed={fileParsed => this.handleFileParsed(fileParsed)}
            ref={fileManager => {
              window.fileManager = fileManager;
            }}
          />
          {this.state.configuration.dxfString && (
            <div
              style={{
                backgroundColor: '#1d5583',
                color: 'white',
                fontWeight: 600,
                paddingTop: '0.6rem',
              }}
            >
              {this.state.configuration.title}
            </div>
          )}
          <ViewerCanvas
            key={this.state.canvasKey}
            drawing={this.state.fileParsed}
          />
          <Footer />
        </div>
      )
    );
  }
}

export default DxfViewer;
