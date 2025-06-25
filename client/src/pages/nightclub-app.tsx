import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import WelcomeScreen from "@/components/nightclub/welcome-screen";
import AuthScreen from "@/components/nightclub/auth-screen";
import RolesScreen from "@/components/nightclub/roles-screen";
import AdminScreen from "@/components/nightclub/admin-screen";
import CloseShiftConfirmationScreen from "@/components/nightclub/close-shift-confirmation-screen";
import EmergencyScreen from "@/components/nightclub/emergency-screen";
import ChatsScreen from "@/components/nightclub/chats-screen";
import DancerScreen from "@/components/nightclub/dancer-screen";
import HookahScreen from "@/components/nightclub/hookah-screen";
import HookahDashboardScreen from "@/components/nightclub/hookah-dashboard-screen";
import HookahShiftScreen from "@/components/nightclub/hookah-shift-screen";
import PromoterScreen from "@/components/nightclub/promoter-screen";
import PromoterShiftScreen from "@/components/nightclub/promoter-shift-screen";
import AddGuestsScreen from "@/components/nightclub/add-guests-screen";
import HomeScreen from "@/components/nightclub/home-screen";
import GuestFlow from "@/components/nightclub/guest-flow";
import PaymentScreens from "@/components/nightclub/payment-screens";
import ShiftStatisticsScreen from "@/components/nightclub/shift-statistics-screen";

export type Screen = 
  | "welcome" 
  | "auth" 
  | "roles" 
  | "admin"
  | "close-shift-confirmation"
  | "emergency"
  | "chats"
  | "dancer-screen"
  | "hookah-screen"
  | "hookah-dashboard-screen"
  | "hookah-shift-screen"
  | "promoter-screen"
  | "promoter-shift-screen"
  | "add-guests-screen"
  | "home" 
  | "shift-dashboard"
  | "shift-statistics"
  | "guest-flow-start"
  | "guest-count"
  | "reservation"
  | "visited-before"
  | "guest-name"
  | "reservation-card"
  | "came-or-not"
  | "decline-reason"
  | "payment-methods"
  | "deposit-input"
  | "deposit-type-select"
  | "ticket-select"
  | "ticket-nominals"
  | "ticket-payment-type"
  | "combo-cash"
  | "combo-card"
  | "combo-summary"
  | "success";

export interface Role {
  slug: string;
  title: string;
  icon: string;
}

