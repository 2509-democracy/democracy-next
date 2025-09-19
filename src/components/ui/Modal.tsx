interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className = '' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md mx-4 ${className}`}>
        {children}
      </div>
    </div>
  );
}