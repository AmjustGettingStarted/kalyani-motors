import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const DEFAULT_FAQS = [
    {
        id: 'faq-1',
        title: 'How do I book a doorstep test drive with Kalyani Motors?',
        subtitle: 'Booking & Test Drives',
        content:
            'You can schedule a doorstep test drive through our website by selecting your preferred Arena or Nexa car and nearest showroom. Our sales consultant will arrive at your home or office with the vehicle at your chosen date and time slot.',
    },
    {
        id: 'faq-2',
        title: 'What financing and EMI schemes are available for new cars?',
        subtitle: 'Finance & Payments',
        content:
            'We partner with leading banks like SBI, HDFC, ICICI, and Maruti Suzuki Smart Finance to offer on-the-spot loan approvals, low down-payment options, flexible 7-year tenures, and competitive interest rates with transparent paperwork.',
    },
    {
        id: 'faq-3',
        title: 'What is the main difference between Arena and Nexa dealerships?',
        subtitle: 'Channels & Portfolio',
        content:
            'Maruti Suzuki Arena caters to practical and high-utility family vehicles like the Swift, Dzire, Brezza, and Ertiga. Nexa represents our premium customer hospitality line with cutting-edge tech, featuring the Grand Vitara, Baleno, Fronx, and Jimny.',
    },
    {
        id: 'faq-4',
        title: 'How does the 60-Minute Express Service maintenance work?',
        subtitle: 'Service & Maintenance',
        content:
            'Our dedicated Express Service bays assign two synchronized technicians to handle periodic inspections, oil changes, brake checks, and washing in parallel, returning your vehicle within 60 minutes while you wait in our executive customer lounge.',
    },
    {
        id: 'faq-5',
        title: 'What warranty and roadside assistance (RSA) is included?',
        subtitle: 'Warranty & Protection',
        content:
            'Every new Maruti Suzuki comes with a 2-year / 40,000 km standard manufacturer warranty, extendable up to 5 years or 1,00,000 km. We also provide 24/7 round-the-clock roadside emergency support across South India.',
    },
    {
        id: 'faq-6',
        title: 'Can I exchange my old car of any brand through True Value?',
        subtitle: 'Exchange & True Value',
        content:
            'Yes, you can exchange any car brand or model at Kalyani Motors True Value. We provide a transparent digital 376-checkpoint vehicle evaluation, provide maximum fair market value, and apply spot exchange bonuses towards your new vehicle purchase.',
    },
];

export default function FAQsection({ faqs = DEFAULT_FAQS }) {
    const [openIds, setOpenIds] = useState([faqs[0]?.id]);

    const toggleItem = (id) => {
        setOpenIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <section className="w-[90%] mx-auto">
            {/* Header with entrance animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center mb-12 sm:mb-14"
            >
                <span className="text-xs font-semibold tracking-widest text-neutral-500 uppercase block mb-2">
                    Have Questions?
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                    Frequently Asked Questions
                </h2>
                <p className="text-neutral-600 text-xs sm:text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
                    Everything you need to know about buying, test drives, financing, and authorized Maruti Suzuki care across South India.
                </p>
            </motion.div>

            {/* Accordion with clean, neutral divider lines */}
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                {faqs.map((faq, index) => {
                    const isOpen = openIds.includes(faq.id);

                    return (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.04,
                                ease: [0.21, 0.47, 0.32, 0.98],
                            }}
                            className="py-5 sm:py-6"
                        >
                            <button
                                type="button"
                                onClick={() => toggleItem(faq.id)}
                                aria-expanded={isOpen}
                                className="group w-full flex items-start justify-between gap-6 text-left focus:outline-none"
                            >
                                <div className="flex-1 min-w-0 pr-2">
                                    {faq.subtitle && (
                                        <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block mb-1">
                                            {faq.subtitle}
                                        </span>
                                    )}
                                    <span className="font-display font-semibold text-base sm:text-lg text-neutral-900 group-hover:text-neutral-600 transition-colors block leading-snug">
                                        {faq.title || faq.question}
                                    </span>
                                </div>

                                <span className="mt-1 shrink-0 text-neutral-400 group-hover:text-neutral-900 transition-colors">
                                    <Plus
                                        className={`size-5 transition-transform duration-300 ease-out ${isOpen ? 'rotate-45 text-neutral-900' : ''
                                            }`}
                                    />
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: 'auto',
                                            opacity: 1,
                                            transition: {
                                                height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
                                                opacity: { duration: 0.2, delay: 0.05 },
                                            },
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                            transition: {
                                                height: { duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] },
                                                opacity: { duration: 0.1 },
                                            },
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-3 pb-1 text-sm text-neutral-600 leading-relaxed max-w-3xl">
                                            {faq.content || faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
