import * as React from 'react';

interface IProps {
    name?: string;
}

const Header: React.FC<IProps> = (props: IProps) => (
    // <nav class="navbar navbar-expand-lg navbar-light bg-light"></nav>
    // <p>Testi test {props.name}</p>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">Client based - DXF Viewer</nav>
);

Header.defaultProps = {
    name: 'world',
};

export default Header;