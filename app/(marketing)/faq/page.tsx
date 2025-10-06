const FaqPage = () =>{
  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <h2 className="text-2xl font-bold mb-8 text-center text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        <FAQItem
          question="Who can use this app?"
          answer="Any team or organization looking to manage employees efficiently."
        />

        <FAQItem
          question="Is it easy to set up?"
          answer="Yes! Get started in minutes with no complicated setup."
        />

        <FAQItem
          question="Can I track employee status?"
          answer="Absolutely. View active, inactive, or terminated employees at a glance."
        />

        <FAQItem
          question="Is my data secure?"
          answer={`Yes. All employee data is stored securely with privacy in mind.`}
        />

        <FAQItem
          question="Can I manage multiple offices or locations?"
          answer="Yes. Assign addresses and track employees across different locations."
        />

        <FAQItem
          question="Does it work on mobile?"
          answer="Fully responsive, so you can manage your team on any device."
        />
      </div>
    </div>
  )
}

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-white">{question}</h4>
      <p className="text-gray-400 dark:text-gray-300">{answer}</p>
    </div>
  )
}

export default FaqPage