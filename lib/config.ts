export const CONFIG = {
  brand: "FIT MEN COOK",
  city: "Visakhapatnam",
  whatsapp: "919101128893", // country code + number, no +
  phoneDisplay: "+91 91011 28893",
  email: "fitmencook80@gmail.com",
  instagram: "https://www.instagram.com/fitmencook.vizag",
  address: "53-16/3, Maddilapalem, Visakhapatnam 530003, Andhra Pradesh",
  upiId: "yourupi@ybl", // TODO: replace with real UPI ID
  mapEmbed:
    "https://www.google.com/maps?q=53-16/3,+Maddilapalem,+Visakhapatnam,+Andhra+Pradesh+530003&output=embed",
};
export const wa = (msg: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
