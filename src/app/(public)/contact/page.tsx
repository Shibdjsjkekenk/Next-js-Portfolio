import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 pt-20 pb-20">
        
        {/* Left - Contact Info */}
        <div className="space-y-6 col-span-1">
          <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <div>
              <h4 className="font-semibold text-lg">Address</h4>
              <p className="text-gray-600 text-sm">Mumbai, Maharashtra</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow">
            <FaPhoneAlt className="text-blue-600 text-2xl" />
            <div>
              <h4 className="font-semibold text-lg">Phone</h4>
              <p className="text-gray-600 text-sm">+91 8779597022</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow">
            <FaEnvelope className="text-blue-600 text-2xl" />
            <div>
              <h4 className="font-semibold text-lg">E-mail</h4>
              <p className="text-gray-600 text-sm">
                tiwarishubhanshu7@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Right - Static Form UI */}
        <div className="bg-white p-8 rounded-xl shadow col-span-2">
          <h3 className="text-2xl font-bold mb-4">Send Us Message</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" className="border px-4 py-2 rounded-lg" />
            <input placeholder="Email" className="border px-4 py-2 rounded-lg" />
            <input placeholder="Phone" className="border px-4 py-2 rounded-lg" />
            <input placeholder="Subject" className="border px-4 py-2 rounded-lg" />
          </div>

          <textarea
            placeholder="Message"
            rows={5}
            className="border px-4 py-2 rounded-lg w-full mt-4"
          />

          <button className="mt-5 px-6 py-3 bg-yellow-400 rounded-full hover:bg-yellow-500">
            Submit →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
