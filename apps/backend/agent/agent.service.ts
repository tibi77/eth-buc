/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { z } from "zod";
import fs from "fs";

import {
    AgentKit,
    CdpWalletProvider,
    wethActionProvider,
    walletActionProvider,
    erc20ActionProvider,
    cdpApiActionProvider,
    cdpWalletActionProvider,
    pythActionProvider,
} from "@coinbase/agentkit";
import { StructuredTool } from '@langchain/core/tools';
import axios from 'axios';
dotenv.config();

class MarketInfoTool extends StructuredTool {
    description = "Get market information for a specific trading pair (e.g., BTC-USD).";
    name = "marketInfo";
    schema = z.object({
        pair: z.string().describe("The trading pair (e.g., BTC-USD)"),
    });

    async _call(args: { pair: string }): Promise<string> {
        console.log(process.env.TM_API_KEY);
        // call TM to get the market information
        // this is going to get the market information only about the thing that the user is asking about
        try {
            console.log("-------------------------------");
            console.log("Fetching market info for pair:", args.pair);
            const { pair } = args;
            const data = await axios.post('https://api.tokenmetrics.com/v2/tmai', {
                "messages": [
                    {
                        "user": `Please provide all the market information about the pair ${pair}. 
                                    Tell me the price, the market cap, the volume, the circulating supply, and the total supply.
                                Also, tell me if the price is going up or down. If you don't know, say you don't know.
                            `,
                    }
                ]
            }, {
                headers: {
                    'accept': 'application/json',
                    'api_key': process.env.TM_API_KEY,
                    'content-type': 'application/json',
                },
            })
            return data.data;
        } catch (error) {
            console.error('Error fetching market info:', error);
            throw new Error(`Failed to get market info for ${args.pair}`);
        }
    }
}

@Injectable()
export class AgentService {


    /**
     * Validates that required environment variables are set
     *
     * @throws {Error} - If required environment variables are missing
     * @returns {void}
     */
    validateEnvironment() {
        const missingVars: string[] = [];

        // Check required variables
        const requiredVars = [
            "OPENAI_API_KEY",
            "CDP_API_KEY_NAME",
            "CDP_API_KEY_PRIVATE_KEY",
        ];

        requiredVars.forEach((varName) => {
            if (!process.env[varName]) {
                missingVars.push(varName);
            }
        });

        // Exit if any required variables are missing
        if (missingVars.length > 0) {
            console.error("Error: Required environment variables are not set");
            missingVars.forEach((varName) => {
                console.error(`${varName}=your_${varName.toLowerCase()}_here`);
            });
            process.exit(1);
        }

        // Warn about optional NETWORK_ID
        if (!process.env.NETWORK_ID) {
            console.warn(
                "Warning: NETWORK_ID not set, defaulting to base-sepolia testnet"
            );
        }
    }

    // 
    // 

    // Add this right after imports and before any other code

    // Configure a file to persist the agent's CDP MPC Wallet Data

    /**
     * Initialize the agent with CDP Agentkit
    *
    * @returns Agent executor and config
    */
    async initializeAgent(pair: string) {
        this.validateEnvironment();
        const WALLET_DATA_FILE = "wallet_data.txt";
        try {
            // Initialize LLM
            const llm = new ChatOpenAI({
                model: "gpt-4o-mini",
            });

            let walletDataStr: string | null = null;

            // Read existing wallet data if available
            if (fs.existsSync(WALLET_DATA_FILE)) {
                try {
                    walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
                } catch (error) {
                    console.error("Error reading wallet data:", error);
                    // Continue without wallet data
                }
            }

            // Configure CDP Wallet Provider
            const config = {
                apiKeyName: process.env.CDP_API_KEY_NAME,
                apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
                    /\\n/g,
                    "\n"
                ),
                cdpWalletData: walletDataStr || undefined,
                networkId: process.env.NETWORK_ID || "base-sepolia",
            };

            const walletProvider = await CdpWalletProvider.configureWithWallet(config);

            // Initialize AgentKit
            const agentkit = await AgentKit.from({
                walletProvider,
                actionProviders: [
                    wethActionProvider(),
                    pythActionProvider(),
                    walletActionProvider(),
                    erc20ActionProvider(),
                    cdpApiActionProvider({
                        apiKeyName: process.env.CDP_API_KEY_NAME,
                        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
                            /\\n/g,
                            "\n"
                        ),
                    }),
                    cdpWalletActionProvider({
                        apiKeyName: process.env.CDP_API_KEY_NAME,
                        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
                            /\\n/g,
                            "\n"
                        ),
                    }),
                ],
            });

            const tools = await getLangChainTools(agentkit);

            // Store buffered conversation history in memory
            const memory = new MemorySaver();
            const agentConfig = {
                configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
            };

            // ADD tm in here to provide more info about a topic

            // Create React Agent using the LLM and CDP AgentKit tools
            const agent = createReactAgent({
                llm,
                tools: [
                    ...tools,
                    new MarketInfoTool(),
                ],
                checkpointSaver: memory,
                messageModifier: `
                    You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
                    empowered to interact onchain using your tools. If not, you can provide your wallet details and request 
                    funds from the user. Before executing your first action, get the wallet details to see what network 
                    you're on. Your need to obtain the most money possible by executing a series of trades.
                    Your moves should be based on this trading pair ${pair}.
                    Your job is to swap between the provided tokens and make a profit. You can use the tools provided to you to do this.
                `,
            });

            // Act as an experienced day trader. Based on your comprehensive analysis of current market conditions, historical data, and emerging trends, decide on optimal entry, stop-loss, and target points for a specified trading asset. Begin by thoroughly reviewing recent price action, key technical indicators, and relevant news that might influence the asset's direction.

            // Save wallet data
            const exportedWallet = await walletProvider.exportWallet();
            fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

            return { agent, config: agentConfig };
        } catch (error) {
            console.error("Failed to initialize agent:", error);
            throw error; // Re-throw to be handled by caller
        }
    }

    /**
     * Run the agent autonomously with specified intervals
     *
     * @param agent - The agent executor
     * @param config - Agent configuration
     * @param interval - Time interval between actions in seconds
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async runAutonomousMode(agent, config, iterations, pair, interval = 10) {
        console.log("Starting autonomous mode...");

        // eslint-disable-next-line no-constant-condition
        while (iterations > 0) {
            iterations--;
            try {
                const thought =
                    "Be creative and make a decision based on the current market conditions. ";

                const stream = await agent.stream(
                    { messages: [new HumanMessage(thought)] },
                    config
                );

                for await (const chunk of stream) {
                    if ("agent" in chunk) {
                        console.log(chunk.agent.messages[0].content);
                    } else if ("tools" in chunk) {
                        console.log(chunk.tools.messages[0].content);
                    }
                    console.log("-------------------");
                }

                await new Promise((resolve) => setTimeout(resolve, interval * 1000));
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error:", error.message);
                }
                process.exit(1);
            }
        }
    }

    /**
     * Start the chatbot agent
     */
    async main(
        iterations = 10,
        pair = "BTC-USD" // Default trading pair
    ) {
        try {
            const { agent, config } = await this.initializeAgent(pair);
            await this.runAutonomousMode(agent, config, iterations, pair);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            }
            process.exit(1);
        }
    }
    async startTrading(iterations: number, pair: string) {
        console.log("Starting Agent...");
        this.main(
            iterations ?? 10, // Default iterations
            pair ? pair : "BTC-USD"
        ).catch((error) => {
            console.error("Fatal error:", error);
            process.exit(1);
        });

    }
}
