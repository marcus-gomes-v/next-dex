/* eslint-disable @typescript-eslint/no-explicit-any */
import '@ant-design/v5-patch-for-react-19';
import { Popover, Radio, Modal, message, RadioChangeEvent } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faCog, faSort } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image';
import TradingViewWidget from './TradeInView';
import { ethers } from 'ethers';
import { useNetwork } from './providers/NetworkProvider';
import { NETWORKS } from '@/config/networkConfig';



function Swap(props: { address: string; isConnected: boolean; }) {
  const { address, isConnected } = props;
  const { selectedNetwork, currentTokenList, setCurrentTokenList } = useNetwork();
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState<number>(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState<string | null>(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState<string | null>(null);
  const [tokenOne, setTokenOne] = useState(currentTokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(currentTokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState<{ ratio: number } | null>(null);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [txnStatus, setTxnStatus] = useState<'none' | 'approval_pending' | 'approval_submitted' | 'swap_pending' | 'swap_submitted'>('none');

  function handleSlippageChange(e: RadioChangeEvent | number) {
    setSlippage(typeof e === 'number' ? e : e.target.value);
  }

  function changeAmount(e: React.ChangeEvent<HTMLInputElement>) {
    setTokenOneAmount(e.target.value);
    if(e.target.value && prices){
      setTokenTwoAmount((Number(e.target.value) * prices.ratio).toFixed(8))
    } else {
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.address, one.address);
  }

  function openModal(asset: number) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i: number){
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(currentTokenList[i]);
      fetchPrices(currentTokenList[i].address, tokenTwo.address)
    } else {
      setTokenTwo(currentTokenList[i]);
      fetchPrices(tokenOne.address, currentTokenList[i].address)
    }
    setIsOpen(false);
  }

  async function fetchPrices(one: string, two: string) {
    console.log('Fetching prices for:', selectedNetwork);
    if (!currentTokenList || !selectedNetwork) return;

    try {
      const tokenOne = currentTokenList.find(t => t.address.toLowerCase() === one.toLowerCase());
      const tokenTwo = currentTokenList.find(t => t.address.toLowerCase() === two.toLowerCase());

      if (!tokenOne || !tokenTwo) {
        messageApi.error('Selected tokens not found in the current network.');
        return;
      }

      const addressOne = selectedNetwork.chainId === "0x1"
        ? tokenOne.address
        : tokenOne.mainnetAddress;

      const addressTwo = selectedNetwork.chainId === "0x1"
        ? tokenTwo.address
        : tokenTwo.mainnetAddress;

      const res = await axios.post('/api/coingecko/token/price', {
        chainId: 1, // Always use mainnet for prices
        addressOne,
        addressTwo,
      });

      setPrices(res.data.usdPrices);
    } catch (error) {
      console.error('Error fetching prices:', error);
      messageApi.error('Failed to fetch token prices');
    }
  }


  async function executeSwap() {
    if (!window.ethereum || !tokenOneAmount || !isConnected) return;

    setIsSwapLoading(true);
    try {
      const ROUTER_ADDRESS = selectedNetwork.routerAddress;

      // Convert amount to wei considering token decimals
      const amountIn = ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals);
      const amountOutMin = ethers.utils.parseUnits(
        (Number(tokenTwoAmount) * (1 - slippage / 100)).toFixed(tokenTwo.decimals),
        tokenTwo.decimals
      );

      // Check if we're on the correct network
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== selectedNetwork.chainId) {
        messageApi.error("Please switch to the correct network");
        return;
      }

      // Handle ETH differently
      const isTokenOneETH = tokenOne.address === "0x0000000000000000000000000000000000000000";
      const isTokenTwoETH = tokenTwo.address === "0x0000000000000000000000000000000000000000";

      // Define the swap interface and deadline
      const swapInterface = [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
      ];
      const swapIface = new ethers.utils.Interface(swapInterface);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes deadline

      // Define the path based on the scenario
      let path: string[];
      if (isTokenOneETH) {
        path = [ethers.constants.AddressZero, tokenTwo.address]; // ETH -> Token
      } else if (isTokenTwoETH) {
        path = [tokenOne.address, ethers.constants.AddressZero]; // Token -> ETH
      } else {
        path = [tokenOne.address, tokenTwo.address]; // Token -> Token
      }

      // Encode swapData using the defined path
      const swapData = swapIface.encodeFunctionData("swapExactTokensForTokens", [
        amountIn,
        amountOutMin,
        path,
        address,
        deadline,
      ]);

      let swapTx: any;

      if (isTokenOneETH) {
        // Swapping ETH to a token
        swapTx = {
          from: address,
          to: ROUTER_ADDRESS,
          data: swapData,
          value: amountIn.toHexString(), // Send ETH as value
        };
      } else if (isTokenTwoETH) {
        // Swapping a token to ETH
        swapTx = {
          from: address,
          to: ROUTER_ADDRESS,
          data: swapData,
          value: "0x0", // No ETH value sent
        };
      } else {
        // Token-to-token swap
        swapTx = {
          from: address,
          to: ROUTER_ADDRESS,
          data: swapData,
          value: "0x0", // No ETH value sent
        };
      }

      const swapTxHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [swapTx],
      });

      messageApi.loading("Swap transaction submitted. Waiting for confirmation...");

      // Wait for transaction to be mined
      await new Promise((resolve) => {
        const checkReceipt = setInterval(async () => {
          const receipt = await window.ethereum.request({
            method: "eth_getTransactionReceipt",
            params: [swapTxHash],
          });
          if (receipt) {
            clearInterval(checkReceipt);
            resolve(receipt);
          }
        }, 1000);
      });

      messageApi.success("Swap completed successfully!");
    } catch (error: any) {
      console.error("Swap error:", error);
      messageApi.error(error?.message || "Failed to execute swap");
    } finally {
      setIsSwapLoading(false);
      setTxnStatus("none");
    }
  }

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isSwapLoading) {
      switch (txnStatus) {
        case 'approval_pending':
          return 'Checking Allowance...';
        case 'approval_submitted':
          return 'Confirming Approval...';
        case 'swap_pending':
          return 'Preparing Swap...';
        case 'swap_submitted':
          return 'Confirming Swap...';
        default:
          return 'Processing...';
      }
    }
    return 'Swap';
  };


  useEffect(() => {
    const tokens = NETWORKS[selectedNetwork.name]?.tokens;
    setCurrentTokenList(tokens);
  }, [selectedNetwork]);

  useEffect(() => {
    if (currentTokenList && currentTokenList.length > 1) {
      setTokenOne(currentTokenList[0]);
      setTokenTwo(currentTokenList[1]);
      fetchPrices(currentTokenList[0].address, currentTokenList[1].address);
    }
  }, [currentTokenList, selectedNetwork]);

  useEffect(() => {
    console.log('Updated selectedNetwork:', selectedNetwork);
    console.log('Updated currentTokenList:', currentTokenList);
  }, [selectedNetwork, currentTokenList]);

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="border-t-[1px] border-solid mt-[20px] flex flex-col gap-[10px]">
          {currentTokenList?.map((e, i) => {
            return (
              <div
                className="flex justify-start items-center pl-[20px] pt-[10px] pb-[10px] hover:bg-slate-500 hover:cursor-pointer"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="h-[40px] w-[40px]" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="w-[1000px] bg-gradient-to-br from-orange-600 via-orange-800 to-orange-300 border-[#21273a] border-solid border-6 min-h-[300px] rounded-md flex flex-col justify-start items-start pt-[18px] px-[30px]">
        <div className="flex justify-between items-center w-full">
          <h4 className="text-lg text-white font-extrabold">Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <FontAwesomeIcon icon={faCog} className="text-orange-300 hover:text-white transition-all cursor-pointer" />
          </Popover>
        </div>
        <div className='flex flex-col md:flex-row gap-4 w-full'>
          <div className='relative mt-2 py-2 w-full md:w-[70%]'>
            <TradingViewWidget tokenOne={tokenOne} tokenTwo={tokenTwo} />
          </div>
          <div className='w-full md:w-[30%]'>
            <div className="relative mt-6">
              <input
                placeholder="0"
                value={tokenOneAmount || ""}
                onChange={changeAmount}
                disabled={!prices}
                className="mt-2 w-full text-[24px] py-5 px-6 rounded-xl bg-orange-900 text-white outline outline-1 -outline-offset-1 outline-orange-800 placeholder:text-gray-400"
              />

              <input 
                placeholder="0"
                value={tokenTwoAmount || ""}
                disabled={true}
                className="mt-2 w-full text-[24px] py-5 px-6 rounded-xl bg-orange-900 text-white outline outline-1 -outline-offset-1 outline-orange-800 placeholder:text-gray-400"
              />
              <div 
                className="bg-gray-800 w-[25px] h-[25px] items-center justify-center flex rounded-md absolute top-[76px] left-[130px] text-orange-500 cursor-pointer hover:text-white"
                onClick={switchTokens}
              >
                <FontAwesomeIcon icon={faSort} />
              </div>
              <div 
                className="absolute min-w-[50px] h-[30px] p-2 bg-orange-800 right-[20px] top-[32px] rounded-[100px] flex items-center gap-[5px] font-bold cursor-pointer"
                onClick={() => openModal(1)}
              >
                <Image src={tokenOne.img} alt="assetOneLogo" width={22} height={22} />
                {tokenOne.ticker}
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
              <div 
                className="absolute min-w-[50px] h-[30px] p-2 bg-orange-800 right-[20px] top-[116px] rounded-[100px] flex items-center gap-[5px] font-bold cursor-pointer"
                onClick={() => openModal(2)}
              >
                <Image src={tokenTwo.img} alt="assetTwoLogo" width={22} height={22} />
                {tokenTwo.ticker}
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </div>
            <button 
              className="flex justify-center items-center bg-orange-700 w-full h-[55px] text-[20px] rounded-[12px] text-gray-200 font-bold transition duration-300 mb-[30px] mt-[8px] hover:cursor-pointer hover:bg-orange-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-orange-800 disabled:text-gray-300"
              disabled={!tokenOneAmount || !isConnected || isSwapLoading}
              onClick={executeSwap}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Swap;