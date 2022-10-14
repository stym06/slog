import { useEffect, useState } from 'react';
import {APP_NAME} from '../config'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from 'reactstrap';
import Link from 'next/link';
import { isAuth, signout } from '../actions/auth';
import Router from 'next/router';


const Header = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [auth, setAuth] = useState("false");
    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
      setAuth(isAuth())
    }, [])

    return (
        <div>
          <Navbar expand="md">
            <NavbarBrand href="/">{APP_NAME}</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ms-auto" navbar>
                {!auth && (
                    <>
                    <NavItem >
                        <Link href="/signin">
                            <NavLink>Sign in</NavLink>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link href="/signup">
                            <NavLink>Sign up</NavLink>
                        </Link>
                    </NavItem>
                    </>
                )}


                {auth && auth.role === 1 && (
                  <NavItem>
                    <NavLink onClick={() => Router.replace(`/admin`)}>Admin Dashboard</NavLink>
                </NavItem>
                )}

                {auth && auth.role !== 1 && (
                  <NavItem>
                    <NavLink onClick={() => Router.replace(`/user`)}>{auth.name}'s Dashboard</NavLink>
                </NavItem>
                )}

                {auth && (
                <NavItem>
                    <NavLink onClick={() => signout(() => Router.replace(`/signin`))}>Sign out</NavLink>
                </NavItem>)}
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
}

export default Header;