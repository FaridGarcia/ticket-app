// Indica que este componente se ejecuta del lado del cliente en Next.js (para usar hooks, etc.)
'use client'

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { Timestamp } from "firebase/firestore"

// Funciones necesarias de Firestore para manejar la base de datos
import { 
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore"

// Tipo de datos para representar un ticket
type Ticket = {
  id: string;
  nombre: string;
  asunto: string;
  mensaje: string;
  fecha: Timestamp | null;
  respuesta?: string;
};

// Componente principal de la página
export default function Home() {

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Estado para guardar la lista de tickets desde Firestore
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // useEffect para cargar los tickets desde Firestore en tiempo real
  useEffect(() => {
    // Crea una consulta: trae todos los tickets ordenados por fecha descendente
    const q = query(collection(db, 'tickets'), orderBy('fecha', 'desc'));

    // onSnapshot escucha los cambios en tiempo real de la consulta
    const unsub = onSnapshot(q, (snapshot) => {
      const lista: Ticket[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre,
          asunto: data.asunto,
          mensaje: data.mensaje,
          respuesta: data.respuesta,
          fecha: data.fecha ?? null,
        };
      });

      // Actualiza el estado con los tickets
      setTickets(lista);
    });

    // Limpia el listener cuando se desmonta el componente
    return () => unsub();
  }, []);

  // Función que se ejecuta al hacer clic en "Enviar ticket"
  const enviarTicket = async () => {
    // Evita que se envíen campos vacíos
    if (!nombre.trim() || !asunto.trim() || !mensaje.trim()) return;

    // Agrega el ticket a Firestore con una fecha generada por el servidor y una respuesta automática
    await addDoc(collection(db, 'tickets'), {
      nombre,
      asunto,
      mensaje,
      fecha: serverTimestamp(),
      respuesta: `Hola ${nombre}, tu solicitud sobre ${asunto} fue recibida`,
    });

    // Limpia los campos del formulario después de enviar
    setNombre('');
    setAsunto('');
    setMensaje('');
  };

  //Interfaz que representa el formulario y la lista de tickets
  return (
    <main>
      <h1>Sistema de tickets</h1>

      <input
        type="text"
        placeholder="Escriba su nombre..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Asunto"
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        value={asunto}
        onChange={(e) => setAsunto(e.target.value)}
      />
      <textarea
        placeholder="Escribe aquí..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        rows={4}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        onClick={enviarTicket}
      >
        Enviar ticket
      </button>

      <h2>Lista de tickets</h2>
      <ul>
        {tickets.map((t) => (
          <li key={t.id} className="border rounded p-3">
            <p><strong>Nombre:</strong> {t.nombre}</p>
            <p><strong>Asunto:</strong> {t.asunto}</p>
            <p><strong>Mensaje:</strong> {t.mensaje}</p>
            <p><strong>Respuesta:</strong> {t.respuesta}</p>
            <p>
              <strong>Fecha:</strong>{' '}
              {t.fecha
                ? (t.fecha as Timestamp).toDate().toLocaleString('es-CO')
                : 'Pendiente...'}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
