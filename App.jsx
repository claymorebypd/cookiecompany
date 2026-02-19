import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Plus, Minus, X, ArrowRight, CheckCircle, Cookie, MessageSquare, Home, Truck, ClipboardList, AlertCircle, MapPin, ChevronRight, Package, Box } from 'lucide-react';

const APP_NAME = "Cookie Company Stockholm";

// Box sizes and their respective fixed prices for curated sets
const BOX_OPTIONS = [
  { size: 1, label: 'Choose Your Cookies', isIndividual: true },
  { size: 5, price: 199, label: 'Small Box' },
  { size: 10, price: 379, label: 'Medium Box' },
  { size: 15, price: 549, label: 'Large Box' }
];

const COOKIES = [
  { 
    id: 'biscoff', 
    name: 'Biscoff Cookie', 
    desc: 'Spiced Belgian cookie butter core with crunchy biscuit bits.', 
    color: 'bg-[#C19A6B]',
    price: 35,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'chocochip', 
    name: 'Choco Chip', 
    desc: 'Brown butter dough with 70% dark chocolate chunks and sea salt.', 
    color: 'bg-[#4A3728]',
    price: 25,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'pistachio', 
    name: 'Pistachio Cream', 
    desc: 'Rich roasted pistachio filling with white chocolate drizzle.', 
    color: 'bg-[#93C572]',
    price: 40,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'raspberry', 
    name: 'Raspberry White Choco', 
    desc: 'Tart Swedish raspberries paired with creamy white chocolate.', 
    color: 'bg-[#E30B5D]',
    price: 38,
    image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'blueberry', 
    name: 'Blueberry Cheese', 
    desc: 'Wild Swedish blueberries with a tangy cream cheese center.', 
    color: 'bg-[#4F86C6]',
    price: 38,
    image: 'https://images.unsplash.com/photo-1583182332473-b31ba08929c8?auto=format&fit=crop&q=80&w=400'
  }
];

