/* eslint-disable @typescript-eslint/no-explicit-any */
import '@ant-design/v5-patch-for-react-19';
import { Popover, Radio, Modal, message, RadioChangeEvent } from "antd";
import tokenList from "../tokenList.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faCog, faSort } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image';
import TradingViewWidget from './TradeInView';
import SwapNotification from '@/components/SwapLoadingNotification';

function Swap(props: { address: string; isConnected: boolean; }) {
  const { address, isConnected } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState<number>(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState<string | null>(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState<string | null>(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState<{ ratio: number } | null>(null);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [txDetails, setTxDetails] = useState({
    to:null,
    data: null,
    value: null,
  }); 

  const {data, sendTransaction} = useSendTransaction({
    mode: "recklesslyUnprepared",
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    }
  })

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

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

  function openModal(asset: SetStateAction<number>) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i: number){
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].address, tokenTwo.address)
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address)
    }
    setIsOpen(false);
  }

  async function fetchPrices(one: string, two: string){
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/coingecko/token/price',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : JSON.stringify({
          chainId: 1,
          addressOne: one,
          addressTwo: two
        })
      };
      const res = await axios.request(config);
      setPrices(res.data.usdPrices);
  }

  async function fetchDexSwap() {
    setIsSwapLoading(true);
    try {
      const amount = tokenOneAmount ? tokenOneAmount : "0";
      if (!amount) {
        return;
      }

      // Clear any existing transaction details
      setTxDetails({
        to: null,
        data: null,
        value: null,
      });

      // Check allowance first
      const allowanceResponse = await axios.post('/api/1inch/allowance', {
        token: tokenOne.address,
        wallet: address
      });

      const currentAllowance = allowanceResponse.data.data.allowance;
      const requiredAmount = amount.padEnd(tokenOne.decimals + amount.length, '0');

      // Only request approval if current allowance is insufficient
      if (BigInt(currentAllowance) < BigInt(requiredAmount)) {
        messageApi.info('Requesting token approval...');
        
        // Get approval transaction
        const approveResponse = await axios.post('/api/1inch/transaction', {
          token: tokenOne.address,
          amount: requiredAmount
        });

        // Set approval transaction details
        setTxDetails(approveResponse.data.data);
        
        // Wait for approval transaction
        await new Promise((resolve, reject) => {
          const checkInterval = setInterval(() => {
            if (!txDetails.to) {
              clearInterval(checkInterval);
              resolve(true);
            }
          }, 1000);

          // Timeout after 5 minutes
          setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error('Approval timeout'));
          }, 300000);
        });

        // Clear transaction details after approval
        setTxDetails({
          to: null,
          data: null,
          value: null,
        });
      }

      messageApi.info('Preparing swap transaction...');

      // Proceed with swap
      const swapResponse = await axios.post('/api/1inch/swap', {
        fromTokenAddress: tokenOne.address,
        toTokenAddress: tokenTwo.address,
        amount: requiredAmount,
        fromAddress: address,
        slippage
      });

      const decimals = Number(`1E${tokenTwo.decimals}`);
      setTokenTwoAmount((Number(swapResponse.data.data.toTokenAmount) / decimals).toFixed(2));
      setTxDetails(swapResponse.data.data.tx);

    } catch (error) {
      console.error('Swap error:', error);
      messageApi.error('Failed to process swap');
      setTxDetails({
        to: null,
        data: null,
        value: null,
      });
    } finally {
      setIsSwapLoading(false);
    }
  }
  
  useEffect(()=>{

    fetchPrices(tokenList[0].address, tokenList[1].address)

  }, [])

  useEffect(()=>{

      if(txDetails.to && isConnected){
        sendTransaction();
      }
  }, [isConnected, sendTransaction, txDetails])

  useEffect(()=>{

    messageApi.destroy();

    if(isLoading){
      messageApi.open({
        type: 'loading',
        content: 'Transaction is Pending...',
        duration: 0,
      })
    }    

  },[isLoading])

  useEffect(() => {
    if (isLoading) {
      setIsSwapLoading(true);
    } else {
      if (!isSuccess && txDetails.to) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
      setIsSwapLoading(false);
    }
  }, [isLoading, isSuccess, txDetails.to]); 

  useEffect(()=>{
    messageApi.destroy();
    if(isSuccess){
      messageApi.open({
        type: 'success',
        content: 'Transaction Successful',
        duration: 1.5,
      })
    }else if(txDetails.to){
      messageApi.open({
        type: 'error',
        content: 'Transaction Failed',
        duration: 1.50,
      })
    }


  },[isSuccess])


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

  const classNameInput = `
    mt-2
    w-full
    text-[24px]
    py-5
    px-6
    rounded-xl
    bg-orange-900
    text-white
    outline
    outline-1
    -outline-offset-1
    outline-orange-800
    placeholder:text-gray-400
    focus:outline
    focus:outline-2
    focus:-outline-offset-2
    focus:outline-orange-300
  `

  const classNameSwitch = `
    bg-gray-800
    w-[25px]
    h-[25px]
    items-center
    justify-center
    flex
    rounded-md
    absolute
    top-[76px]
    left-[130px]
    text-orange-500
    border-gray-800
    border-solid
    border-[3px]
    font-[12px]
    transition-all
    hover:text-white
    cursor-pointer
  `

  const classNameAsset = `
    absolute
    min-w-[50px]
    h-[30px]
    p-2
    bg-orange-800
    right-[20px]
    rounded-[100px]
    flex
    justify-start
    items-center
    gap-[5px]
    font-bold
    font-[17px]
    padding-right-[8px]
    cursor-pointer
  `

  const classNameAssetOne = `
    ${classNameAsset}
    top-[32px]
  `

  const classNameAssetTwo = `
    ${classNameAsset}
    top-[116px]
  `

  const classNameAssetLogo = `
    height-[22px]
    margin-left-[5px]
  `

  const classNameSwapButton = `
    flex 
    justify-center 
    items-center 
    bg-orange-700
    w-full 
    h-[55px] 
    text-[20px] 
    rounded-[12px] 
    text-gray-200
    font-bold 
    transition 
    duration-300 
    mb-[30px] 
    mt-[8px] 
    hover:cursor-pointer 
    hover:bg-orange-600 
    hover:text-gray-800
    disabled:opacity-40 
    disabled:cursor-not-allowed 
    disabled:bg-orange-800
    disabled:text-gray-300
  `

  return (
    <>
      {contextHolder}
      <SwapNotification 
        show={isSwapLoading} 
        type="loading" 
      />
      <SwapNotification 
        show={showError} 
        type="error" 
        message="Transaction rejected by user"
      />
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="border-t-[1px] border-solid mt-[20px] flex flex-col gap-[10px]">
          {tokenList?.map((e, i) => {
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
      <div className="
        w-[1000px]
        bg-gradient-to-br from-orange-600 via-orange-800 to-orange-300
        border-[#21273a]
        border-solid
        border-6
        min-h-[300px]
        rounded-md
        flex
        flex-col
        justify-start
        items-start
        pt-[18px]
        px-[30px]
        ">
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
        <div className='flex flex-col  md:flex-row  gap-4 w-full'>
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
                className={classNameInput}
              />

              <input 
                placeholder="0"
                value={tokenTwoAmount || ""}
                disabled={true}
                className={classNameInput}
              />
              <div className={classNameSwitch} onClick={switchTokens}>
                {/* <ArrowsAltOutlined className="switchArrow" /> */}
                <FontAwesomeIcon icon={faSort} />
              </div>
              <div className={classNameAssetOne} onClick={() => openModal(1)}>
                <Image src={tokenOne.img} alt="assetOneLogo" className={classNameAssetLogo} width={22} height={22} />
                {tokenOne.ticker}
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
              <div className={classNameAssetTwo} onClick={() => openModal(2)}>
                <Image src={tokenTwo.img} alt="assetOneLogo" className={classNameAssetLogo} width={22} height={22} />
                {tokenTwo.ticker}
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </div>
            <button className={classNameSwapButton} disabled={!tokenOneAmount || !isConnected} onClick={fetchDexSwap}>Swap</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Swap;
