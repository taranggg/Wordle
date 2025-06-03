const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500
            text-white rounded-xl hover:shadow-xl transition-all duration-150"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Modal;
