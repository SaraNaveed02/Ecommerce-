import Image from "next/image"
import heroimage from "../../../public/images/heroimage.png"
export default function Hero() {
  return (
    <section className="relative bg-yellow-400 overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center px-6 py-12 lg:py-20 gap-10">
  {/* Left Content */}
  <div className="space-y-4 text-center lg:text-left">
    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-light text-orange-500">
      TRANSFORM YOUR SKIN WITH THE
    </h2>

    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white">
      #14DAYCHALLENGE
    </h1>

    <button className="border-2 border-orange-500 px-8 sm:px-10 py-3 sm:py-4 text-orange-500 font-semibold bg-white hover:bg-orange-100 transition rounded-md">
      GET YOURS
    </button>
  </div>

  {/* Right Image */}
  <div className="flex justify-center lg:justify-end  lg:mt-0">
    <Image
      src={heroimage} 
      alt="Product"
      className="w-60 sm:w-72 lg:w-96 object-contain"
    />
  </div>
</div>


    
    </section>
  )
}
