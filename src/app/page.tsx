'use client';
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

interface TokenItem {
  id: string;
  name: string;
  phone: string;
  tokenNo: number;
}

export default function BarberApp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [myToken, setMyToken] = useState<number | null>(null);

  useEffect(() => {
    const q = query(collection(db, "tokens"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let tokenList: TokenItem[] = [];
      snapshot.forEach((doc) => {
        tokenList.push({ id: doc.id, ...doc.data() } as TokenItem);
      });
      setTokens(tokenList);
    });
    return () => unsubscribe();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return alert("Kripya Naam aur Phone Number bharein!");

    const newTokenNumber = tokens.length > 0 ? tokens[tokens.length - 1].tokenNo + 1 : 1;
    
    await addDoc(collection(db, "tokens"), {
      name: name,
      phone: phone,
      tokenNo: newTokenNumber,
      createdAt: new Date()
    });

    setMyToken(newTokenNumber);
    setName('');
    setPhone('');
  };

  const handleNextCustomer = async (id: string) => {
    await deleteDoc(doc(db, "tokens", id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans max-w-md mx-auto">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 rounded-xl text-center shadow-lg mb-6">
        <h1 className="text-2xl font-bold">💈 Royal Barber Shop</h1>
        <p className="text-sm opacity-90">Online Token & Live Queue</p>
      </header>

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Book Your Token</h2>
        <form onSubmit={handleBooking} className="space-y-4">
          <input 
            type="text" 
            placeholder="Apna Naam Daalein" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
            Book Token Now
          </button>
        </form>

        {myToken && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-bold">
            Aapka Token Number Hai: #{myToken}
          </div>
        )}
      </div>

      {/* Live Queue */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Live Waiting Line ({tokens.length})</h2>
        {tokens.length === 0 ? (
          <p className="text-gray-500 text-center">Abhi koi waiting me nahi hai!</p>
        ) : (
          <div className="space-y-3">
            {tokens.map((item, index) => (
              <div key={item.id} className={`p-3 rounded-lg flex justify-between items-center ${index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50'}`}>
                <div>
                  <span className="font-bold text-lg text-black">Token #{item.tokenNo}</span>
                  <p className="text-sm text-gray-600">{item.name} {index === 0 && "(Haircut Chal Raha Hai)"}</p>
                </div>
                {index === 0 && (
                  <button onClick={() => handleNextCustomer(item.id)} className="bg-green-600 text-white text-xs px-3 py-2 rounded font-bold">
                    Done (Next)
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}