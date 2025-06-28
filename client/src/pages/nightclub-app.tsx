import React, { useState } from "react"
import WelcomeScreen from "@/components/nightclub/welcome-screen"
import AuthScreen from "@/components/nightclub/auth-screen"
import RoleSelect from "@/components/nightclub/role-select"
import ShiftDashboard from "@/components/nightclub/shift-dashboard"
import GuestsScreen from "@/components/nightclub/guests"
import BookingCard from "@/components/nightclub/booking-card"
import PaymentScreen from "@/components/nightclub/payment"
import TicketFlow from "@/components/nightclub/ticket-flow"

export default function NightclubApp() {
  const [screen, setScreen] = useState("welcome")

  const renderScreen = () => {
    switch (screen) {
      case "welcome":
        return <WelcomeScreen onNext={() => setScreen("auth")} />
      case "auth":
        return <AuthScreen onNext={() => setScreen("role-select")} />
      case "role-select":
        return <RoleSelect onSelectRole={() => setScreen("shift-dashboard")} />
      case "shift-dashboard":
        return <ShiftDashboard onGuestsClick={() => setScreen("guests")} />
      case "guests":
        return <GuestsScreen onBookingClick={() => setScreen("booking")} />
      case "booking":
        return <BookingCard onPayClick={() => setScreen("payment")} />
      case "payment":
        return <PaymentScreen onFinish={() => setScreen("ticket-flow")} />
      case "ticket-flow":
        return <TicketFlow onRestart={() => setScreen("welcome")} />
      default:
        return <div>Unknown screen</div>
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {renderScreen()}
    </div>
  )
}
