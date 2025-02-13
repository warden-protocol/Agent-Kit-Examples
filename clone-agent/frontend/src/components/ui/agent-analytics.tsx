import {
  RiRobot2Fill,
  RiDiscordFill,
  RiTelegramFill,
  RiRocket2Fill,
} from "@remixicon/react"
import { Divider } from "../divider"
import { StickerCard } from "./sticker-card"

export function AgentAnalytics() {
  return (
    <section
      aria-labelledby="agent-analytics"
      className="relative mx-auto w-full max-w-6xl overflow-hidden"
    >
      <div>
        <h2
          id="agent-analytics"
          className="relative scroll-my-24 text-lg font-semibold tracking-tight text-orange-500"
        >
          AI Trading Agents
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 max-w-lg text-3xl font-semibold tracking-tighter text-gray-900 md:text-4xl">
          Deploy AI-powered trading bots seamlessly across platforms
        </p>
      </div>
      <Divider className="mt-0" />
      <div className="grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-4 md:grid-rows-1">
        <StickerCard
          Icon={RiDiscordFill}
          title="Social Integration"
          description="Instantly integrate agents into Discord and Telegram channels."
        />
        <StickerCard
          Icon={RiTelegramFill}
          title="Gaia AI-Powered"
          description="Customize trading agents with Gaia&apos;s knowledge base and AI models."
        />
        <StickerCard
          Icon={RiRocket2Fill}
          title="Eigenlayer Verified"
          description="Secure and validate agents with Eigenlayer."
        />
        <StickerCard
          Icon={RiRobot2Fill}
          title="Prebuilt Templates"
          description="Use ready-made templates and customize as needed."
        />
      </div>
    </section>
  )
}
