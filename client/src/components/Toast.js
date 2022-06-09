import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toast({ message, type, duration = 5000 }) {
  const params = {
    position: "bottom-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case "success":
      toast.success(message, params);
      break;

    case "warning":
      toast.warn(message, params);
      break;

    case "error":
      toast.error(message, params);
      break;

    case "info":
      toast.info(message, params);
      break;

    default:
      toast(message, params);
      break;
  }
}

export function ToastPromise({ promise, pendingText, successText, errorText }) {
  toast.promise(promise, {
    pending: pendingText,
    success: successText,
    error: errorText,
  });
}
