import toast from "react-hot-toast";
import React from "react";

const hotToast = (message) => toast(React.createElement("div", { className: "text-center" }, message));

export default hotToast;


// toast('Here is your toast.');