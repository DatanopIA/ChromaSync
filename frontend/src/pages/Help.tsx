import { useState } from "react";
import { Search, Book, Video, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  { question: "How do I export a palette to Figma?", answer: "You can use our Figma plugin or export the palette as a JSON file and import it directly into your Figma project. Alternatively, you can copy the HEX codes directly from the generator." },
  { question: "Can I use ChromaSync offline?", answer: "Currently, ChromaSync requires an internet connection to access AI suggestions and community features. However, you can still generate and save palettes locally in your browser." },
  { question: "What is the difference between Free and Pro?", answer: "Pro users get unlimited projects, advanced AI harmony suggestions, priority support, and the ability to export palettes in multiple formats including ASE for Adobe products." },
  { question: "How does the AI color generator work?", answer: "Our AI model is trained on thousands of professional design palettes. It analyzes your current colors and suggests complementary shades based on color theory and current design trends." },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-16">
      <header className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-medium tracking-tight"
        >
          How can we help you?
        </motion.h1>
        <p className="text-gray-500 text-lg">Search our knowledge base or browse categories below.</p>
        
        <div className="relative w-full mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for articles, tutorials, or FAQs..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
            <Book size={28} />
          </div>
          <h3 className="text-xl font-medium">Documentation</h3>
          <p className="text-gray-500 text-sm">Detailed guides on how to use every feature in ChromaSync.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
            <Video size={28} />
          </div>
          <h3 className="text-xl font-medium">Video Tutorials</h3>
          <p className="text-gray-500 text-sm">Step-by-step video lessons for visual learners.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-xl font-medium">Community Forum</h3>
          <p className="text-gray-500 text-sm">Ask questions and share tips with other designers.</p>
        </motion.div>
      </div>

      <section className="max-w-3xl mx-auto w-full space-y-8 pt-8 border-t border-gray-100">
        <h2 className="text-2xl font-medium text-center">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left font-medium hover:bg-gray-50 transition-colors"
              >
                {faq.question}
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 p-8 md:p-12 bg-gray-50 rounded-3xl text-center flex flex-col items-center gap-6 max-w-3xl mx-auto w-full">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-black">
          <MessageCircle size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-medium mb-2">Still need help?</h2>
          <p className="text-gray-500">Our support team is always ready to assist you.</p>
        </div>
        <button className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
