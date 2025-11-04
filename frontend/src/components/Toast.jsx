import { useState, useEffect } from 'react';

let toastQueue = [];
let setToastState = null;

export const showToast = (message) => {
  if (setToastState) {
    toastQueue.push(message);
    setToastState(message);
  } else {
    alert(message); // Fallback
  }
};

export default function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setToastState = (msg) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        if (toastQueue.length > 0) {
          const nextMsg = toastQueue.shift();
          setMessage(nextMsg);
          setVisible(true);
          setTimeout(() => setVisible(false), 3000);
        }
      }, 3000);
    };
    return () => {
      setToastState = null;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
      {message}
    </div>
  );
}
