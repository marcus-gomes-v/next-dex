"use client";

import React from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useWallet } from "./providers/WalletProvider";

function Header() {
  const { address, isConnected, connect, disconnect } = useWallet();

  const userNavigation = [
    { name: "Sign out", href: "#", onClick: () => disconnect() },
  ];

  const links = [
    { name: "Swap", href: "/" },
    { name: "Tokens", href: "/tokens" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  return (
    <Popover as="header" className="shadow-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-5">
        <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
          {/* Logo */}
          <div className="flex items-center lg:static xl:col-span-2">
            <Image src="/images/nuffle-logo.png" alt="Logo" width={50} height={50} />
          </div>

          {/* Navigation for Desktop */}
          <div className="hidden lg:flex lg:items-center lg:justify-center xl:col-span-6">
            <div className="flex space-x-4">
              {links.map((link, i) => (
                <Link key={i} href={link.href} className="link">
                  <p>{link.name}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* User and Connect Wallet */}
          <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
            <button type="button" className="flex gap-2">
              <Image src={'eth.svg'} alt="eth" width={24} height={24} />
              Ethereum
            </button>

            {!isConnected ? (
              <div
                className="ml-2 inline-flex items-center rounded-md bg-indigo-600 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer"
                onClick={connect}
              >
                Connect Wallet
              </div>
            ) : (
              <Menu as="div" className="relative ml-5 shrink-0">
                <MenuButton className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer">
                  {`${address.slice(0, 4)}...${address.slice(-4)}`}
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#243056] py-1 shadow-lg ring-1 ring-black/5">
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {() =>
                        item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className="block w-full text-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-100"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a href={item.href} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-100">
                            {item.name}
                          </a>
                        )
                      }
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex items-center lg:hidden">
            <PopoverButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </PopoverButton>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <PopoverPanel className="lg:hidden bg-[#243056] shadow-md">
        <div className="px-4 py-3 space-y-1">
          {links.map((link) => (
            <Popover.Button key={link.name} as={Link} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300">
              {link.name}
            </Popover.Button>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default Header;
