import './index.css';
import React, { useContext, useEffect, useState } from 'react';
import Form from './components/form';
import TransactionPanel from './components/transaction-panel';
import Display from './components/display';
import Snackbar from '@/core/components/snackbar';
import Results from './components/results';
import { SessionContext } from '@/core/providers/session.provider';
import Navbar from './components/navbar';
import { WallStreetGameContext } from '@/core/providers/games/wall-street-game.provider';
import { Trending } from './components/transaction-panel/enums/trending.enum';
import Footer from '@/core/components/footer';

export enum ResultColor {
  RED = 'red',
  BLACK = 'black',
  WHITE = 'white',
}

function HomePage() {
  const { setLoading } = useContext<any>(SessionContext);
  const { iframeRef, balance, executeAction } = useContext<any>(WallStreetGameContext);

  useEffect(() => {
    setLoading(false);
  }, [iframeRef]);



  return (
    <div className="flex flex-col min-h-screen wall-street-game dark:bg-slate-100">
      {/* Navbar */}
      <div className="z-50">
        <Navbar game="wall-street" executeAction={executeAction} balance={balance} />
      </div>

      {/* Main Content Section */}
      <section className="flex w-full max-w-auto mx-auto relative min-h-[550px]">
        <div className="flex w-full md:w-[5%] lg:w-[95%] 2xl:w-[95%] relative order-1">

          {/* Grid */}

          <div className="h-full w-1/4 flex pr-0.5 pl-0 absolute top-0 left-0 z-10">
            <div className="h-full grid flex-1 grid-rows-3 gap-4 pb-1 pt-1 bg-opacity-10 bg-gray-900">

              <div className="row-span-3 md:row-span-1 h-1/3">
                <TransactionPanel trending={Trending.UP} />
              </div>
              <div className="row-span-3 md:row-span-1 h-1/3">
                <TransactionPanel trending={Trending.IDLE} />
              </div>
              <div className="row-span-3 md:row-span-1 h-1/3">
                <TransactionPanel trending={Trending.DOWN} />
              </div>

            </div>
          </div>

          {/* Div Principal */}
          <div className="w-full h-full pl-0 relative z-0">
            <div className="w-full h-full min-h-[400px] order-3 sm:order-1 relative z-0">
              <iframe
                ref={iframeRef}
                src="/wall-street/index.html"
                className="overflow-hidden w-full h-full pointer-events-none min-h-[300px] sm:min-h-[350px] lg:min-h-[450px]"
              ></iframe>
              <Display />
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden md:block md:w-[25%] lg:w-[15%] 2xl:w-[10%] p-3 order-2">
          <Form position="center" />
        </div>
      </section>

      <div
        className="p-3 order-1 sm:order-3 md:border-r border-slate-700"
        style={{ zIndex: 1 }}
      >
        <Results />
      </div>
      <div className="my-1">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