export default function NightclubApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [authCode, setAuthCode] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [reservation, setReservation] = useState(false);
  const [visitedBefore, setVisitedBefore] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [shiftOpen, setShiftOpen] = useState(false);
  const [shiftClosed, setShiftClosed] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);
  
  // Shift states
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [shiftEndTime, setShiftEndTime] = useState<Date | null>(null);
  const [promoterShiftStartTime, setPromoterShiftStartTime] = useState<Date | null>(null);
  const [isPromoterShiftOpen, setIsPromoterShiftOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [amountCash, setAmountCash] = useState("");
  const [amountCard, setAmountCard] = useState("");
  const [ticketAmounts, setTicketAmounts] = useState({
    "1000": 0,
    "3000": 0,
    "FREE": 0,
    "custom": ""
  });

  const roles: Role[] = [
    { slug: "ADMIN", title: "Администратор", icon: "shield-user" },
    { slug: "DANCER", title: "Танцовщица", icon: "music" },
    { slug: "HOSTESS", title: "Хостес", icon: "concierge-bell" },
    { slug: "PROMOTER", title: "Промоутер", icon: "bullhorn" },
    { slug: "SHADOW", title: "Тень", icon: "eye" },
    { slug: "HOOKAH", title: "Кальяны", icon: "smoking" },
    { slug: "OFICIANT", title: "Официант", icon: "concierge-bell" },
    { slug: "TRAINEE", title: "Стажер", icon: "eye" },
    { slug: "PARTY", title: "Party", icon: "glass-cheers" },
    { slug: "OTHER", title: "Другое", icon: "ellipsis-h" }
  ];

  const canGoBack = !["welcome", "auth", "roles", "admin"].includes(screen) && shiftOpen && !shiftClosed;

  const handleBack = () => {
    if (["came-or-not", "payment-methods", "deposit-input", "deposit-type-select", "ticket-select", "ticket-nominals", "ticket-payment-type", "combo-cash", "combo-card", "combo-summary"].includes(screen)) {
      setScreen("guest-flow-start");
    } else if (screen === "reservation") {
      setScreen("guest-count");
    } else if (screen === "visited-before") {
      setScreen("reservation");
    } else if (screen === "guest-name") {
      setScreen("visited-before");
    } else if (screen === "reservation-card") {
      setScreen("guest-name");
    } else if (screen === "guest-count") {
      setScreen("guest-flow-start");
    } else if (screen === "shift-dashboard") {
      setScreen("home");
    } else {
      setScreen("home");
    }
  };

  const resetGuestFlow = () => {
    setGuestCount(1);
    setReservation(false);
    setVisitedBefore(false);
    setGuestName("");
    setSearchResults([]);
    setDeclineReason("");
    setSelectedPaymentMethods([]);
    setDepositAmount("");
    setPaymentType("");
    setAmountCash("");
    setAmountCard("");
    setTicketAmounts({
      "1000": 0,
      "3000": 0,
      "FREE": 0,
      "custom": ""
    });
  };

  const handleOpenShift = () => {
    const now = new Date();
    setShiftStartTime(now);
    setIsShiftOpen(true);
    setShiftEndTime(null);
  };

  const handleCloseShift = () => {
    setScreen("close-shift-confirmation");
  };

  const confirmCloseShift = () => {
    const now = new Date();
    setShiftEndTime(now);
    setIsShiftOpen(false);
    setScreen("admin");
  };

  const cancelCloseShift = () => {
    setScreen("admin");
  };

  const handleEmergency = () => {
    setScreen("emergency");
  };

  const handleDisconnectAll = () => {
    // Emergency disconnect logic would go here
    console.log("Emergency: Disconnecting all users");
    setScreen("admin");
  };

  const handleBackToMain = () => {
    setScreen("admin");
  };

  const handleChats = () => {
    setScreen("chats");
  };

  // Telegram WebApp Integration
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Configure BackButton
      if (canGoBack) {
        tg.BackButton.show();
        const backHandler = () => handleBack();
        tg.BackButton.onClick(backHandler);
        
        return () => {
          tg.BackButton.offClick(backHandler);
          tg.BackButton.hide();
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [canGoBack, handleBack]);

  // Configure MainButton based on current screen
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      switch (screen) {
        case "auth":
          if (authCode.length >= 4) {
            tg.MainButton.setText("Подтвердить");
            tg.MainButton.show();
            const authHandler = () => setScreen("roles");
            tg.MainButton.onClick(authHandler);
            return () => tg.MainButton.offClick(authHandler);
          } else {
            tg.MainButton.hide();
          }
          break;
          
        case "home":
          if (!shiftOpen && !shiftClosed) {
            tg.MainButton.setText("Открыть смену");
            tg.MainButton.show();
            const shiftHandler = () => {
              setShiftOpen(true);
              setShiftStartTime(new Date());
              setScreen("shift-dashboard");
            };
            tg.MainButton.onClick(shiftHandler);
            return () => tg.MainButton.offClick(shiftHandler);
          } else if (shiftOpen && !shiftClosed) {
            tg.MainButton.setText("Закрыть смену");
            tg.MainButton.show();
            const closeHandler = () => {
              setShiftOpen(false);
              setShiftClosed(true);
              setScreen("shift-statistics");
            };
            tg.MainButton.onClick(closeHandler);
            return () => tg.MainButton.offClick(closeHandler);
          } else {
            tg.MainButton.hide();
          }
          break;
          
        default:
          tg.MainButton.hide();
          break;
      }
    }
  }, [screen, authCode, shiftOpen, shiftClosed]);

  return (
    <div className="bg-black min-h-screen text-gray-200 font-inter">
      {/* Header - only show when not in Telegram */}
      {!window.Telegram?.WebApp && (
        <header className="flex items-center px-4 py-3 bg-gray-800 border-b border-gray-700 shadow-sm fixed top-0 left-0 right-0 z-50">
          {canGoBack && (
            <button onClick={handleBack} className="mr-3 text-brand-orange text-xl">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold capitalize flex-1">{screen}</h1>
          {!shiftOpen && !shiftClosed && screen === "home" && (
            <button 
              onClick={() => setScreen("roles")} 
              className="px-3 py-1 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Назад
            </button>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className={window.Telegram?.WebApp ? "pb-6" : "pt-16 pb-6"}>
        {shiftClosed ? (
          <ShiftStatisticsScreen />
        ) : (
          <>
            {screen === "welcome" && (
              <WelcomeScreen onStart={() => setScreen("auth")} />
            )}
            
            {screen === "auth" && (
              <AuthScreen
                code={authCode}
                onChange={setAuthCode}
                onVerify={() => setScreen("roles")}
              />
            )}
            
            {screen === "roles" && (
              <RolesScreen
                roles={roles}
                onSelect={(role) => {
                  setSelectedRole(role);
                  if (role.slug === "ADMIN") {
                    setScreen("admin");
                  } else if (role.slug === "DANCER") {
                    setScreen("dancer-screen");
                  } else if (role.slug === "HOOKAH") {
                    setScreen("hookah-screen");
                  } else if (role.slug === "PROMOTER") {
                    setScreen("promoter-screen");
                  } else {
                    setScreen("home");
                  }
                }}
              />
            )}
            
            {screen === "admin" && (
              <AdminScreen
                onBack={() => setScreen("roles")}
                isShiftOpen={isShiftOpen}
                shiftStartTime={shiftStartTime}
                shiftEndTime={shiftEndTime}
                onOpenShift={handleOpenShift}
                onCloseShift={handleCloseShift}
                onEmergency={handleEmergency}
                onChats={handleChats}
              />
            )}

            {screen === "close-shift-confirmation" && (
              <CloseShiftConfirmationScreen
                onConfirm={confirmCloseShift}
                onCancel={cancelCloseShift}
              />
            )}

            {screen === "emergency" && (
              <EmergencyScreen
                onDisconnectAll={handleDisconnectAll}
                onBackToMain={handleBackToMain}
              />
            )}

            {screen === "chats" && (
              <ChatsScreen
                onBack={() => setScreen("admin")}
              />
            )}

            {screen === "dancer-screen" && (
              <DancerScreen
                onBack={() => setScreen("roles")}
              />
            )}

            {screen === "hookah-screen" && (
              <HookahScreen
                onBack={() => setScreen("roles")}
                onOpenShift={() => setScreen("hookah-dashboard-screen")}
              />
            )}

            {screen === "hookah-dashboard-screen" && (
              <HookahDashboardScreen
                onBack={() => setScreen("hookah-screen")}
                onMenu={() => setScreen("hookah-shift-screen")}
                onCloseShift={() => setScreen("hookah-screen")}
              />
            )}

            {screen === "hookah-shift-screen" && (
              <HookahShiftScreen
                onBack={() => setScreen("hookah-dashboard-screen")}
              />
            )}

            {screen === "promoter-screen" && (
              <PromoterScreen
                onBack={() => setScreen("roles")}
                onOpenShift={() => {
                  setPromoterShiftStartTime(new Date());
                  setIsPromoterShiftOpen(true);
                  setScreen("promoter-shift-screen");
                }}
                onCloseShift={() => {
                  setIsPromoterShiftOpen(false);
                  setPromoterShiftStartTime(null);
                }}
                isShiftOpen={isPromoterShiftOpen}
              />
            )}

            {screen === "promoter-shift-screen" && (
              <PromoterShiftScreen
                onBack={() => setScreen("promoter-screen")}
                onAddGuests={() => setScreen("add-guests-screen")}
                onCloseShift={() => {
                  setIsPromoterShiftOpen(false);
                  setPromoterShiftStartTime(null);
                  setScreen("promoter-screen");
                }}
                shiftStartTime={promoterShiftStartTime}
              />
            )}

            {screen === "add-guests-screen" && (
              <AddGuestsScreen
                onBack={() => setScreen("promoter-shift-screen")}
                onSubmit={(men, women) => {
                  // Handle guest addition logic here
                  console.log(`Added ${men} men and ${women} women`);
                  setScreen("promoter-shift-screen");
                }}
              />
            )}
            
            {screen === "home" && (
              <HomeScreen
                selectedRole={selectedRole}
                onNavigate={setScreen}
                shiftOpen={shiftOpen}
                setShiftOpen={setShiftOpen}
                onShiftOpen={() => {
                  setShiftStartTime(new Date());
                }}
                onShiftClose={() => {
                  setShiftClosed(true);
                  setScreen("shift-statistics");
                }}
              />
            )}

            {/* Guest Flow Screens */}
            {["guest-flow-start", "guest-count", "reservation", "visited-before", "guest-name", "reservation-card", "came-or-not", "decline-reason", "shift-dashboard"].includes(screen) && (
              <GuestFlow
                screen={screen}
                setScreen={setScreen}
                guestCount={guestCount}
                setGuestCount={setGuestCount}
                reservation={reservation}
                setReservation={setReservation}
                visitedBefore={visitedBefore}
                setVisitedBefore={setVisitedBefore}
                guestName={guestName}
                setGuestName={setGuestName}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                declineReason={declineReason}
                setDeclineReason={setDeclineReason}
                resetGuestFlow={resetGuestFlow}
                shiftStartTime={shiftStartTime}
              />
            )}

            {/* Payment Screens */}
            {["payment-methods", "deposit-input", "deposit-type-select", "ticket-select", "ticket-nominals", "ticket-payment-type", "combo-cash", "combo-card", "combo-summary", "success"].includes(screen) && (
              <PaymentScreens
                screen={screen}
                setScreen={setScreen}
                selectedPaymentMethods={selectedPaymentMethods}
                setSelectedPaymentMethods={setSelectedPaymentMethods}
                depositAmount={depositAmount}
                setDepositAmount={setDepositAmount}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                amountCash={amountCash}
                setAmountCash={setAmountCash}
                amountCard={amountCard}
                setAmountCard={setAmountCard}
                ticketAmounts={ticketAmounts}
                setTicketAmounts={setTicketAmounts}
                resetGuestFlow={resetGuestFlow}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
