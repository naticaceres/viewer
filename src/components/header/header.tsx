import * as React from 'react';

interface IProps {    
    text?: string;
}

const Header: React.FC<IProps> = (props: IProps) => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">{props.text}</nav>
);

export default Header;