"use client";

import React from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverPanel } from "@headlessui/react";
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
          {/* Logo */}
          <div className="flex items-center lg:static xl:col-span-2">
            <Image src="/images/nuffle-logo.png" alt="Logo" width={50} height={50} />
          </div>

          {/* Navigation */}
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
            <button
              type="button"
              className="flex gap-2"
            >
              <Image src={'eth.svg'} alt="eth" width={24} height={24}/>
              Ethereum
            </button>

            {/* Profile Dropdown */}
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
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {() => (
                        item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className={`${
                               'bg-gray-100 text-gray-900'
                            } block w-full text-center px-4 py-2 text-sm`}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a
                            href={item.href}
                            className={`${
                               'bg-gray-100 text-gray-900'
                            } block px-4 py-2 text-sm`}
                          >
                            {item.name}
                          </a>
                        )
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <PopoverPanel className="lg:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              {link.name}
            </a>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default Header;