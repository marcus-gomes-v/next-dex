import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: {
      widget: new (options: Record<string, unknown>) => void;
    };
  }
}

const TradingViewWidget = ({ tokenOne, tokenTwo }: {
  tokenOne: { ticker: string };
  tokenTwo: { ticker: string };
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(`${tokenOne.ticker}${tokenTwo.ticker}`)
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        if (container.current) {
          container.current.innerHTML = '';
        }
        new window.TradingView.widget({
          container_id: 'tv-widget',
          symbol: `${tokenOne.ticker}USD`,
          interval: '1W',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '2',
          locale: 'en',
          toolbar_bg: '#0E111B',
          enable_publishing: true,
          hide_side_toolbar: true,
          hide_legend: true,
          hidevolume: true,
          hide_top_toolbar: true,
          allow_symbol_change: true,
          backgroundColor: '#0E111B',
          studies: [],
          height: 250,
          width: '100%',
        });
      }
    };
    if (container.current) {
      container.current.appendChild(script);
    }
    
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [tokenOne.ticker]);

  return <div id="tv-widget" ref={container} className='rounded-lg overflow-hidden' />;
};

export default TradingViewWidget;