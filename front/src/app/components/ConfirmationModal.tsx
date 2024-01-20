interface ConfirmationModalProps {
  isOpen: boolean;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}



const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
        <p className="text-gray-800 text-lg">{message}</p>
        <div className="flex justify-around mt-4">
          <button 
            onClick={onConfirm} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            OK
          </button>
          <button 
            onClick={onCancel} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
