"use client";

import Image from "next/image";

const MyExpertise = () => {
  return (
    <div
      className="max-w-auto"
      id="services"
    >
      <div className="pb-10  max-w-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center pb-15">
          My <span className="text-[#6A38C2]">Expertise</span>
        </h1>

        <div className="flex justify-center">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-6xl">

            {/* LEFT COLUMN */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center bg-gradient-to-r from-[#F0F8FF] to-[#fefcf0] p-4 rounded-lg shadow-lg mb-6">
                <div className="md:w-3/12 p-2 ">
                  <Image
                    src="/assets/website.png"
                    alt="Website Development"
                    width={120}
                    height={120}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>

                <div className="w-full md:w-9/12 p-2 md:pl-4 md:border-l md:border-gray-300">
                  <p className="text-gray-700 text-[19px] font-semibold">
                    Website Development
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-gradient-to-r from-[#F0F8FF] to-[#fefcf0] p-4 rounded-lg shadow-lg mb-6">
                <div className="md:w-3/12 p-2">
                  <Image
                    src="/assets/software.png"
                    alt="Software Development"
                    width={120}
                    height={120}
                    className="h-auto object-cover rounded-lg"
                  />
                </div>

                <div className="w-full md:w-9/12 p-2 md:pl-4 md:border-l md:border-gray-300">
                  <p className="text-gray-700 text-[19px] font-semibold">
                    Software Development
                  </p>
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN */}
            <div className="w-full md:w-1/2">
              <div className="flex overflow-hidden flex-wrap items-center bg-gradient-to-r from-[#F0F8FF] to-[#fefcf0] p-5 rounded-lg shadow-lg mb-6 relative">
                <div className="popular-label absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 transform rotate-[-45deg] origin-top-left">
                  New
                </div>

                <div className="md:w-3/12 p-2 flex items-center">
                  <Image
                    src="/assets/ai.png"
                    alt="AI Integration"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                </div>

                <div className="w-full md:w-9/12 p-2 md:pl-4 md:border-l md:border-gray-300">
                  <p className="text-gray-700 text-[19px] font-semibold">
                    AI Integration
                  </p>
                </div>

                <p className="text-gray-700 pt-4 pb-4 text-[16px] text-justify">
                  Enhance your product with AI integration to deliver unparalleled
                  user experience. Our AI solutions will make your product smarter,
                  more efficient, and highly user-friendly, elevating it to a whole
                  new level of innovation and effectiveness.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-wrap items-center bg-gradient-to-r from-[#F0F8FF] to-[#fefcf0] p-4 rounded-lg shadow-lg mb-6">
                <div className="md:w-3/12 p-2">
                  <Image
                    src="/assets/seo.png"
                    alt="SEO"
                    width={80}
                    height={80}
                    className="h-auto object-cover rounded-lg w-20"
                  />
                </div>

                <div className="md:w-9/12 p-2 md:pl-4 md:border-l md:border-gray-300">
                  <p className="text-gray-700 text-[19px] font-semibold">
                    SEO
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-gradient-to-r from-[#F0F8FF] to-[#fefcf0] p-4 rounded-lg shadow-lg mb-6">
                <div className="md:w-3/12 p-2">
                  <Image
                    src="/assets/digital.png"
                    alt="Digital Marketing"
                    width={120}
                    height={120}
                    className="h-auto object-cover rounded-lg"
                  />
                </div>

                <div className="w-full md:w-9/12 p-2 md:pl-4 md:border-l md:border-gray-300">
                  <p className="text-gray-700 text-[19px] font-semibold">
                    Digital Marketing
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyExpertise;
