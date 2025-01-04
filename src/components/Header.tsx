"use client";

import React from "react";
import Image from "next/image";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useWallet } from "./providers/WalletProvider";

function Header() {
  const { address, isConnected, connect, disconnect } = useWallet();

  // const userNavigation = [{ name: "Sign out", href: "#", onClick: () => disconnect() }];
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

          {/* Connect Wallet */}
          <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
            {!isConnected ? (
              <button
                onClick={connect}
                className="ml-2 inline-flex items-center rounded-md bg-indigo-600 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer"
              >
                Connect Wallet
              </button>
            ) : (
              <div>
                <span className="text-white">{`${address.slice(0, 4)}...${address.slice(-4)}`}</span>
                <button
                  onClick={disconnect}
                  className="ml-4 text-red-500 hover:text-red-600"
                >
                  Disconnect
                </button>
              </div>
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
            <PopoverButton
              key={link.name}
              as={Link}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300"
            >
              {link.name}
            </PopoverButton>
          ))}
          <div className="px-3 py-2">
            {!isConnected ? (
              <button
                onClick={connect}
                className="inline-flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer"
              >
                Connect Wallet
              </button>
            ) : (
              <div>
                <span className="text-white">{`${address.slice(0, 4)}...${address.slice(-4)}`}</span>
                <button
                  onClick={disconnect}
                  className="ml-4 text-red-500 hover:text-red-600"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default Header;
