import React, { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { RiDownload2Line, RiUpload2Line, RiSwapLine } from "@remixicon/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ActionButton } from "../buttons/action-button"

interface ChartDataPoint {
  date: string
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

interface QRCodeModalProps {
  onClose: () => void
  address: string
}

const CHART_DATA: ChartDataPoint[] = [
  { date: "Jan", value: 1200 },
  { date: "Feb", value: 1400 },
  { date: "Mar", value: 1300 },
  { date: "Apr", value: 1800 },
  { date: "May", value: 1600 },
  { date: "Jun", value: 2000 },
  { date: "Jul", value: 2200 },
]

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg bg-orange-50 px-2 py-1 shadow-lg">
      <p className="text-sm font-medium text-gray-600">
        {label}: ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

const BalanceChart: React.FC = () => {
  return (
    <div className="h-32 w-full pt-2 md:h-56 lg:h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={CHART_DATA}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#FFFFFF", fontSize: 12, opacity: 0.8 }}
            dy={10}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FFFFFF"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#FFFFFF" }}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ onClose, address }) => {
  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-orange-50 p-4 shadow-lg md:p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-orange-500 hover:text-orange-600 md:top-4 md:right-4"
          aria-label="Close modal"
        >
          ×
        </button>
        <div className="text-center">
          <h3 className="mb-4 text-base font-semibold text-gray-900 md:text-lg">
            Scan to Send Funds
          </h3>
          <div className="mx-auto mb-4 h-48 w-48 overflow-hidden rounded-xl bg-white p-4 shadow-inner md:h-64 md:w-64">
            <img
              src="/api/placeholder/256/256"
              alt="QR Code for wallet address"
              className="h-full w-full rounded-lg"
            />
          </div>
          <p className="text-xs break-all text-gray-600 md:text-sm">
            {address}
          </p>
        </div>
      </div>
    </div>
  )
}

const NetworkStatus: React.FC = () => (
  <Alert className="mt-4 bg-white md:mt-6">
    <AlertDescription className="flex items-center justify-between text-xs md:text-sm">
      <span className="text-gray-700">Network: Ethereum Mainnet</span>
      <span className="flex items-center gap-2 text-gray-700">
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
        Connected
      </span>
    </AlertDescription>
  </Alert>
)

const WalletComponent: React.FC = () => {
  const [showQR, setShowQR] = useState<boolean>(false)
  const walletAddress = "0x1234...5678"

  const handleReceiveClick = () => setShowQR(true)
  const handleSendClick = () => {
    console.log("Send clicked")
  }
  const handleSwapClick = () => {
    console.log("Swap clicked")
  }

  return (
    <div className="w-full bg-orange-50">
      <div className="mx-auto max-w-lg px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center justify-center">
          <div className="h-1 w-10 rounded-full bg-orange-200" />
        </div>
        <div className="my-3 flex items-center justify-between sm:my-4">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Portfolio
          </h2>
        </div>

        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 text-white shadow-xl sm:mb-8 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <div className="mb-2 text-xs font-medium text-orange-100 sm:text-sm">
              Total Balance
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight sm:text-4xl">
                $1,234.56
              </span>
              <span className="text-base text-orange-200 sm:text-lg">USDC</span>
            </div>
            <BalanceChart />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
          <ActionButton
            icon={<RiDownload2Line className="h-5 w-5 sm:h-6 sm:w-6" />}
            label="Receive"
            onClick={handleReceiveClick}
          />
          <ActionButton
            icon={<RiUpload2Line className="h-5 w-5 sm:h-6 sm:w-6" />}
            label="Send"
            onClick={handleSendClick}
          />
          <ActionButton
            icon={<RiSwapLine className="h-5 w-5 sm:h-6 sm:w-6" />}
            label="Swap"
            onClick={handleSwapClick}
          />
        </div>

        {showQR && (
          <QRCodeModal
            onClose={() => setShowQR(false)}
            address={walletAddress}
          />
        )}

        <NetworkStatus />
      </div>
    </div>
  )
}

export default WalletComponent
