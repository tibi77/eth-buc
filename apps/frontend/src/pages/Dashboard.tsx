import { useAgentStartTrading } from "@/__generated__/endpoints/agent.gen";
import { Button } from "@/components/ui/button";
import React from "react";

export const Dashboard = () => {
  const startAgent = useAgentStartTrading();
  const [data, setData] = React.useState<{
    pair: string;
    iterations: number;
  }>({
    pair: "BTC/USD",
    iterations: 10,
  });
  const pairs = [
    "BTC/USD",
    "ETH/USD",
    "LTC/USD",
    "XRP/USD",
    "ADA/USD",
    "SOL/USD",
    "DOT/USD",
    "LINK/USD",
    "DOGE/USD",
    "MATIC/USD",
    "AVAX/USD",
    "TRX/USD",
    "SHIB/USD",
    "LTC/USD",
    "BCH/USD",
    "XLM/USD",
    "ETC/USD",
  ];
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img alt="logo" src="/logo.png" className="w-32 h-32 mb-4" />
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <p className="text-lg mb-4">Welcome to the Agent Dashboard!</p>

      {/* select pair and iterations */}
      <div className="mb-4">
        <label className="block mb-2">Select Trading Pair:</label>
        <select
          className="border border-gray-300 rounded p-2"
          value={data.pair}
          onChange={(e) => setData({ ...data, pair: e.target.value })}
        >
          {pairs.map((pair) => (
            <option key={pair} value={pair}>
              {pair}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select Iterations:</label>
        <input
          value={data.iterations}
          onChange={(e) =>
            setData({ ...data, iterations: parseInt(e.target.value) })
          }
          type="number"
          className="border border-gray-300 rounded p-2"
          placeholder="Enter number of iterations"
        />
      </div>

      <Button
        onClick={() =>
          startAgent.mutateAsync({
            data,
          })
        }
      >
        Start Agent
      </Button>
    </div>
  );
};
