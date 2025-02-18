import React  from "react";

export interface ModalProps{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
    className?: string;
}


const BACKGROUND_STYLE: React.CSSProperties = {
    position: 'fixed',
    zIndex: '1000',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'rgb(0, 0, 0, 0.7)',
}

const MODAL_STYLE: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:  '92%',
    margin: 'auto',
    padding: '1.8rem 2.5rem',
    backgroundColor: 'var(--white)',
    boxShadow: '4px 4px 8px var(--dark), -4px -4px 8px var(--light-dark)',
    borderRadius: '1rem',
    maxHeight: '95vh',
    overflowY: 'auto'
  
}


export default function Modal({isOpen, setIsOpen, children, className}: ModalProps){

    if(!isOpen){
        return
    }

    return (
        <div style={BACKGROUND_STYLE}>    
            <div style={MODAL_STYLE} className={className}>
                <button className="modal-button-close" onClick={() => setIsOpen(false)}>x
                </button> 
                {children}
               
            </div>
        </div>
    )
}
