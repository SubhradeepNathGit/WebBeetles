import React, { useState } from 'react'
import SectionCard from '../common/SectionCard'
import { ShoppingCart } from 'lucide-react'

function Toggle({ value, onChange, label, description }) {
    return (
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
            <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!value)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 cursor-pointer ${value ? "bg-purple-600" : "bg-gray-700"}`}
            >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${value ? "left-6" : "left-1"}`} />
            </button>
        </div>
    );
}

const PlatformToggle = ({ cartEnabled, setCartEnabled, maintenanceMode, setOpenMarkModal }) => {

    const [promoEnabled, setPromoEnabled] = useState(true);
    const [newSignups, setNewSignups] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);

    return (
        <SectionCard icon={ShoppingCart} title="Platform Feature Toggles">
            <div className="space-y-3 mt-5">
                <Toggle value={cartEnabled} onChange={()=>null} label="Enable Cart / Multi-Course Purchase" description="Allow students to add multiple courses before checking out." />
                <Toggle value={promoEnabled} onChange={()=>null} label="Enable Promo Code Entry at Checkout" description="Show the promo code input field in the cart." />
                <Toggle value={newSignups} onChange={()=>null} label="Allow New Student Registrations" description="Disable to pause new user signups during maintenance." />
                <Toggle value={emailNotifications} onChange={()=>null} label="Send Email Notifications" description="Trigger enrollment, approval, and system emails." />
                <div className={`rounded-xl overflow-hidden transition-all duration-300 ${maintenanceMode ? "ring-2 ring-red-500/30" : ""}`}>
                    <Toggle value={maintenanceMode} onChange={() => setOpenMarkModal(true)} label="🚨 Maintenance Mode" description="Makes the entire student site show a maintenance page." />
                </div>
            </div>
        </SectionCard>
    )
}

export default PlatformToggle