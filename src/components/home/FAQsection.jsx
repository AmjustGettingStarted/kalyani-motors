import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { motion } from 'framer-motion';
import {
    Plus,
    Car,
    CalendarCheck,
    ShieldCheck,
    Banknote,
    Wrench,
    Sparkles,
} from 'lucide-react';

const DEFAULT_FAQS = [
    {
        id: 'faq-1',
        icon: CalendarCheck,
        title: 'How do I book a doorstep test drive with Kalyani Motors?',
        subtitle: 'Booking & Test Drives',
        content:
            'You can schedule a doorstep test drive through our website by selecting your preferred Arena or Nexa car and nearest showroom. Our sales consultant will arrive at your home or office with the vehicle at your chosen date and time slot.',
    },
    {
        id: 'faq-2',
        icon: Banknote,
        title: 'What financing and EMI schemes are available for new cars?',
        subtitle: 'Finance & Payments',
        content:
            'We partner with leading banks like SBI, HDFC, ICICI, and Maruti Suzuki Smart Finance to offer on-the-spot loan approvals, low down-payment options, flexible 7-year tenures, and competitive interest rates with transparent paperwork.',
    },
    {
        id: 'faq-3',
        icon: Car,
        title: 'What is the main difference between Arena and Nexa dealerships?',
        subtitle: 'Channels & Portfolio',
        content:
            'Maruti Suzuki Arena caters to practical and high-utility family vehicles like the Swift, Dzire, Brezza, and Ertiga. Nexa represents our premium customer hospitality line with cutting-edge tech, featuring the Grand Vitara, Baleno, Fronx, and Jimny.',
    },
    {
        id: 'faq-4',
        icon: Wrench,
        title: 'How does the 60-Minute Express Service maintenance work?',
        subtitle: 'Service & Maintenance',
        content:
            'Our dedicated Express Service bays assign two synchronized technicians to handle periodic inspections, oil changes, brake checks, and washing in parallel, returning your vehicle within 60 minutes while you wait in our executive customer lounge.',
    },
    {
        id: 'faq-5',
        icon: ShieldCheck,
        title: 'What warranty and roadside assistance (RSA) is included?',
        subtitle: 'Warranty & Protection',
        content:
            'Every new Maruti Suzuki comes with a 2-year / 40,000 km standard manufacturer warranty, extendable up to 5 years or 1,00,000 km. We also provide 24/7 round-the-clock roadside emergency support across South India.',
    },
    {
        id: 'faq-6',
        icon: Sparkles,
        title: 'Can I exchange my old car of any brand through True Value?',
        subtitle: 'Exchange & True Value',
        content:
            'Yes, you can exchange any car brand or model at Kalyani Motors True Value. We provide a transparent digital 376-checkpoint vehicle evaluation, provide maximum fair market value, and apply spot exchange bonuses towards your new vehicle purchase.',
    },
];

export default function FaqSection({ faqs = DEFAULT_FAQS }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="w-[90%] max-w-6xl mx-auto py-16 will-change-transform"
        >
            {/* Header */}
            <div className="text-center mb-10">
                <span className="text-xs font-bold tracking-widest text-blue-800 uppercase block mb-1">
                    Have Questions?
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
                    Frequently Asked Questions
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
                    Everything you need to know about buying, test drives, financing, and authorized Maruti Suzuki care across South India.
                </p>
            </div>

            {/* Accordion Component */}
            <AccordionPrimitive.Root
                type="multiple"
                defaultValue={[faqs[0]?.id]}
                className="space-y-3.5"
            >
                {faqs.map((faq) => {
                    const Icon = faq.icon || Car;

                    return (
                        <AccordionPrimitive.Item
                            key={faq.id}
                            value={faq.id}
                            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm transition-all hover:border-slate-300 data-[state=open]:border-blue-200 data-[state=open]:shadow-md overflow-hidden"
                        >
                            <AccordionPrimitive.Header className="flex">
                                <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left outline-none transition-colors">
                                    {/* Left Side: Icon Container + Text */}
                                    <span className="flex items-center gap-4 sm:gap-5 min-w-0">
                                        <span
                                            aria-hidden="true"
                                            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-blue-600 transition-colors group-hover:bg-blue-50 group-hover:border-blue-100 group-data-[state=open]:bg-blue-600 group-data-[state=open]:text-white group-data-[state=open]:border-blue-600"
                                        >
                                            <Icon className="size-5 shrink-0" />
                                        </span>

                                        <span className="flex flex-col space-y-0.5 min-w-0">
                                            <span className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-800 group-data-[state=open]:text-blue-600 transition-colors truncate sm:whitespace-normal">
                                                {faq.title || faq.question}
                                            </span>
                                            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                {faq.subtitle || 'General Inquiry'}
                                            </span>
                                        </span>
                                    </span>

                                    {/* Right Side: Plus / X rotate trigger */}
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100/70 text-slate-500 transition-all group-hover:bg-slate-200 group-data-[state=open]:bg-blue-50 group-data-[state=open]:text-blue-600">
                                        <Plus className="size-4 shrink-0 transition-transform duration-300 ease-out group-data-[state=open]:rotate-45" />
                                    </span>
                                </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>

                            {/* Accordion Expandable Content */}
                            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                <div className="px-5 sm:px-7 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                    <p className="pl-0 sm:pl-[60px]">{faq.content || faq.answer}</p>
                                </div>
                            </AccordionPrimitive.Content>
                        </AccordionPrimitive.Item>
                    );
                })}
            </AccordionPrimitive.Root>
        </motion.section>
    );
}