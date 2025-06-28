import { 
  Shield, 
  Music, 
  Bell, 
  Megaphone, 
  Eye, 
  Cigarette, 
  Wine,
  MoreHorizontal 
} from "lucide-react";

interface Role {
  slug: string;
  title: string;
  icon: string;
}

interface RoleSelectProps {
  onSelectRole: () => void;
}

const iconMap = {
  "shield-user": Shield,
  "music": Music,
  "concierge-bell": Bell,
  "bullhorn": Megaphone,
  "eye": Eye,
  "smoking": Cigarette,
  "glass-cheers": Wine,
  "ellipsis-h": MoreHorizontal,
};

// Mapping of role slugs to Russian titles
const russianRoleMap: Record<string, string> = {
  "ADMIN": "АДМИН",
  "DANCER": "ТАНЦОВЩИЦА",
  "HOSTESS": "ХОСТЕС",
  "PROMOTER": "ПРОМОУТЕР",
  "SECURITY": "ОХРАНА",
  "HOOKAH": "КАЛЬЯНЩИК",
  "WAITER": "ОФИЦИАНТ",
  "BARTENDER": "БАРМЕН",
  "DJ": "ДИДЖЕЙ",
  "MANAGER": "МЕНЕДЖЕР",
  "OFICIANT": "ОФИЦИАНТ",
  "TRAINEE": "СТАЖЕР"
};

// Mock roles data
const mockRoles: Role[] = [
  { slug: "ADMIN", title: "Admin", icon: "shield-user" },
  { slug: "HOSTESS", title: "Hostess", icon: "concierge-bell" },
  { slug: "PROMOTER", title: "Promoter", icon: "bullhorn" },
  { slug: "HOOKAH", title: "Hookah", icon: "smoking" },
  { slug: "WAITER", title: "Waiter", icon: "eye" },
  { slug: "DJ", title: "DJ", icon: "music" },
];

export default function RoleSelect({ onSelectRole }: RoleSelectProps) {
  const handleRoleSelect = (role: Role) => {
    console.log("Selected role:", role);
    onSelectRole();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black">
      {/* Debug label */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-xs text-white/30 z-50">
        role-select
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 relative">
        <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md mb-2 text-center">
          role-select
        </div>

        {/* Background decoration - similar to auth-screen */}
        <div className="absolute top-20 left-6 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-8 w-24 h-24 bg-gradient-to-tl from-pink-500/10 to-orange-500/10 rounded-full blur-2xl"></div>

        <div className="w-full max-w-sm relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-white mb-3 text-[29px]">Выберите роль</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Выберите вашу роль для продолжения
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-4"></div>
          </div>
          
          {/* Roles list with auth-screen button styling */}
          <div className="space-y-4">
            {mockRoles.map((role, index) => {
              const IconComponent = iconMap[role.icon as keyof typeof iconMap] || MoreHorizontal;
              const isOrange = ["ADMIN", "HOSTESS", "HOOKAH", "OFICIANT", "TRAINEE"].includes(role.slug);
              const russianTitle = russianRoleMap[role.slug] || role.title;
              
              return (
                <div key={role.slug} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => handleRoleSelect(role)}
                    className={`group relative w-full h-16 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white font-semibold text-base transition-all duration-300 transform active:scale-95 ${
                      isOrange
                        ? 'hover:border-orange-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-orange-500/25'
                        : 'hover:border-pink-500/60 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-pink-500/25'
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex items-center justify-start space-x-3 pl-4">
                      <IconComponent 
                        size={20} 
                        className={`transition-colors duration-300 ${
                          isOrange ? 'text-orange-400 group-hover:text-orange-300' : 'text-pink-400 group-hover:text-pink-300'
                        }`} 
                      />
                      <span className="uppercase tracking-wide">
                        {russianTitle}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Helper text similar to auth-screen */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              Выберите роль для продолжения
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 