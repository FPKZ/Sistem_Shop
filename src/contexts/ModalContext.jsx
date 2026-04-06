import React, { createContext, useContext, useState, useCallback } from 'react';
import Confirm from '../components/modal/Confirm';

const ModalContext = createContext(null);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {},
    });

    const showConfirm = useCallback(({ title, message, onConfirm, onCancel }) => {
        setModalConfig({
            show: true,
            title: title || 'Confirmar',
            message: message || 'Você tem certeza?',
            onConfirm: () => {
                if (onConfirm) onConfirm();
                setModalConfig(prev => ({ ...prev, show: false }));
            },
            onCancel: () => {
                if (onCancel) onCancel();
                setModalConfig(prev => ({ ...prev, show: false }));
            },
        });
    }, []);

    const hideModal = useCallback(() => {
        setModalConfig(prev => ({ ...prev, show: false }));
    }, []);

    return (
        <ModalContext.Provider value={{ showConfirm, hideModal }}>
            {children}
            <Confirm
                show={modalConfig.show}
                title={modalConfig.title}
                message={modalConfig.message}
                handleConfirm={modalConfig.onConfirm}
                handleClose={modalConfig.onCancel}
            />
        </ModalContext.Provider>
    );
};

export default ModalProvider;
