import { useAgentStartTrading } from "@/__generated__/endpoints/agent.gen";
import { Button } from "@/components/ui/button";
import React from "react";

export const Dashboard = () => {
  const startAgent = useAgentStartTrading();
  return (
    <Button onClick={() => startAgent.mutateAsync()}>Start Agent</Button>
  );
};
