import { Modal } from "react-bootstrap";
import { AlertTriangle } from "lucide-react";

export default function Confirm({ show, handleClose, handleConfirm, title, message }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      size="sm"
      className="confirm-modal"
    >
      <div className="bg-white rounded-3xl overflow-hidden border-0 shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <AlertTriangle className="text-amber-500" size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {title || "Confirmar Ação"}
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-6 px-2">
            {message || "Você tem certeza que deseja realizar esta operação? Esta ação pode ser irreversível."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
