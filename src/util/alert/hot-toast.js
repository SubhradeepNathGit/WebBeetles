import toast from "react-hot-toast";

const hotToast = (message, type = "success", icon, options = {}) => {
    
    const baseOptions = {
        className: "text-center",
        ...options,
    };

    if (icon !== undefined) {
        baseOptions.icon = icon;
    }

    switch (type) {
        case "success":
            toast.success(message, baseOptions);
            break;

        case "error":
            toast.error(message, baseOptions);
            break;

        case "info":
            toast(message, {
                ...baseOptions,
                icon: icon ??  "⚠️",
            });
            break;

        case "loading":
            toast.loading(message, baseOptions);
            break;

        default:
            toast(message, baseOptions);
    }
};

export default hotToast;


// hotToast("Course already purchased", "info", <Info className='text-orange-600' />); 
// hotToast("Course added to cart", "success");