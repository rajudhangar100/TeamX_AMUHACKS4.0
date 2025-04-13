
export default function AboutUs() {
  return (
    <div className="text-white font-sans min-h-screen bg-black">

      {/* About Section */}
      <div className="w-[90%] mx-auto py-16">
        {/* Left Section - Text */}
        {/* <div className="w-full lg:w-[95%] space-y-6"> */}
          <h1 className="text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-md">
            About Dyslexi Ai
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed ">
            <strong>DyslexiAI</strong> is an innovative AI-powered platform designed to assist in the early detection and personalized therapy of dyslexia in children. Our goal is to make the process accessible, engaging, and effective by using gamified assessments, phonics-based interactive games, and real-time analysis of speech and behavior patterns.
          </p>
          <p className="text-xl text-gray-300 leading-relaxed ">
            By combining artificial intelligence with educational psychology, DyslexiAI identifies signs of dyslexia early and adapts to each child&apos;s learning pace. With features like progress tracking, Indian-accent pronunciation support, and a suite of games like <em>Phonics Game</em>, <em>Rhyme Race</em>, and <em>Word Builder</em>, the platform delivers both assessment and therapy in a fun and intuitive way.
          </p>
          <p className="text-xl text-gray-300 leading-relaxed">
            Join us in building a more inclusive world where learning differences are identified early and embraced with care and creativity.
          </p>
        </div>

        {/* Right Section - Illustration */}
        {/* <div className="w-full lg:w-[40%] mt-10 lg:mt-0 flex justify-center">
          <div className="rounded-3xl shadow-xl h-[60vh] w-full shadow-purple-700/50 bg-gradient-to-br from-purple-800 to-pink-600 flex items-center justify-center p-8">
            <h2 className="text-2xl font-bold text-white text-center">
              Empowering young minds with AI
            </h2>
          </div>
        </div> */}
      {/* </div> */}

      {/* Why Us Section */}
      <div className="w-[90%] mx-auto py-20">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center mb-12 drop-shadow-md">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-purple-700 to-pink-600 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-3">Indian English Support</h3>
            <p className="text-gray-100">
              Designed specifically with Indian-accented English for accurate pronunciation, familiarity, and better recognition.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-purple-700 to-pink-600 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-3">Gamified Therapy</h3>
            <p className="text-gray-100">
              Interactive phonics and rhyming games turn learning into a joyful, engaging experience that promotes healing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-purple-700 to-pink-600 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-3">Expert-Led Guidance</h3>
            <p className="text-gray-100">
              Our therapy modules are developed with expert input from speech therapists and educators.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-purple-700 to-pink-600 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-3">User-Friendly & Flexible</h3>
            <p className="text-gray-100">
              A clean, intuitive interface that works across devices and adapts to the child’s pace and comfort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}