"use client";

import React from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useWallet } from "./providers/WalletProvider";
import { NETWORKS } from '@/config/networkConfig';
import { message } from 'antd';
import { useNetwork } from "./providers/NetworkProvider";

function Header() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const { selectedNetwork, setSelectedNetwork } = useNetwork(); // Use context instead of local state
  const [messageApi, contextHolder] = message.useMessage();
  
  const userNavigation = [
    { name: "Sign out", href: "#", onClick: () => disconnect() },
  ];

  const links = [
    { name: "Swap", href: "/" },
    { name: "Tokens", href: "/tokens" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  const switchNetwork = async (network: typeof NETWORKS.MAINNET) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
      setSelectedNetwork(network); // This will now update the global network state
    } catch (error: unknown) {
      // if (error.code === 4902) {
      //   try {
      //     await window.ethereum.request({
      //       method: 'wallet_addEthereumChain',
      //       params: [
      //         {
      //           chainId: network.chainId,
      //           rpcUrls: [network.rpcUrl],
      //           chainName: network.name,
      //           nativeCurrency: {
      //             name: "Ethereum",
      //             symbol: "ETH",
      //             decimals: 18
      //           },
      //           blockExplorerUrls: [network.explorerUrl]
      //         },
      //       ],
      //     });
      //     setSelectedNetwork(network); // Update global network state
      //   } catch (addError) {
      //     console.error('Error adding network:', addError);
      //     messageApi.error('Failed to add network');
      //   }
      // } else {
        console.error('Error switching network:', error);
        messageApi.error('Failed to switch network');
      // }
    }
  };

  return (
    <Popover as="header" className="shadow-sm">
      {contextHolder}
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
                <Link key={i} href={link.href} className="link hover:text-orange-500 transition-colors duration-200">
                  <p>{link.name}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* User and Connect Wallet */}
          <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
            {/* Network Selection Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <Image src={selectedNetwork.icon} alt={selectedNetwork.name} width={24} height={24} />
                <span>{selectedNetwork.name}</span>
                <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-orange-800 py-1 shadow-lg ring-1 ring-black/5">
                {Object.values(NETWORKS).map((network) => (
                  <MenuItem key={network.chainId}>
                    {({focus}) => (
                      <button
                        onClick={() => switchNetwork(network)}
                        className={`${
                          focus ? 'bg-gray-100 text-gray-800' : 'text-gray-300'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Image src={network.icon} alt={network.name} width={20} height={20} className="mr-2" />
                        {network.name}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            {/* Connect/Disconnect Wallet */}
            {!isConnected ? (
              <div
                className="ml-2 inline-flex items-center rounded-md bg-orange-600 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 cursor-pointer"
                onClick={connect}
              >
                Connect Wallet
              </div>
            ) : (
              <Menu as="div" className="relative ml-5 shrink-0">
                <MenuButton className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 cursor-pointer">
                  {`${address.slice(0, 4)}...${address.slice(-4)}`}
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-orange-800 py-1 shadow-lg ring-1 ring-black/5">
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {() =>
                        item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className="block w-full text-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 hover:text-gray-800"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a href={item.href} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 hover:text-gray-800">
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
            <PopoverButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </PopoverButton>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <PopoverPanel className="lg:hidden bg-orange-800 shadow-md">
        <div className="px-4 py-3 space-y-1">
          {/* Network Selection for Mobile */}
          <Menu as="div" className="relative w-full mb-2">
            <MenuButton className="w-full flex items-center justify-center gap-2 rounded-md bg-orange-700 px-3 py-2 text-sm font-semibold text-white">
              <Image src={selectedNetwork.icon} alt={selectedNetwork.name} width={20} height={20} />
              <span>{selectedNetwork.name}</span>
              <FontAwesomeIcon icon={faAngleDown} />
            </MenuButton>
            <MenuItems className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-orange-800 py-1 shadow-lg ring-1 ring-black/5">
              {Object.values(NETWORKS).map((network) => (
                <MenuItem key={network.chainId}>
                  {({ active }) => (
                    <button
                      onClick={() => switchNetwork(network)}
                      className={`${
                        active ? 'bg-gray-100 text-gray-800' : 'text-gray-300'
                      } flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <Image src={network.icon} alt={network.name} width={20} height={20} className="mr-2" />
                      {network.name}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          {links.map((link) => (
            <Popover.Button
              key={link.name}
              as={Link}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300"
            >
              {link.name}
            </Popover.Button>
          ))}
          <div className="px-3 py-2">
            {!isConnected ? (
              <div
                className="inline-flex w-full justify-center items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 cursor-pointer"
                onClick={connect}
              >
                Connect Wallet
              </div>
            ) : (
              <Menu as="div" className="relative w-full">
                <MenuButton className="w-full text-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 cursor-pointer">
                  {`${address.slice(0, 4)}...${address.slice(-4)}`}
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-orange-800 py-1 shadow-lg ring-1 ring-black/5">
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {() =>
                        item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 hover:text-gray-800"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a href={item.href} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 hover:text-gray-800">
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
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default Header;