const App = () => {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedBoxSize, setSelectedBoxSize] = useState(5);
  const [currentBox, setCurrentBox] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState('review');
  
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', phone: '', address: '', addressNo: '', postalCode: '', city: 'Stockholm'
  });
  
  const [formErrors, setFormErrors] = useState({});

  const [feedbacks, setFeedbacks] = useState([
    { name: "Lars S.", rating: 5, text: "The Pistachio Cream is life-changing. Best fika in Stockholm!" },
    { name: "Emma W.", rating: 5, text: "Sent a box of 10 to the office, they disappeared in minutes." }
  ]);

  const handleBoxSizeChange = (size) => {
    setSelectedBoxSize(size);
    if (currentBox.length > size) {
      setCurrentBox(currentBox.slice(0, size));
    }
  };

  const addToBox = (cookie) => {
    if (selectedBoxSize === 1) {
      const singleOrder = {
        id: Math.random(),
        type: `${cookie.name}`,
        items: [cookie],
        price: cookie.price
      };
      setCart([...cart, singleOrder]);
      setIsCartOpen(true);
    } else {
      if (currentBox.length < selectedBoxSize) {
        setCurrentBox([...currentBox, { ...cookie, boxId: Math.random() }]);
      }
    }
  };

  const removeFromBox = (boxId) => {
    setCurrentBox(currentBox.filter(item => item.boxId !== boxId));
  };

  const addBoxToCart = () => {
    const boxOption = BOX_OPTIONS.find(b => b.size === selectedBoxSize);
    if (currentBox.length === selectedBoxSize) {
      const boxOrder = {
        id: Math.random(),
        type: `Custom Box of ${selectedBoxSize}`,
        items: [...currentBox],
        price: boxOption.price
      };
      setCart([...cart, boxOrder]);
      setCurrentBox([]);
      setCartStep('review');
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingInfo.fullName.trim()) errors.fullName = "Name is required";
    if (!emailRegex.test(shippingInfo.email)) errors.email = "Invalid email";
    if (!shippingInfo.phone.trim()) errors.phone = "Phone is required";
    if (!shippingInfo.address.trim()) errors.address = "Street required";
    if (!shippingInfo.city.trim() || !shippingInfo.city.toLowerCase().includes('stockholm')) {
      errors.city = "Stockholm only.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutNext = () => {
    if (cartStep === 'review') setCartStep('shipping');
    else if (cartStep === 'shipping' && validateForm()) setCartStep('success');
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    if (cartStep === 'success') {
      setTimeout(() => {
        setCartStep('review');
        setCart([]);
        setShippingInfo({ fullName: '', email: '', phone: '', address: '', addressNo: '', postalCode: '', city: 'Stockholm' });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3728] font-sans selection:bg-[#D4A373] selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#EDE0D4] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
          <div className="bg-[#D4A373] p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
             <Cookie className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">cookiecompany<span className="text-[#D4A373]">.se</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 font-semibold text-sm uppercase tracking-wider">
          <button onClick={() => setView('home')} className={view === 'home' ? 'text-[#D4A373]' : 'hover:text-[#D4A373] transition-colors'}>Home</button>
          <button onClick={() => { setView('shop'); setSelectedBoxSize(5); }} className={view === 'shop' ? 'text-[#D4A373]' : 'hover:text-[#D4A373] transition-colors'}>Order</button>
          <button onClick={() => setView('feedback')} className={view === 'feedback' ? 'text-[#D4A373]' : 'hover:text-[#D4A373] transition-colors'}>Reviews</button>
        </div>

        <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-[#F5EBE0] hover:bg-[#EDE0D4] rounded-xl transition-all">
          <ShoppingCart size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#4A3728] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-[#FDFBF7]">
              {cart.length}
            </span>
          )}
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {view === 'home' && (
          <div className="space-y-24 animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="relative rounded-[3rem] overflow-hidden bg-[#4A3728] text-white p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-8 z-10">
                <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                  Fresh from Stockholm
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-[1.1]">
                  Best fika <br />in the city.
                </h1>
                <p className="text-lg text-white/70 max-w-sm">
                  Hand-rolled, gooey-centered perfection. Grab a few treats or build a custom box for your next gathering.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                   <button onClick={() => setView('shop')} className="bg-[#D4A373] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#C19A6B] transition-all">
                    Start Your Order <ArrowRight size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=300" className="rounded-2xl rotate-3 hover:rotate-0 transition-transform shadow-2xl" alt="Cookie" />
                  <img src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=300" className="rounded-2xl -rotate-6 translate-y-8 hover:rotate-0 transition-transform shadow-2xl" alt="Cookie" />
                </div>
              </div>
            </section>

            {/* Selection Grid */}
            <section className="grid md:grid-cols-4 gap-6">
              {BOX_OPTIONS.map(opt => (
                <div key={opt.size} className="bg-white border border-[#EDE0D4] p-8 rounded-[2rem] hover:border-[#D4A373] transition-all group flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4A373] mb-4">
                      {opt.size === 1 ? 'Individual Order' : opt.label}
                    </h3>
                    <div className="text-3xl font-bold mb-2">
                      {opt.size === 1 ? 'Choose Your Cookies' : `${opt.size} Cookies`}
                    </div>
                    <p className="text-xs text-[#9C8C7D] mb-6 leading-relaxed italic">
                      {opt.size === 1 
                        ? "Select your favorite flavors one by one. Perfect for a quick treat." 
                        : `The perfect curated set of ${opt.size} flavors.`}
                    </p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#6B5E51] mb-6">
                      {opt.size === 1 ? 'From 25' : opt.price} SEK
                    </div>
                    <button onClick={() => { setSelectedBoxSize(opt.size); setView('shop'); }} className="flex items-center gap-2 font-bold text-sm group-hover:gap-4 transition-all">
                      Select Flavor <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {view === 'shop' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">{selectedBoxSize === 1 ? 'Pick Your Flavors' : 'Build Your Box'}</h2>
                <p className="text-[#6B5E51]">
                  {selectedBoxSize === 1 
                    ? "Add your favorite cookies to your cart. Note: Boxes offer better value!"
                    : `Currently filling a box of ${selectedBoxSize} cookies.`}
                </p>
              </div>
              <div className="flex bg-[#F5EBE0] p-1 rounded-2xl overflow-x-auto">
                {BOX_OPTIONS.map(opt => (
                  <button 
                    key={opt.size}
                    onClick={() => handleBoxSizeChange(opt.size)}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedBoxSize === opt.size ? 'bg-white shadow-sm text-[#4A3728]' : 'text-[#9C8C7D] hover:text-[#4A3728]'}`}
                  >
                    {opt.size === 1 ? 'Pick Flavors' : `Box of ${opt.size}`}
                  </button>
                ))}
              </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                {COOKIES.map(cookie => (
                  <div key={cookie.id} className="bg-white p-4 rounded-[2rem] border border-[#EDE0D4] hover:border-[#D4A373] hover:shadow-xl hover:shadow-[#D4A373]/5 transition-all group">
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-5">
                       <img src={cookie.image} alt={cookie.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-[#4A3728]">
                         {cookie.price} SEK
                       </div>
                    </div>
                    <div className="px-2 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl">{cookie.name}</h3>
                      </div>
                      <p className="text-sm text-[#6B5E51] line-clamp-2 mb-4 leading-relaxed">{cookie.desc}</p>
                      <button 
                        onClick={() => addToBox(cookie)}
                        disabled={selectedBoxSize > 1 && currentBox.length >= selectedBoxSize}
                        className="w-full bg-[#F5EBE0] text-[#4A3728] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#4A3728] hover:text-white disabled:opacity-30 transition-all"
                      >
                        <Plus size={18} /> {selectedBoxSize === 1 ? 'Add to Cart' : 'Add to Box'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Logic */}
              <div className="h-fit sticky top-28">
                {selectedBoxSize > 1 ? (
                  <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#D4A373] shadow-2xl shadow-[#D4A373]/10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold">Your Box Selection</h3>
                      <div className="bg-[#D4A373] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {currentBox.length} / {selectedBoxSize}
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-10">
                      {[...Array(selectedBoxSize)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-[#EDE0D4] flex items-center justify-center relative overflow-hidden bg-[#FDFBF7]">
                          {currentBox[i] ? (
                            <div className="w-full h-full relative group animate-in zoom-in-50">
                              <img src={currentBox[i].image} className="w-full h-full object-cover" alt="selected" />
                              <button onClick={() => removeFromBox(currentBox[i].boxId)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><X size={20} /></button>
                            </div>
                          ) : <Cookie size={16} className="text-[#EDE0D4] opacity-50" />}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4 pt-6 border-t border-[#EDE0D4]">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-[#9C8C7D] uppercase tracking-widest">Box Price</span>
                        <span className="text-3xl font-black">{BOX_OPTIONS.find(b => b.size === selectedBoxSize).price} SEK</span>
                      </div>
                      <button onClick={addBoxToCart} disabled={currentBox.length < selectedBoxSize} className="w-full bg-[#4A3728] text-white py-5 rounded-2xl font-bold disabled:bg-[#D4C3B3] transition-all shadow-lg hover:shadow-black/20">
                        {currentBox.length < selectedBoxSize ? `Add ${selectedBoxSize - currentBox.length} More` : 'Add Box to Cart'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#4A3728] text-white p-8 rounded-[3rem] shadow-xl">
                    <Package className="text-[#D4A373] mb-4" size={32} />
                    <h3 className="text-xl font-bold mb-4">Ordering Individually?</h3>
                    <p className="text-sm opacity-80 mb-6 leading-relaxed">
                      Customizing your own selection of flavors. Remember, our curated boxes of 5 or 10 offer the best value for your Stockholm fika.
                    </p>
                    <button onClick={() => handleBoxSizeChange(5)} className="w-full bg-[#D4A373] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-[#4A3728] transition-colors">
                      Switch to Box of 5
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'feedback' && (
          <div className="max-w-3xl mx-auto animate-in fade-in py-10">
             <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4">Loved by Stockholm</h2>
              <p className="text-[#6B5E51]">Check out what our fellow fika-lovers have to say.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {feedbacks.map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-[#EDE0D4] shadow-sm transition-transform">
                  <div className="flex gap-1 text-[#D4A373] mb-4">
                    {[...Array(f.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="italic text-lg mb-6 leading-relaxed">"{f.text}"</p>
                  <span className="font-bold">— {f.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseCart} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-8 border-b border-[#EDE0D4] flex justify-between items-center">
              <h2 className="text-2xl font-bold">{cartStep === 'review' ? 'Cart' : 'Details'}</h2>
              <button onClick={handleCloseCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-[#FDFBF7]">
              {cartStep === 'review' ? (
                <div className="space-y-6">
                  {cart.length === 0 ? <p className="text-center py-20 text-[#9C8C7D]">Your cart is empty.</p> : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#EDE0D4] flex justify-between items-center">
                          <div>
                            <h4 className="font-bold">{item.type}</h4>
                            <p className="font-bold text-[#D4A373]">{item.price} SEK</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 font-bold text-xs uppercase">Remove</button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : cartStep === 'shipping' ? (
                <div className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl border border-[#D4C3B3]" value={shippingInfo.fullName} onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})} />
                  <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl border border-[#D4C3B3]" value={shippingInfo.email} onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})} />
                  <input type="tel" placeholder="Phone" className="w-full p-4 rounded-2xl border border-[#D4C3B3]" value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} />
                  <input type="text" placeholder="Street Address" className="w-full p-4 rounded-2xl border border-[#D4C3B3]" value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Postal Code" className="w-full p-4 rounded-2xl border border-[#D4C3B3]" value={shippingInfo.postalCode} onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})} />
                    <input type="text" readOnly value="Stockholm" className="w-full p-4 rounded-2xl border border-[#EDE0D4] bg-[#F5EBE0] font-bold" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-6 animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600"><CheckCircle size={40} /></div>
                  <h3 className="text-3xl font-bold">Baked & Ready!</h3>
                  <p className="text-[#6B5E51]">Tack! We're starting on your order now.</p>
                  <button onClick={handleCloseCart} className="w-full py-4 rounded-2xl bg-[#4A3728] text-white font-bold">Done</button>
                </div>
              )}
            </div>

            {cart.length > 0 && cartStep !== 'success' && (
              <div className="p-8 border-t border-[#EDE0D4] bg-white">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-sm font-bold text-[#9C8C7D] uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black">{totalPrice} SEK</span>
                </div>
                <button onClick={handleCheckoutNext} className="w-full bg-[#D4A373] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#C19A6B] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#D4A373]/20">
                  {cartStep === 'review' ? 'Checkout' : 'Place Order'} <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#EDE0D4] py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start text-left gap-12">
           <div className="space-y-4">
              <span className="font-black uppercase tracking-tighter text-lg">cookiecompany<span className="text-[#D4A373]">.se</span></span>
              <p className="text-xs text-[#6B5E51] leading-relaxed max-w-xs">Artisanal cookies, small-batch spirit. Baked fresh daily in Stockholm.</p>
           </div>
           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9C8C7D]">Visit Us</h4>
              <p className="text-xs text-[#6B5E51]">Sveavägen 12, Stockholm</p>
           </div>
           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9C8C7D]">Connect</h4>
              <div className="flex gap-4 text-sm font-bold underline">
                 <a href="#">Instagram</a>
                 <a href="#">TikTok</a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
