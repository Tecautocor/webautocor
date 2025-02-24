import React, { useState, useEffect } from 'react';
import Image from "next/image";

const WhatsAppButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Comprobar si el mensaje ya se mostró en esta sesión
    const messageShown = sessionStorage.getItem('whatsappMessageShown');
    
    if (!messageShown) {
      // Mostrar el mensaje y marcarlo como mostrado
      setShowMessage(true);
      sessionStorage.setItem('whatsappMessageShown', 'true');

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, []);

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    // Filtrar solo números
    value = value.replace(/\D/g, '');
    // Limitar a 10 dígitos
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setPhoneNumber(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generar el mensaje con los datos ingresados
    const message = `Hola, mi nombre es ${name}. me gustaría información de sus autos que vi en la página web!!`;

    // Redirigir a la URL de WhatsApp usando la URL específica
    const url = `https://api.whatsapp.com/send/?phone=593987770028&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;

    // Abrir la URL de WhatsApp en una nueva pestaña
    window.open(url, '_blank');

    // Cerrar el modal y limpiar los campos
    setShowModal(false);
    setName('');
    setPhoneNumber('');
  };

  const handleCloseModal = () => {
    // Cerrar el modal y limpiar los campos cuando se hace clic en "Cancelar"
    setShowModal(false);
    setName('');
    setPhoneNumber('');
  };

  return (
    <div>
      <div
        className="whatsapp-button"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: '1000',
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Image
            src="/whatsapp.png" // Reemplaza con la URL del ícono de WhatsApp
            alt="WhatsApp"
            width={50}
            height={50}
          />
          {showMessage && (
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '60px',
                backgroundColor: '#25D366',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              ¡Escríbenos por WhatsApp!
            </div>
          )}
        </button>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1001',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              textAlign: 'center',
            }}
          >
            <h2>Contáctanos por WhatsApp</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  Número de Teléfono:
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                    maxLength={10}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </label>
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Enviar
              </button>
            </form>
            <button
              onClick={handleCloseModal}
              style={{
                marginTop: '10px',
                backgroundColor: 'red',
                color: 'white',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;