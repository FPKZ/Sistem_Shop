import { Dropdown } from "react-bootstrap";

/**
 * Componente separado para renderizar a lista de cores no formulário.
 * Recebe as cores, o valor atual do formulário e a função de mudança.
 */
export function Cores({ cores = [], formValue, handleChange }) {

    const getStyleItem = (corHex) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '5px',
        // Destaca se for o item selecionado
        border: formValue.cor === corHex ? '2px solid #0d6efd' : '1px solid #eaeaea',
        borderRadius: '5px',
        width: '70px',
        whiteSpace: 'normal',
        transition: 'all 0.2s ease',
        backgroundColor: formValue.cor === corHex ? '#f0f7ff' : 'transparent',
        fontSize: '10px'
    });

    return (
        <div className="d-flex flex-wrap gap-1 p-2 custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto', justifyContent: 'center' }}>
            {/* Opção "Sem Cor" */}
            <Dropdown.Item
                as="div"
                onClick={() => handleChange({ target: { name: 'cor', value: null } })}
                style={getStyleItem(null)}
            >
                <div 
                    style={{
                        backgroundColor: '#FFFFFF',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginBottom: '5px',
                        border: '1px solid #ccc',
                        overflow: "hidden"
                    }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 10 10" fill="none" >
                        <line x1="10" y1="0" x2="0" y2="10" stroke="black" strokeWidth="1" />
                    </svg>
                </div>
                <span style={{ fontWeight: 'bold', textAlign: 'center', lineHeight: '1.1' }}>
                    Sem Cor
                </span>
            </Dropdown.Item>

            {/* Lista de Cores dinâmicas */}
            {cores?.map((cor) => (
                <Dropdown.Item
                    as="div"
                    key={cor.id} 
                    onClick={() => handleChange({ target: { name: 'cor', value: cor.hex } })}
                    style={getStyleItem(cor.hex)}
                >
                    <div 
                        style={{
                            backgroundColor: cor.hex,
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            marginBottom: '5px',
                            border: cor.hex === '#FFFFFF' ? '1px solid #ccc' : 'none'
                        }} 
                    />
                    <span style={{ fontWeight: 'bold', textAlign: 'center', lineHeight: '1.1' }}>
                        {cor.name}
                    </span>
                </Dropdown.Item>
            ))}
        </div>
    );
}
