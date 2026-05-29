import { useDispatch, useSelector } from 'react-redux';
import { closeConfirmDialog } from '../../redux/uiSlice';

export default function ConfirmDialog() {
  const dispatch = useDispatch();
  const { isOpen, title, message, onConfirm } = useSelector((s) => s.ui.confirmDialog);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    dispatch(closeConfirmDialog());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => dispatch(closeConfirmDialog())} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title || 'Confirm Action'}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message || 'Are you sure you want to proceed?'}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => dispatch(closeConfirmDialog())} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
          <button onClick={handleConfirm} className="btn-danger px-4 py-2 text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
}
