const Input = ({ label, value, type = "text", suffix, hint, disabled = false }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            <div className="relative">
                <input disabled
                    type={type} value={value}
                    className={`w-full pl-4 pr-10 py-2.5 bg-[#1a1a1a] border border-white/5 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm
                        ${disabled ?? 'cursor-not-allowed'}`}
                />
                {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{suffix}</span>}
            </div>
            {hint && <p className="text-xs text-gray-600 mt-1.5">{hint}</p>}
        </div>
    );
}

export default Input;